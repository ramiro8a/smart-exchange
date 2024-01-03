package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OperacionRequest (
        @Min(value = 1)
        BigDecimal monto,
        @NotNull
        Long cuentaOrigenId,
        @NotNull
        Long cuentaDestinoId,
        @NotNull
        Long cuentaTransferenciaId,
        @NotNull
        Long tipoCambioId,
        String codigoTransferencia,
        String comprobante
){}
