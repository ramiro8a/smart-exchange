package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.TipoCambioRequest;
import com.qhatuna.exchange.app.rest.request.UsuarioRequest;
import com.qhatuna.exchange.app.rest.response.TipoCambioResponse;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.domain.service.TipoCambioService;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/tipo-cambio")
@Tag(name = "TipoCmabio", description = "Este controlador expone los servicio de tipos de cambios")
@Validated
public class TipoCambioController {
    @Autowired
    private TipoCambioService service;

    @PostMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<TipoCambioResponse> creaTipoCambio(
            @Parameter(description = "Datos de tipo cambio a crear", required = true, content = @Content(schema = @Schema(implementation = TipoCambioRequest.class)))
            @Valid @NotNull @RequestBody TipoCambioRequest request) {
        return new ResponseEntity<>(service.crea(request), HttpStatus.CREATED);
    }

    @GetMapping(path = "/{moneda}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<TipoCambioResponse>> recuperaTodo(
            @PathVariable Integer moneda
    ) {
        return new ResponseEntity<>(service.recuperaUltimoCincoDias(moneda), HttpStatus.OK);
    }

    @GetMapping(path = "/actual/{moneda}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<TipoCambioResponse> recuperaTipoCambioUSD(
            @PathVariable Integer moneda
    ) {
        return new ResponseEntity<>(service.recuperaTipoCambioUSD(moneda), HttpStatus.OK);
    }
}
