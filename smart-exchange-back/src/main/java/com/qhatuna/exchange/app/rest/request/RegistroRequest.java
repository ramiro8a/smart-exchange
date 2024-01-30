package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistroRequest(
/*        @NotBlank
        String nombres,
        @NotBlank
        String apPaterno,
        String apMaterno,*/
        @NotBlank
        @Email
        String correo,
        @NotBlank
        String password,
        @NotBlank
        String rePassword,
        //@NotBlank
        String token
) {}
