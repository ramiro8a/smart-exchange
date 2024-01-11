package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.ComprobanteRequest;
import com.qhatuna.exchange.app.rest.request.OperacionCriteriaRequest;
import com.qhatuna.exchange.app.rest.request.OperacionRequest;
import com.qhatuna.exchange.app.rest.response.ComprobanteResponse;
import com.qhatuna.exchange.app.rest.response.OperacionResponse;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.model.*;
import com.qhatuna.exchange.domain.repository.OperacionRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@AllArgsConstructor
@Service
public class OperacionService {
    private final OperacionRepository operacionRepository;
    private final SessionInfoService sessionInfoService;
    private final BancosService bancosService;
    private final TipoCambioService tipoCambioService;
    private final UsuarioService usuarioService;
    private final ClienteService clienteService;


    public void reasignar(Long id, Long operadorId){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setUsuarioActualizacion(usuario.getId());
        operacion.setOperador(usuarioService.recuperaUsuarioPorId(operadorId));
        operacionRepository.save(operacion);
    }

    public void finaliza(Long id, String codTransferencia){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setEstado(10);
        operacion.setCodigoTransferenciaEmpresa(codTransferencia);
        operacion.setUsuarioActualizacion(usuario.getId());
        operacionRepository.save(operacion);
    }

    public void accionesOperador(Long id, Integer estado){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setEstado(estado);
        if(estado.equals(0) && (operacion.getComprobante()==null)){
                operacion.setEstado(6);

        }
        operacion.setUsuarioActualizacion(usuario.getId());
        operacionRepository.save(operacion);
    }

    public ComprobanteResponse recuperaComprobante(Long operacionId){
        Operacion operacion = recuperaOperacionPorId(operacionId);
        return new ComprobanteResponse(Util.convertirImageABase64(operacion.getComprobante()));
    }

    public Page<OperacionResponse> operacionPaginado(Integer page, Integer size, OperacionCriteriaRequest request){
        if(request.inicio().isAfter(request.fin()))
            throw new ProviderException(ErrorMsj.INICIO_ANTES_FIN.getMsj(), ErrorMsj.INICIO_ANTES_FIN.getCod());
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        if(usuario.esCliente()){
            Cliente cliente =clienteService.recuperaClientePorUsuarioId(usuario.getId());
            request = new OperacionCriteriaRequest(
                    request.inicio(),
                    request.fin(),
                    null,
                    null,
                    cliente.getNroDocumento(),
                    request.ticket(),
                    0L
            );
        }
        Specification<Operacion> especificacion = specificacionConCriterios(request);
        Page<Operacion> operaciones = operacionRepository.findAll(especificacion, pageable);
        return operaciones.map(Operacion::aResponse);
    }

    @Transactional
    public Long crea(OperacionRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        CuentaBancaria origen =  bancosService.recuperaCuentaBancariaPorId(request.cuentaOrigenId());
        CuentaBancaria destino =  bancosService.recuperaCuentaBancariaPorId(request.cuentaDestinoId());
        CuentaBancaria transferencia =  bancosService.recuperaCuentaBancariaPorId(request.cuentaTransferenciaId());
        TipoCambio tipoCambio =  tipoCambioService.recuperaTipoCambioPorId(request.tipoCambioId());
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
        operacionRepository.save(operacion);
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

    private void actualiza(Long id, OperacionRequest request){
        CuentaBancaria origen =  bancosService.recuperaCuentaBancariaPorId(request.cuentaOrigenId());
        CuentaBancaria destino =  bancosService.recuperaCuentaBancariaPorId(request.cuentaDestinoId());
        CuentaBancaria transferencia =  bancosService.recuperaCuentaBancariaPorId(request.cuentaTransferenciaId());
        TipoCambio tipoCambio =  tipoCambioService.recuperaTipoCambioPorId(request.tipoCambioId());

        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        operacion.setCuentaOrigen(origen);
        operacion.setCuentaDestino(destino);
        operacion.setCuentaTransferencia(transferencia);
        operacion.setTipoCambio(tipoCambio);
        operacion.setMonto(request.monto());
        operacion.setMontoFinal(calculaCambio(origen, destino, request.monto(), tipoCambio));
        operacion.setUsuarioActualizacion(usuario.getId());
        operacionRepository.save(operacion);
    }

    private void confirma(Long id, OperacionRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Operacion operacion = recuperaOperacionPorId(id);
        String path = Util.recuperaPathComprobantes();
        String direccionComprobante = Util.guardaComprobante(request.comprobante(), path, operacion.getTicket());
        operacion.setEstado(0);
        operacion.setCodigoTransferencia(request.codigoTransferencia());
        operacion.setComprobante(direccionComprobante);
        operacion.setUsuarioActualizacion(usuario.getId());
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

}
