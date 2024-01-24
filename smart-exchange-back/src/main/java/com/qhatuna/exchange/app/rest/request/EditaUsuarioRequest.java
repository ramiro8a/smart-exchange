package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record EditaUsuarioRequest(
        String correo,
        LocalDateTime inicio,
        LocalDateTime fin,
        @NotNull
        @NotEmpty
        List<Long> roles
) {}
