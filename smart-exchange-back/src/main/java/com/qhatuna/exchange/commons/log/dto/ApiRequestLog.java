package com.qhatuna.exchange.commons.log.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonPropertyOrder({"requestIdInternal","method", "path", "status", "inDate", "outDate", "user", "headers", "parameters", "queryParameters", "request", "response", "remoteAddress"})
public class ApiRequestLog {
    private static final String FILED_SEPARATOR = "\n";

    private LocalDateTime inDate;

    private LocalDateTime outDate;

    private String user;

    private String path;

    private String method;

    private String headers;

    private String parameters;

    private String queryParameters;

    private String query;

    private String procedure;

    private String dtoToMapper;

    private String request;

    private String response;

    private String remoteAddress;

    private Integer status;

    private String requestIdInternal;
    private String errorType;
    private String errorMessage;
    private String errorClass;
    private String line;
}
