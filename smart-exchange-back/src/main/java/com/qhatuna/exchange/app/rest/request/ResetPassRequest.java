package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.NotNull;

public record ResetPassRequest(
        @NotNull
        String token,
        @NotNull
        String password,
        @NotNull
        String tokenRecaptcha
) {
}
