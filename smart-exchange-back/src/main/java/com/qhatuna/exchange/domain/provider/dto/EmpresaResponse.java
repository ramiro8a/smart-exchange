package com.qhatuna.exchange.domain.provider.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmpresaResponse(
        boolean success,
        @JsonProperty(value = "agente_retencion")
        String retencion,
        EmpresaDataResponse data
) {}
