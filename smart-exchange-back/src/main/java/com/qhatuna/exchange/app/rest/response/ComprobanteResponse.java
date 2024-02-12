package com.qhatuna.exchange.app.rest.response;

public record ComprobanteResponse(
        String base64,
        String prefijo,
        String tipo,
        String nombreArchivo
) {}
