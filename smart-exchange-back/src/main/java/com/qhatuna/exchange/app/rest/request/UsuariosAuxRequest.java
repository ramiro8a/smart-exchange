package com.qhatuna.exchange.app.rest.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UsuariosAuxRequest(
   @NotNull
   Integer opc,
   @Email
   @NotNull
   String email
) {}
