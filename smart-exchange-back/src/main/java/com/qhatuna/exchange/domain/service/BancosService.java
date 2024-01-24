package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.CuentaBancariaRequest;
import com.qhatuna.exchange.app.rest.response.BancoResponse;
import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
import com.qhatuna.exchange.app.rest.response.CuentasRegistradasResponse;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.*;
import com.qhatuna.exchange.domain.repository.BancosRepository;
import com.qhatuna.exchange.domain.repository.CuentaBancariaRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BancosService {
    private final BancosRepository bancosRepository;
    private final SessionInfoService sessionInfoService;
    private final CuentaBancariaRepository cuentaBancariaRepository;
    private final EmpresaService empresaService;
    private final OperacionService operacionService;
    public BancosService(BancosRepository bancosRepository,
                         SessionInfoService sessionInfoService,
                         CuentaBancariaRepository cuentaBancariaRepository,
                         EmpresaService empresaService,
                         @Lazy OperacionService operacionService) {
        this.bancosRepository = bancosRepository;
        this.sessionInfoService = sessionInfoService;
        this.cuentaBancariaRepository = cuentaBancariaRepository;
        this.empresaService = empresaService;
        this.operacionService = operacionService;
    }

    public void habilitaDeshabilitaCuenta(Long cuentaId, boolean estado){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        CuentaBancaria cuenta = recuperaCuentaBancariaPorId(cuentaId);
        cuenta.setUsuarioActualizacion(usuario.getId());
        cuenta.setEstado(estado? Const.EstadoRegistro.ACTIVO:Const.EstadoRegistro.DESHABILITADO);
        cuentaBancariaRepository.save(cuenta);
    }

    public List<CuentaBancariaResponse> recuperaBancosTransferenciaFinal(Long operacionID){
        Operacion operacion = operacionService.recuperaOperacionPorId(operacionID);
        List<CuentaBancaria> cuentas = cuentaBancariaRepository.recuperaActivosEmpresa();
        List<CuentaBancaria> resultado = new ArrayList<>();
        cuentas.forEach(item->{
            if (Objects.equals(operacion.getCuentaDestino().getMoneda(), item.getMoneda())){
                resultado.add(item);
            }
        });
        return resultado.stream().map(CuentaBancaria::aResponse).toList();
    }

    public CuentaBancariaResponse recuperaDestinoTransferencia(Long bancoId, Integer moneda){
        List<CuentaBancaria> cuentasBancarias = cuentaBancariaRepository.recuperaCuentaTransferencia(bancoId, moneda);
        Empresa empresa = empresaService.recuperaEmpresa();
        if (!cuentasBancarias.isEmpty()){
            return CuentaBancaria.aResponseTrasnsf(cuentasBancarias.get(0), empresa.getRuc(), empresa.getRazonSocial());
        }else{
            List<CuentaBancaria> cuentasBancariasDefault = cuentaBancariaRepository.recuperaCuentaTransferenciaDefault(moneda);
            if(!cuentasBancariasDefault.isEmpty()){
                return CuentaBancaria.aResponseTrasnsf(cuentasBancariasDefault.get(0), empresa.getRuc(), empresa.getRazonSocial());
            }else {
                throw new ProviderException(ErrorMsj.MONEDA_NO_CONFIGURADA.getMsj(), ErrorMsj.MONEDA_NO_CONFIGURADA.getCod());
            }
        }
    }

    public List<CuentaBancariaResponse> recuperaCuentasBancariasCliente(){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        List<CuentaBancariaResponse> lista;
        if(usuario.esCliente()){
            List<CuentaBancaria> cuentasBacarias = cuentaBancariaRepository.recuperaActivosPorUsuarioId(usuario.getId());
            lista = cuentasBacarias.stream().map(CuentaBancaria::aResponse).toList();
        }else {
            List<CuentaBancaria> cuentasBacarias = cuentaBancariaRepository.recuperaActivosEmpresa();
            lista = cuentasBacarias.stream().map(CuentaBancaria::aResponse).toList();
        }
        return lista;
    }

    public CuentasRegistradasResponse recuperaCuentasRegistradasCliente(Integer monedaOrigen, Integer monedaDestino){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        List<CuentaBancaria> cuentasBacarias = cuentaBancariaRepository.recuperaActivosPorUsuarioId(usuario.getId());
        Set<BancoResponse> bancosOrigen = new HashSet<>();
        Set<BancoResponse> bancosDestino = new HashSet<>();
        List<CuentaBancariaResponse> cuentasOrigen = new ArrayList<>();
        List<CuentaBancariaResponse> cuentasDestino = new ArrayList<>();
        cuentasBacarias.forEach(item->{
            if(monedaOrigen.equals(item.getMoneda())) {
                bancosOrigen.add(Bancos.aResponse(item.getBanco()));
                cuentasOrigen.add(CuentaBancaria.aResponse(item));
            }
            if(monedaDestino.equals(item.getMoneda())) {
                bancosDestino.add(Bancos.aResponse(item.getBanco()));
                cuentasDestino.add(CuentaBancaria.aResponse(item));
            }
        });
/*        Set<BancoResponse> bancos = cuentasBacarias.stream()
                .map(CuentaBancaria::getBanco)
                .map(Bancos::aResponse)
                .collect(Collectors.toSet());
        List<CuentaBancariaResponse> cuentas = cuentasBacarias.stream().map(CuentaBancaria::aResponse).toList();*/
        return new CuentasRegistradasResponse(bancosOrigen, bancosDestino, cuentasOrigen, cuentasDestino);
    }

    public List<BancoResponse> recuperaActivos(){
        List<Bancos> bancos = bancosRepository.recuperaActivos();
        return bancos.stream().map(Bancos::aResponse).toList();
    }

    public CuentaBancariaResponse creaCuentaBancaria(CuentaBancariaRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Bancos banco = bancosRepository.findById(request.banco())
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.BANCO_NO_EXISTE.getMsj(),
                        ErrorMsj.BANCO_NO_EXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
        CuentaBancaria cuenta = CuentaBancaria.builder()
                .tipoCuenta(request.tipoCuenta())
                .moneda(request.moneda())
                .nroCuenta(request.numeroCuenta().trim())
                .nombre(request.nombre())
                .usuarioId(usuario.getId())
                .usuarioCreacion(usuario.getId())
                .banco(banco)
                .build();
        if(!usuario.esCliente()){
            cuenta.setUsuarioId(0L);
        }
        return CuentaBancaria.aResponse(cuentaBancariaRepository.save(cuenta));
    }

    public CuentaBancaria recuperaCuentaBancariaPorId(Long id){
        return cuentaBancariaRepository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CUENTA_NO_EXISTE.getMsj(),
                        ErrorMsj.CUENTA_NO_EXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }
}
