package com.qhatuna.exchange.app.rest.response;

import java.util.List;
import java.util.Set;

public record CuentasRegistradasResponse(
        Set<BancoResponse> bancosOrigen,
        Set<BancoResponse> bancosDestino,
        List<CuentaBancariaResponse> cuentasOrigen,
        List<CuentaBancariaResponse> cuentasDestino

) {}
