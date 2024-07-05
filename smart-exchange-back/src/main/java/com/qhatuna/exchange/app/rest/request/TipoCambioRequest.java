package com.qhatuna.exchange.app.rest.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TipoCambioRequest (
        Integer tipo,
        boolean porDefecto,
        LocalDate fecha,
        Integer moneda,
        BigDecimal compra,
        BigDecimal venta,
        String logo,
        String nombre
){}
