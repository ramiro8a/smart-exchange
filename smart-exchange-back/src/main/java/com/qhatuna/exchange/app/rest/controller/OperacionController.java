package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.ComprobanteRequest;
import com.qhatuna.exchange.app.rest.request.OperacionCriteriaRequest;
import com.qhatuna.exchange.app.rest.request.OperacionRequest;
import com.qhatuna.exchange.app.rest.response.ComprobanteResponse;
import com.qhatuna.exchange.app.rest.response.OperacionResponse;
import com.qhatuna.exchange.domain.service.OperacionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/operacion")
@Tag(name = "Operaciones", description = "Este controlador expone los servicio de operaciones")
public class OperacionController {
    @Autowired
    private OperacionService service;

    @PostMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Long> creaOperaion(
            @Parameter(description = "Datos de cuenta bancaria a crear", required = true, content = @Content(schema = @Schema(implementation = OperacionRequest.class)))
            @Valid @NotNull @RequestBody OperacionRequest request
    ) {
        return new ResponseEntity<>(service.crea(request), HttpStatus.OK);
    }

    @PutMapping(path = "/{id}/{op}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> confirmaOperacion(
            @PathVariable Long id,
            @PathVariable Integer op,
            @Parameter(description = "Datos de cuenta bancaria a actualizar", required = true, content = @Content(schema = @Schema()))
            @RequestBody OperacionRequest request
    ) {
        service.actualiza(id, op, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> actualizaComprobante(
            @PathVariable Long id,
            @Parameter(description = "Comprobante en base64", required = true, content = @Content(schema = @Schema()))
            @RequestBody ComprobanteRequest request
    ) {
        service.actualizaComprobante(id, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/acciones/{id}/{estado}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> accionesOperador(
            @PathVariable Long id,
            @PathVariable Integer estado
    ) {
        service.accionesOperador(id, estado);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/finaliza/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> finaliza(
            @PathVariable @NotNull Long id,
            @Parameter(description = "Comprobante en base64", required = true, content = @Content(schema = @Schema()))
            @RequestBody ComprobanteRequest request
    ) {
        service.finaliza(id, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/reasigna/{id}/{operadorId}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> reasignar(
            @PathVariable @NotNull Long id,
            @PathVariable @NotNull Long operadorId
    ) {
        service.reasignar(id, operadorId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/{page}/{size}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Page<OperacionResponse>> operacionPaginado(
            @PathVariable final Integer page,
            @PathVariable final Integer size,
            @Valid @ParameterObject OperacionCriteriaRequest request
            ) {
        return new ResponseEntity<>(service.operacionPaginado(page, size,request),HttpStatus.OK);
    }

    @GetMapping(path = "/comprobante/{operacionId}/{tipo}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ComprobanteResponse> comprobantePorOperacionId(
            @PathVariable final Long operacionId,
            @PathVariable final Integer tipo
    ) {
        return new ResponseEntity<>(service.recuperaComprobante(operacionId, tipo),HttpStatus.OK);
    }
}
