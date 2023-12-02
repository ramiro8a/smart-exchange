package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioRequest (
        Integer version,
        Integer estado,
        String usuario,
        String password,
        String correo,
        String celular,
        boolean bloqueado,
        LocalDateTime inicio,
        LocalDateTime fin,
        @NotNull
        @NotEmpty
        List<Long> roles
){}
