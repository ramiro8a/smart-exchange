package com.qhatuna.exchange.app.rest.response;

public record ClienteResponse(
        Long id,
        String nombres,
        String paterno,
        String materno,
        Integer tipoDocumento,
        String nroDocumento,
        String telefono,
        String celular
) {}
