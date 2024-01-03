package com.qhatuna.exchange.domain.provider.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PersonaDataResponse(
        String numero,
        @JsonProperty(value = "nombre_completo")
        String nombreCompleto,
        String nombres,
        @JsonProperty(value = "apellido_paterno")
        String paterno,
        @JsonProperty(value = "apellido_materno")
        String materno,
        @JsonProperty(value = "direccion_completa")
        String direccionCompleta,
        String direccion,
        String departamento,
        String provincia,
        String distrito,
        @JsonProperty(value = "codigo_verificacion")
        String codigoVerificacion
) {
}
