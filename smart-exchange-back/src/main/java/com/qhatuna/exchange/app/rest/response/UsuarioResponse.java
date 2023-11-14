package com.qhatuna.exchange.app.rest.response;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioResponse (
        Long id,
        String creacion,
        String actualizacion,
        Integer version,
        Integer estado,
        String usuario,
        String correo,
        String celular,
        boolean bloqueado,
        LocalDateTime inicio,
        LocalDateTime fin,
        List<RolResponse> roles
) {}
