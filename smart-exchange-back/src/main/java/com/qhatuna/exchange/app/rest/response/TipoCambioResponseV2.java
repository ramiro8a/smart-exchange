package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;

public record TipoCambioResponseV2(
        BigDecimal compraLcExchange,
        BigDecimal ventaLcExchange,
        BigDecimal compraOtro,
        BigDecimal ventaOtro
) {
}
