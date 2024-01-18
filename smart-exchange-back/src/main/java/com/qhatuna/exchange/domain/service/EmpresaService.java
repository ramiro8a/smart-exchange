package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.model.Dia;
import com.qhatuna.exchange.domain.model.Empresa;
import com.qhatuna.exchange.domain.repository.DiaRepository;
import com.qhatuna.exchange.domain.repository.EmpresaRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmpresaService {
    private final EmpresaRepository empresaRepository;
    private final DiaRepository diaRepository;

    public Empresa actualizaEmpresa(Long id, Empresa request){
        Empresa empresa = recuperaEmpresaPorId(id);
        empresa.setRuc(request.getRuc());
        empresa.setRazonSocial(request.getRazonSocial());
        return empresaRepository.save(empresa);
    }

    public Dia actualizaHorario(Long diaId, Dia request){
        Dia dia = recuperaDiaPorId(diaId);
        dia.getHorario()
    }

    public Empresa recuperaEmpresa(){
        return recuperaEmpresaPorId(1L);
    }

    public Empresa recuperaEmpresaPorId(Long id){
        return empresaRepository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.EMPRESA_NOEXISTE.getMsj(),
                        ErrorMsj.EMPRESA_NOEXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }

    public Dia recuperaDiaPorId(Long id){
        return diaRepository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.DIA_NOEXISTE.getMsj(),
                        ErrorMsj.DIA_NOEXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }
}
