package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.ComprobanteRequest;
import com.qhatuna.exchange.app.rest.request.OperacionCriteriaRequest;
import com.qhatuna.exchange.app.rest.request.OperacionRequest;
import com.qhatuna.exchange.app.rest.response.AhorroResponse;
import com.qhatuna.exchange.app.rest.response.ComprobanteResponse;
import com.qhatuna.exchange.app.rest.response.OperacionResponse;
import com.qhatuna.exchange.app.rest.response.ReporteOperacion;
import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.component.CompilaJasperComponent;
import com.qhatuna.exchange.domain.model.*;
import com.qhatuna.exchange.domain.provider.sunat.SunatProvider;
import com.qhatuna.exchange.domain.provider.sunat.response.ComprobanteDatos;
import com.qhatuna.exchange.domain.repository.OperacionRepository;
import com.tenpisoft.n2w.MoneyConverters;
import io.github.project.openubl.xbuilder.content.models.standard.general.DocumentoVentaDetalle;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@AllArgsConstructor
@Service
public class OperacionService {
    private final OperacionRepository operacionRepository;
    private final SessionInfoService sessionInfoService;
    private final BancosService bancosService;
    private final TipoCambioService tipoCambioService;
    private final UsuarioService usuarioService;
    private final ClienteService clienteService;
    private final NotificacionService notificacionService;
    private final Environment env;
    private final CompilaJasperComponent jasperComponent;
    private final SunatProvider sunatProvider;
    private final CorreoService correoService;
    private final ComprobanteVentaService comprobanteVentaService;

    public List<AhorroResponse> recuperAhorroPublico(Integer opcion){
        LocalDate fecha = LocalDate.now();
        LocalDate semana = fecha.minusDays(7L);
        LocalDate mes = fecha.minusMonths(1L);
        LocalDate anio = fecha.minusYears(1L);
        List<AhorroResponse> lista = new ArrayList<>();
        List<Operacion> operaciones = switch (opcion) {
            case 1 -> operacionRepository.recuperaOperacionesPorDia(fecha);
            case 2 -> operacionRepository.recuperaOperacionesEntreFechas(semana, fecha);
            case 3 -> operacionRepository.recuperaOperacionesEntreFechas(mes, fecha);
            case 4 -> operacionRepository.recuperaOperacionesEntreFechas(anio, fecha);
            default -> throw new ProviderException(ErrorMsj.OPCION_NO_EXISTE.getMsj(), ErrorMsj.OPCION_NO_EXISTE.getCod());
        };
        BigDecimal totalLcExchange = BigDecimal.ZERO;
        BigDecimal totalBancos = BigDecimal.ZERO;
        for(Operacion operacion: operaciones){
            totalLcExchange = totalLcExchange.add(aSoles(operacion));
            totalBancos = totalBancos.add(aSolesAux(operacion));
        }
        lista.add(new AhorroResponse("1","Lc Exchange", totalLcExchange.setScale(2, RoundingMode.HALF_UP)));
        lista.add(new AhorroResponse("2","Sin Lc Exchange", totalBancos.setScale(2, RoundingMode.HALF_UP)));
        lista.add(new AhorroResponse("3","Ahorro", (totalLcExchange.subtract(totalBancos)).setScale(2, RoundingMode.HALF_UP)));
        return lista;
    }

    public void reasignar(Long id, Long operadorId){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setUsuarioActualizacion(usuario.getId());
        operacion.setOperador(usuarioService.recuperaUsuarioPorId(operadorId));
        operacionRepository.save(operacion);
    }


    @Transactional
    public void finaliza(Long id, ComprobanteRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        String path = Util.recuperaPathComprobantes();
        CuentaBancaria cuentaFnal = bancosService.recuperaCuentaBancariaPorId(request.bancoTransFinal());
        String direccionComprobante = Util.guardaComprobante(request.comprobante(), path, operacion.getTicket()+"_emp");
        operacion.setCodigoTransferenciaEmpresa(request.codigoTransferencia());
        operacion.setComprobanteEmpresa(direccionComprobante);
        operacion.setEstado(10);
        operacion.setCuentaTransferenciaFinal(cuentaFnal);
        operacion.setFechaFinalizacion(LocalDate.now());
        operacion.setUsuarioActualizacion(usuario.getId());
        operacion = operacionRepository.save(operacion);
        notificacionService.cambioEstadoOperacion(Operacion.aResponse(operacion));
        ComprobanteVenta comprobanteVenta = operacion.getCliente().esFactura()?comprobanteVentaService.creaNuevaFactura():comprobanteVentaService.creaNuevoComprobante();
        operacion.setComprobanteVenta(comprobanteVenta);
        enviarComprobanteVenta(operacion, comprobanteVenta);
        comprobanteVentaService.guarda(comprobanteVenta);
    }

    public void enviarComprobanteVenta(Operacion operacion, ComprobanteVenta comprobanteVenta){
        try {
            DocumentoVentaDetalle ventaDetalle = DocumentoVentaDetalle.builder()
                    .descripcion("Cambio de "+(operacion.getMonto().setScale(2,RoundingMode.HALF_UP))+" "+operacion.getCuentaOrigen().getMomedaSigla()+" a "+ operacion.getCuentaDestino().getMomedaSigla()+" con tipo de cambio "+operacion.getCambio().toString())
                    .cantidad(new BigDecimal("1"))
                    .precio(operacion.getMonto())
                    .unidadMedida(env.getProperty("lc-exchange.sunat.unidade-medida"))
                    .build();
            ComprobanteDatos datos =sunatProvider.enviaFactura(
                    Cliente.aClienteSunat(operacion.getCliente()),
                    ventaDetalle,
                    comprobanteVenta,
                    operacion
            );
            comprobanteVenta.setEnvioSunat(true);
            String rutaReporte = imprimeFacturaPdf(operacion, datos);
            comprobanteVenta.setRutaFacturaImpresa(rutaReporte);
            Usuario clienteUs = usuarioService.recuperaUsuarioPorId(operacion.getCliente().getUsuarioId());
            correoService.sendSimpleMessageWithAttachment(
                    clienteUs.getCorreo(),
                    ConstValues.ASUNTO_COMPROBANTE,
                    String.format(ConstValues.CUERPO_COMPROBANTE, operacion.getTicket()),
                    rutaReporte
            );
        }catch (Exception ex){
            log.error(ex.getMessage());
        }
    }

    public void accionesOperador(Long id, Integer estado){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setEstado(estado);
        if(estado.equals(0) && (operacion.getComprobante()==null)){
                operacion.setEstado(6);

        }
        operacion.setUsuarioActualizacion(usuario.getId());
        operacion = operacionRepository.save(operacion);
        notificacionService.cambioEstadoOperacion(Operacion.aResponse(operacion));
    }

    public ComprobanteResponse recuperaComprobante(Long operacionId, Integer tipo){
        Operacion operacion = recuperaOperacionPorId(operacionId);
        String fileType = operacion.getComprobante().substring(operacion.getComprobante().lastIndexOf(".") + 1).toLowerCase();
        String prefix;
        if ("jpeg".equals(fileType) || "jpg".equals(fileType)) {
            prefix = "data:image/jpeg;base64,";
        } else if ("png".equals(fileType)) {
            prefix = "data:image/png;base64,";
        } else {
            throw new ProviderException(ErrorMsj.NOHAY_COMPROBANTE.getMsj(),ErrorMsj.NOHAY_COMPROBANTE.getCod());
        }
        return new ComprobanteResponse(
                Util.convertirImageABase64(tipo==2?operacion.getComprobanteEmpresa():operacion.getComprobante()),
                prefix,
                fileType,
                operacion.getTicket()+"_"+(tipo==2?"LcExchange":"Cliente")+"."+fileType
                );
    }

    public List<ReporteOperacion> recuperaReporteOperacion(Integer page, Integer size, OperacionCriteriaRequest request){
        Page<Operacion> operaciones = recuperaOperacionPaginado(page, size, request);
        return operaciones.stream().toList().stream().map(Operacion::aReporteOperacion).toList();
    }

    public Page<OperacionResponse> operacionPaginado(Integer page, Integer size, OperacionCriteriaRequest request){
        Page<Operacion> operaciones = recuperaOperacionPaginado(page, size, request);
        return operaciones.map(Operacion::aResponse);
    }

    public Page<Operacion> recuperaOperacionPaginado(Integer page, Integer size, OperacionCriteriaRequest request){
        if(request.inicio().isAfter(request.fin()))
            throw new ProviderException(ErrorMsj.INICIO_ANTES_FIN.getMsj(), ErrorMsj.INICIO_ANTES_FIN.getCod());
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        if(usuario.esCliente()){
            String nroDocumento="0";
            try {
                Cliente cliente = clienteService.recuperaClientePorUsuarioId(usuario.getId());
                nroDocumento = cliente.getNroDocumento();
            }catch (Exception ex){
                //No se hace nada el nroDocumento permanece con 0
            }
            request = new OperacionCriteriaRequest(
                    request.inicio(),
                    request.fin(),
                    null,
                    null,
                    nroDocumento,
                    request.ticket(),
                    0L,
                    100
            );
        }
        Specification<Operacion> especificacion = specificacionConCriterios(request);
        return operacionRepository.findAll(especificacion, pageable);
    }

    @Transactional
    public Long crea(OperacionRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        CuentaBancaria origen =  bancosService.recuperaCuentaBancariaPorId(request.cuentaOrigenId());
        CuentaBancaria destino =  bancosService.recuperaCuentaBancariaPorId(request.cuentaDestinoId());
        CuentaBancaria transferencia =  bancosService.recuperaCuentaBancariaPorId(request.cuentaTransferenciaId());
        TipoCambio tipoCambio =  tipoCambioService.recuperaTipoCambioPorId(request.tipoCambioId());
        TipoCambio tipoCambioBancos = tipoCambioService.recuperaTCBancos();
        Cliente cliente = clienteService.recuperaClientePorUsuarioId(usuario.getId());
        if(!cliente.isValidado()){
            throw new ProviderException(
                    ErrorMsj.CLIENTE_NO_VALIDADO.getMsj(),
                    ErrorMsj.CLIENTE_NO_VALIDADO.getCod(),
                    HttpStatus.BAD_REQUEST
            );
        }
        Operacion operacion = Operacion.builder()
                .tipoTransferencia(1)
                .cuentaOrigen(origen)
                .cuentaDestino(destino)
                .cuentaTransferencia(transferencia)
                .monto(request.monto())
                .montoFinal(calculaCambio(origen, destino, request.monto(), tipoCambio))
                .montoBancosAux(calculaCambio(origen, destino, request.monto(), tipoCambioBancos))
                .estado(6)
                .usuarioCreacion(usuario.getId())
                .tipoCambio(tipoCambio)
                .operador(asignaOperador())
                .cliente(cliente)
                .build();
        operacion = operacionRepository.save(operacion);
        String ticket = String.format("%08d", operacion.getId());
        operacionRepository.updateTicket(operacion.getId(), ticket);
        return operacion.getId();
    }

    public void actualiza(Long id, Integer op, OperacionRequest request){
        if(op.equals(1)){
            actualiza(id, request);
        } else if (op.equals(2)) {
            confirma(id, request);
        }else {
            throw new ProviderException(
                    ErrorMsj.OPCION_NO_EXISTE.getMsj(),
                    ErrorMsj.OPCION_NO_EXISTE.getCod(),
                    HttpStatus.BAD_REQUEST
                    );
        }
    }

    public void actualizaComprobante(Long id, ComprobanteRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        String path = Util.recuperaPathComprobantes();
        String direccionComprobante = Util.guardaComprobante(request.comprobante(), path, operacion.getTicket());
        operacion.setCodigoTransferencia(request.codigoTransferencia());
        operacion.setComprobante(direccionComprobante);
        operacion.setEstado(0);
        operacion.setUsuarioActualizacion(usuario.getId());
        operacion = operacionRepository.save(operacion);
        notificacionService.cambioEstadoOperacion(Operacion.aResponse(operacion));
    }

    public Operacion recuperaOperacionPorId(Long id){
        return operacionRepository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.OPERACION_NOEXISTE.getMsj(),
                        ErrorMsj.OPERACION_NOEXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }

    public BigDecimal calculaCambio(CuentaBancaria cuentaOrigen, CuentaBancaria cuentaDestino, BigDecimal monto, TipoCambio tipoCambio){
        if(cuentaOrigen.esDolares() && cuentaDestino.esSoles()){
            return monto.multiply(tipoCambio.getCompra()).setScale(2, RoundingMode.HALF_UP);
        } else if (cuentaOrigen.esSoles() && cuentaDestino.esDolares()) {
            return monto.divide(tipoCambio.getVenta(), 2, RoundingMode.HALF_UP);
        } else {
            throw new ProviderException(ErrorMsj.CONVERSION_NO_PERMITIDO.getMsj(), ErrorMsj.CONVERSION_NO_PERMITIDO.getCod(), HttpStatus.BAD_REQUEST);
        }
    }

    public Usuario asignaOperador(){
        List<Usuario> operadores = usuarioService.recuperaOperadoresActivos();
        if(!operadores.isEmpty()){
            List<Usuario> asignables = operadores.stream()
                    .filter(item -> !item.isBloqueado())
                    .filter(item -> LocalDateTime.now().isAfter(item.getInicio()) && LocalDateTime.now().isBefore(item.getFin()))
                    .toList();
            List<Usuario> listaParaAsignar = asignables.isEmpty() ? operadores : asignables;
            int randomIndex = ThreadLocalRandom.current().nextInt(listaParaAsignar.size());
            return listaParaAsignar.get(randomIndex);
        }else {
            return null;
        }
    }

    public String imprimeFacturaPdf(Operacion operacion, ComprobanteDatos documento){
        HashMap<String, Object> map = new HashMap<>();
        map.put("P_EMP_RUC", env.getProperty("lc-exchange.factura.ruc.value"));
        map.put("P_EMP_TITULO", operacion.getCliente().esFactura()?"FACTURA ELECTRÓNICA":"BOLETA DE VENTA ELECTRÓNICA");
        map.put("P_EMP_NR_FACTURA", documento.numero());
        map.put("P_EMP_RAZON_SOCIAL", env.getProperty("lc-exchange.factura.razon-social.value"));
        map.put("P_EMP_DIRECCION", env.getProperty("lc-exchange.factura.direccion.value"));
        map.put("P_CLI_TIPO_DOC", operacion.getCliente().getTipoDocDesc());
        map.put("P_CLI_DOCUMENTO", operacion.getCliente().getNroDocumento());
        map.put("P_CLI_NOMBRE", operacion.getCliente().getNombreCompleto());
        map.put("P_FECHA_EMISION", Util.dateADD_MM_YYYY(documento.fechaEmision()));
        map.put("P_MONEDA", operacion.getCuentaOrigen().getMomedaDesc());
        map.put("P_CANTIDAD", "1");
        map.put("P_UN_MEDIDA", "M4");
        map.put("P_DESCRIPCION", documento.concepto());
        map.put("P_IMPORTE", String.valueOf(operacion.getMonto().setScale(2,RoundingMode.HALF_UP)));
        map.put("P_PRE_UNITARIO", String.valueOf(operacion.getMonto().setScale(2,RoundingMode.HALF_UP)));
        map.put("P_FORMA_PAGO", "Transferencia electrónica de fondos");
        MoneyConverters converter = MoneyConverters.SPANISH_BANKING_MONEY_VALUE;
        map.put("P_IMPORTE_LETRA", "SON "+converter.asWords(operacion.getMonto().setScale(2,RoundingMode.HALF_UP)).toUpperCase()+" "+operacion.getCuentaOrigen().getMomedaDesc());
        map.put("P_QR_DATOS", documento.numero()+"|"+operacion.getMonto());
        byte[] byt = jasperComponent.buildDocument(map, "factura.jrxml");
        return Util.guardaArchivo(byt, "comprobanteEnviadoAlCliente",operacion.getTicket()+".pdf");
    }

    public Operacion recuperaOperacionPorComprovanteVentaId(Long comprobanteVentaId){
        return operacionRepository.recuperaPorComprobanteVentaId(comprobanteVentaId);
    }

    private void actualiza(Long id, OperacionRequest request){
        CuentaBancaria origen =  bancosService.recuperaCuentaBancariaPorId(request.cuentaOrigenId());
        CuentaBancaria destino =  bancosService.recuperaCuentaBancariaPorId(request.cuentaDestinoId());
        CuentaBancaria transferencia =  bancosService.recuperaCuentaBancariaPorId(request.cuentaTransferenciaId());
        TipoCambio tipoCambio =  tipoCambioService.recuperaTipoCambioPorId(request.tipoCambioId());
        TipoCambio tipoCambioBancos = tipoCambioService.recuperaTCBancos();

        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setCuentaOrigen(origen);
        operacion.setCuentaDestino(destino);
        operacion.setCuentaTransferencia(transferencia);
        operacion.setTipoCambio(tipoCambio);
        operacion.setMonto(request.monto());
        operacion.setMontoFinal(calculaCambio(origen, destino, request.monto(), tipoCambio));
        operacion.setMontoBancosAux(calculaCambio(origen, destino, request.monto(), tipoCambioBancos));
        operacion.setUsuarioActualizacion(usuario.getId());
        operacionRepository.save(operacion);
    }

    private void confirma(Long id, OperacionRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        String path = Util.recuperaPathComprobantes();
        String direccionComprobante = Util.guardaComprobante(request.comprobante(), path, operacion.getTicket());
        if(operacion.getCodigoTransferencia()==null){
            operacion.setEstado(0);
        }
        operacion.setCodigoTransferencia(request.codigoTransferencia());
        operacion.setComprobante(direccionComprobante);
        operacion.setUsuarioActualizacion(usuario.getId());
        //AKA
        operacionRepository.save(operacion);
    }

    private static Specification<Operacion> specificacionConCriterios(OperacionCriteriaRequest criteria) {
        final String cliente = "cliente";
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            LocalDateTime inicio = criteria.inicio().atStartOfDay();
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("fechaCreacion"), inicio));
            LocalDateTime fin = criteria.fin().atTime(23, 59, 59);
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("fechaCreacion"), fin));

            if (criteria.operador() != null && criteria.operador()>0) {
                predicates.add(criteriaBuilder.equal((root.get("operador")).get("id"), criteria.operador()));
            }

            if (criteria.estado() != null && criteria.estado()<10) {
                predicates.add(criteriaBuilder.equal(root.get("estado"), criteria.estado()));
            }

            if (criteria.ticket() != null && !criteria.ticket().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("ticket"), criteria.ticket()));
            }

            if (criteria.nombres() != null && !criteria.nombres().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower((root.get(cliente)).get("nombres")),
                        "%" + criteria.nombres().toLowerCase() + "%"));
            }
            if (criteria.paterno() != null && !criteria.paterno().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower((root.get(cliente)).get("paterno")),
                        "%" + criteria.paterno().toLowerCase() + "%"));
            }
            if (criteria.nroDocumento() != null && !criteria.nroDocumento().isEmpty()) {
                predicates.add(criteriaBuilder.equal((root.get(cliente)).get("nroDocumento"), criteria.nroDocumento()));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private BigDecimal aSoles(Operacion operacion){
        BigDecimal monto = operacion.getMontoFinal();
        if(operacion.getCuentaDestino().esDolares()){
            monto = operacion.getMontoFinal().multiply(operacion.getTipoCambio().getCompra());
        }
        return monto;
    }
    private BigDecimal aSolesAux(Operacion operacion){
        BigDecimal monto = operacion.getMontoBancosAux();
        if(operacion.getCuentaDestino().esDolares()){
            monto = operacion.getMontoBancosAux().multiply(operacion.getTipoCambio().getCompra());
        }
        return monto;
    }

}
