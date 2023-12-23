package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OperacionResponse(
        Long id,
        LocalDateTime fechaCreacion,
        Integer version,
        Integer estado,
        Integer tipoTransferencia,
        CuentaBancariaResponse cuentaOrigen,
        CuentaBancariaResponse cuentaDestino,
        CuentaBancariaResponse cuentaTransferencia,
        BigDecimal monto,
        BigDecimal montoFinal,
        TipoCambioResponse tipoCambio,
        String codigoTransferencia,
        ClienteResponse cliente,
        UsuarioResponse operador,
        String ticket
) {}
