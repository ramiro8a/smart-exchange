package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.TipoCambioRequest;
import com.qhatuna.exchange.app.rest.response.TipoCambioResponse;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.TipoCambio;
import com.qhatuna.exchange.domain.repository.TipoCambioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Service
public class TipoCambioService {
    private final TipoCambioRepository tipoCambioRepository;

    @Transactional
    public TipoCambioResponse crea(TipoCambioRequest request){
        if(request.porDefecto()){
            List<TipoCambio> ultimosTipoCambios;
            if(request.fecha().isAfter(LocalDate.now())){
                ultimosTipoCambios = tipoCambioRepository.buscaTipoDeCambioPorMonedaYFechaDespues(
                        request.moneda(),
                        request.tipo(),
                        request.fecha()
                );
            }else{
                ultimosTipoCambios = tipoCambioRepository.buscaTipoDeCambioPorMoneda(
                        request.moneda(),
                        request.tipo(),
                        LocalDate.now()
                );
            }
            ultimosTipoCambios.forEach(item-> item.setEstado(Const.EstadoRegistro.DESHABILITADO));
            tipoCambioRepository.saveAll(ultimosTipoCambios);
        }
        TipoCambio tipoCambio = TipoCambio.builder()
                .tipo(request.tipo())
                .venta(request.venta())
                .compra(request.compra())
                .fecha(request.fecha())
                .moneda(request.moneda())
                .estado(
                        request.porDefecto()? Const.EstadoRegistro.ACTIVO:Const.EstadoRegistro.DESHABILITADO
                )
                .build();
        tipoCambio = tipoCambioRepository.save(tipoCambio);
        return TipoCambio.aResponseList(tipoCambio);
    }

    public List<TipoCambioResponse> recuperaUltimoCincoDias(Integer moneda){
        LocalDateTime ahora = LocalDateTime.now();
        LocalDate hasta = ahora.toLocalDate().plusDays(5);
        LocalDate desde = hasta.minusDays(5);
        List<TipoCambio> tiposDeCambios = tipoCambioRepository.buscaTipoDeCambioPorMonedaYFechas(
                moneda,
                desde,
                hasta
        );
        return tiposDeCambios.stream()
                .map(TipoCambio::aResponseList)
                .toList();
    }

    public TipoCambioResponse recuperaTipoCambioUSD(Integer moneda){
        List<TipoCambio> oficial = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                moneda,
                ConstValues.TC_OFICIAL,
                LocalDate.now(),
                PageRequest.of(0, 1)
        );
        List<TipoCambio> empresa = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                moneda,
                ConstValues.TC_EMPRESA,
                LocalDate.now(),
                PageRequest.of(0, 1)
        );
        if(oficial.isEmpty() || empresa.isEmpty()){
            throw new ProviderException(ErrorMsj.TIPO_CAMBIO.getMsj(),ErrorMsj.TIPO_CAMBIO.getCod());
        }

        return TipoCambio.aResponse(empresa.get(0), oficial.get(0));
    }

    public TipoCambio recuperaTipoCambioPorId(Long id){
        return tipoCambioRepository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.TIPO_CAMBIO.getMsj(),
                        ErrorMsj.TIPO_CAMBIO.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }
}
