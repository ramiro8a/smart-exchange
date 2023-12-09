package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.BancoResponse;
import com.qhatuna.exchange.domain.model.Bancos;
import com.qhatuna.exchange.domain.repository.BancosRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class BancosService {
    private final BancosRepository bancosRepository;

    public List<BancoResponse> recuperaActivos(){
        List<Bancos> bancos = bancosRepository.recuperaActivos();
        return bancos.stream().map(Bancos::aResponse).toList();
    }
}
