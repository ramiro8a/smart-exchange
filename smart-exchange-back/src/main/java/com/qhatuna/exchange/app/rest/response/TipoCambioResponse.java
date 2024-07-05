package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TipoCambioResponse(
        Integer tipo,
        Long id,
        Integer estado,
        Integer moneda,
        BigDecimal compra,
        BigDecimal venta,
        LocalDate fecha,
        LocalDateTime fechaRegistro,
        BigDecimal compraOficial,
        BigDecimal ventaOficial,
        String logo,
        String nombre
) {}
