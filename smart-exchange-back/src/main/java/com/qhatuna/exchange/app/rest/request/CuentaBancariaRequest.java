package com.qhatuna.exchange.app.rest.request;

public record CuentaBancariaRequest (
        Integer tipoCuenta,
        Integer moneda,
        Long banco,
        String numeroCuenta,
        String nombre
) {}
