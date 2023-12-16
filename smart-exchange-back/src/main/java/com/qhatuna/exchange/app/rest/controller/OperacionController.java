package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.OperacionRequest;
import com.qhatuna.exchange.domain.service.OperacionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/operacion")
@Tag(name = "Operaciones", description = "Este controlador expone los servicio de operaciones")
public class OperacionController {
    @Autowired
    private OperacionService service;

    @PostMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Long> creaCuentaBancaria(
            @Parameter(description = "Datos de cuenta bancaria a crear", required = true, content = @Content(schema = @Schema(implementation = OperacionRequest.class)))
            @Valid @NotNull @RequestBody OperacionRequest request
    ) {
        return new ResponseEntity<>(service.crea(request), HttpStatus.OK);
    }
}
