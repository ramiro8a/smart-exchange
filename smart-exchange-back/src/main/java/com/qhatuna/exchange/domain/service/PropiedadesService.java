package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.domain.model.Propiedades;
import com.qhatuna.exchange.domain.repository.PropiedadesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PropiedadesService implements ApplicationListener<ApplicationReadyEvent> {
    @Autowired
    private ConfigurableApplicationContext applicationContext;
    @Autowired
    private PropiedadesRepository repository;

    public void cargaPropiedades(){
        List<Propiedades> propiedades = repository.findAll();

        ConfigurableEnvironment configurableEnvironment = applicationContext.getEnvironment();
        MutablePropertySources propertySources = configurableEnvironment.getPropertySources();

        Map<String, Object> map = new HashMap<>();
        propiedades.forEach(item->{
            map.put(item.getPropiedad(), item.getValor());
        });
        propertySources.addFirst(new MapPropertySource("exchange", map));
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        cargaPropiedades();
    }
}
