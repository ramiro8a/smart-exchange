package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.OperacionRequest;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.CuentaBancaria;
import com.qhatuna.exchange.domain.model.Operacion;
import com.qhatuna.exchange.domain.model.TipoCambio;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.CuentaBancariaRepository;
import com.qhatuna.exchange.domain.repository.OperacionRepository;
import com.qhatuna.exchange.domain.repository.TipoCambioRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class OperacionService {
    private final OperacionRepository operacionRepository;
    private final SessionInfoService sessionInfoService;
    private final CuentaBancariaRepository cuentaBancariaRepository;
    private final TipoCambioRepository tipoCambioRepository;

    public Long crea(OperacionRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        CuentaBancaria origen =  cuentaBancariaRepository.findById(request.cuentaOrigenId())
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CUENTA_ORIGEN.getMsj(),
                        ErrorMsj.CUENTA_ORIGEN.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
        CuentaBancaria destino =  cuentaBancariaRepository.findById(request.cuentaDestinoId())
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CUENTA_DESTINO.getMsj(),
                        ErrorMsj.CUENTA_DESTINO.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
        CuentaBancaria transferencia =  cuentaBancariaRepository.findById(request.cuentaTransferenciaId())
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CUENTA_TRANSFERENCIA.getMsj(),
                        ErrorMsj.CUENTA_TRANSFERENCIA.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
        TipoCambio tipoCambio =  tipoCambioRepository.findById(request.tipoCambioId())
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.TIPO_CAMBIO.getMsj(),
                        ErrorMsj.TIPO_CAMBIO.getCod(),
                        HttpStatus.BAD_REQUEST
                ));

        Operacion operacion = Operacion.builder()
                .tipoTransferencia(1)
                .cuentaOrigen(origen)
                .cuentaDestino(destino)
                .cuentaTransferencia(transferencia)
                .monto(request.monto())
                .usuarioCreacion(usuario.getId())
                .tipoCambio(tipoCambio)
                .build();
        return (operacionRepository.save(operacion)).getId();
    }

}
