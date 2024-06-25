package com.qhatuna.exchange.app.rest.response;

import java.math.BigDecimal;

public record ReporteOperacion(
        String ticket,
        String fechaCreacion,
        String fechaFinalizacion,
        String estado,
        BigDecimal montoOrigen,
        String monedaOrigen,
        BigDecimal montoDestino,
        String monedaDestino,
        BigDecimal tipoCambio,
        String codTransferenciaCliente,
        String codTransferenciaEmpresa,
        String cliente,
        String bancoOrigen,
        String bancoDestino,
        String bancoOrigenLcExchange,
        String operador
) {
}
