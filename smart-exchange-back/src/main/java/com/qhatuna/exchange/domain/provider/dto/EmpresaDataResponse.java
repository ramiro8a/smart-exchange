package com.qhatuna.exchange.domain.provider.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmpresaDataResponse(
        String ruc,
        @JsonProperty(value = "nombre_o_razon_social")
        String razonSocial,
        String direccion,
        String estado,
        String condicion,
        String departamento,
        String provincia,
        String distrito
) {}
