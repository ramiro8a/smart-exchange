package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.NotEmpty;

public record BancoRequest(
        @NotEmpty
        String nombre
) {
}
