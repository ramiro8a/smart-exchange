package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;
import java.time.LocalDate;
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
        CuentaBancariaResponse salidaTransferencia,
        BigDecimal monto,
        BigDecimal montoFinal,
        TipoCambioResponse tipoCambio,
        String codigoTransferencia,
        String codigoTransferenciaEmpresa,
        ClienteResponse cliente,
        UsuarioResponse operador,
        String ticket,
        LocalDate fechaFinalizacion,
        boolean envioSunat
) {}
