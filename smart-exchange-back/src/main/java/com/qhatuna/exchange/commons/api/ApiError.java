package com.qhatuna.exchange.commons.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class ApiError {
    String mensaje;
    String mensajeTec;
    String codigo;
    HttpStatus status;
}
