package com.qhatuna.exchange.domain.provider.sunat.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record ComprobanteDatos(
        String numero,
        String nombrearchivo,
        LocalDate fechaEmision,
        LocalTime horaEmision,
        String concepto
) {
}
