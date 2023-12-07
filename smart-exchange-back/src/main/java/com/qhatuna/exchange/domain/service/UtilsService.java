package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class UtilsService {
    private final ClienteRepository clienteRepository;
    public List<NotificacionResponse> notificaciones(){
        List<NotificacionResponse> lista = new ArrayList<>();
        Cliente cliente = new Cliente();
        //if (cliente.getPNombre().isBlank())
            lista.add(new NotificacionResponse("Datos personales", "datosPersonales"));

        return lista;
    }
}
