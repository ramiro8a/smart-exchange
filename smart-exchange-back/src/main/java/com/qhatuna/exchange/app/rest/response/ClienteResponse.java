package com.qhatuna.exchange.app.rest.response;

import java.time.LocalDateTime;

public record ClienteResponse(
        Long id,
        LocalDateTime fechaCreacion,
        String nombres,
        String paterno,
        String materno,
        Integer tipoDocumento,
        String nroDocumento,
        String telefono,
        String celular,
        Integer estado,
        boolean validado
) {}
