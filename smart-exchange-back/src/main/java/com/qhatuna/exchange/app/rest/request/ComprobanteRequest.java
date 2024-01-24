package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.NotNull;

public record ComprobanteRequest (
        @NotNull
        String codigoTransferencia,
        @NotNull
        String comprobante,
        Long bancoTransFinal
){}
