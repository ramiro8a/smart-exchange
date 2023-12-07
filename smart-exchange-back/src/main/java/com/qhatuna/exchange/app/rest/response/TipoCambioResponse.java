package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TipoCambioResponse(
        Long id,
        Integer estado,
        Integer moneda,
        BigDecimal compra,
        BigDecimal venta,
        LocalDate fecha
) {}
