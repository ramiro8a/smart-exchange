package com.qhatuna.exchange.commons.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class ApiError {
    String mensaje;
    @JsonIgnore
    String mensajeTec;
    String codigo;
    HttpStatus status;
}
