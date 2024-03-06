package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;

public record AhorroResponse(
        String tipo,
        String descripcion,
        BigDecimal cantidad
) {}
