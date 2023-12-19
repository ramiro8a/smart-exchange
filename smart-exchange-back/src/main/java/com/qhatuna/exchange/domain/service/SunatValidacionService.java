package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import org.springframework.stereotype.Service;

@Service
public class SunatValidacionService {

    public boolean datosValidos(ClienteRequest request){
        return false;
    }
}
