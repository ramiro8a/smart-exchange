package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.domain.model.Dia;
import com.qhatuna.exchange.domain.model.Empresa;
import com.qhatuna.exchange.domain.service.EmpresaService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/empresa")
@Tag(name = "Empresa", description = "Este controlador expone los servicio de la empresa")
public class EmpresaController {
    @Autowired
    private EmpresaService service;

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Empresa> recuperaEmpresa() {
        return new ResponseEntity<>(service.recuperaEmpresa(), HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}", produces = {
            MediaType.APPLICATION_JSON_VALUE }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Empresa> actualizaEmpresa(
            @Parameter(description = "Id de la empresa a actualizar", required = true) @NotNull @PathVariable final Long id,
            @Parameter(description = "Datos de la empresa", required = true, content = @Content(schema = @Schema(implementation = Empresa.class)))
            @Valid @RequestBody Empresa request) {
        return new ResponseEntity<>(service.actualizaEmpresa(id, request),HttpStatus.OK);
    }

    @PatchMapping(path = "/dia/{id}", produces = {
            MediaType.APPLICATION_JSON_VALUE }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Empresa> actualizaDia(
            @Parameter(description = "Id del dia a actualizar", required = true) @NotNull @PathVariable final Long id,
            @Parameter(description = "Datos del dia", required = true, content = @Content(schema = @Schema(implementation = Dia.class)))
            @Valid @RequestBody Dia request) {
        return new ResponseEntity<>(service.actualizaHorario(id, request),HttpStatus.OK);
    }

}
