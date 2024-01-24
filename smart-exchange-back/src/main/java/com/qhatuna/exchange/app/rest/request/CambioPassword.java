package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.NotNull;

public record CambioPassword(
        @NotNull
        Long id,
        @NotNull
        String password
) {
}
