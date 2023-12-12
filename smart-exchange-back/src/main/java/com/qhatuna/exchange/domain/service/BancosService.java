package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.CuentaBancariaRequest;
import com.qhatuna.exchange.app.rest.response.BancoResponse;
import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
import com.qhatuna.exchange.app.rest.response.CuentasRegistradasResponse;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.Bancos;
import com.qhatuna.exchange.domain.model.CuentaBancaria;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.BancosRepository;
import com.qhatuna.exchange.domain.repository.CuentaBancariaRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class BancosService {
    private final BancosRepository bancosRepository;
    private final SessionInfoService sessionInfoService;
    private final CuentaBancariaRepository cuentaBancariaRepository;

    public List<CuentaBancariaResponse> recuperaCuentasBancariasCliente(){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        List<CuentaBancaria> cuentasBacarias = cuentaBancariaRepository.recuperaActivosPorUsuarioId(usuario.getId());
        return cuentasBacarias.stream().map(CuentaBancaria::aResponse).toList();
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
        return CuentaBancaria.aResponse(cuentaBancariaRepository.save(cuenta));
    }
}
