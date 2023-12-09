package com.qhatuna.exchange.app.rest.response;

public record CuentaBancariaResponse(
        Long id,
        Integer tipoCuenta,
        Integer moneda,
        Long banco,
        String numeroCuenta,
        String nombre,
        Integer estado
) {
}
