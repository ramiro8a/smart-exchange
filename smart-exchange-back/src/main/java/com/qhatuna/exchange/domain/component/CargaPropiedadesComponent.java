package com.qhatuna.exchange.domain.component;

import com.qhatuna.exchange.domain.service.PropiedadesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CargaPropiedadesComponent implements CommandLineRunner {
    @Autowired
    PropiedadesService propiedadesService;


    @Override
    public void run(String... args) throws Exception {
        //propiedadesService.cargaPropiedades();
    }
}
