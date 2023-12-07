package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import com.qhatuna.exchange.domain.service.UtilsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/utils")
@Tag(name = "Utilitarios", description = "Este controlador expone endpoints de utilidad general")
@Validated
public class UtilsController {
    @Autowired
    private UtilsService service;

    @GetMapping(path = "/notificaciones", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<NotificacionResponse>> recuperaTodo() {
        return new ResponseEntity<>(service.notificaciones(), HttpStatus.OK);
    }
}
