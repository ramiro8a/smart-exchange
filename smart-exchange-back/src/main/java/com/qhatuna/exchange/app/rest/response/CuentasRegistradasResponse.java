package com.qhatuna.exchange.app.rest.response;

import java.util.List;
import java.util.Set;

public record CuentasRegistradasResponse(
        Set<BancoResponse> bancos,
        List<CuentaBancariaResponse> cuentas

) {}
