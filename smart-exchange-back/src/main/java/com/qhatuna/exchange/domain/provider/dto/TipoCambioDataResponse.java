package com.qhatuna.exchange.domain.provider.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record TipoCambioDataResponse(
        @JsonProperty(value = "purchase")
        BigDecimal compra,
        @JsonProperty(value = "sale")
        BigDecimal venta
) {}
