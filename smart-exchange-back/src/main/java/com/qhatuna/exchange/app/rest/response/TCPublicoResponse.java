package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;

public record TCPublicoResponse(
        Integer tipo,
        String tipoDesc,
        BigDecimal compra,
        BigDecimal venta
) {}
