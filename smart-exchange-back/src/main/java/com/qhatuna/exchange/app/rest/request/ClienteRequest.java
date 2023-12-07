package com.qhatuna.exchange.app.rest.request;

public record ClienteRequest(
        String nombres,
        //String sNombre,
        String paterno,
        String materno,
        Integer tipoDocumento,
        String nroDocumento,
        String telefono,
        String celular,
        String dniAnverso,
        String dniReverso
) {}
