package com.qhatuna.exchange.app.rest.request;

import java.time.LocalDate;

public record OperacionCriteriaRequest(
        LocalDate inicio,
        LocalDate fin,
        String nombres,
        String paterno,
        String nroDocumento,
        String ticket
) {}
