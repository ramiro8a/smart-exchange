package com.qhatuna.exchange.app.rest.request;

import com.qhatuna.exchange.domain.model.Rol;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioRequest (
        Integer version,
        Integer estado,
        String usuario,
        String correo,
        String celular,
        boolean bloqueado,
        LocalDateTime inicio,
        LocalDateTime fin,
        List<Long> roles
){}
