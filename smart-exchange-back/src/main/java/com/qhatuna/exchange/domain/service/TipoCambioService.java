package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.TipoCambioRequest;
import com.qhatuna.exchange.app.rest.response.TipoCambioResponse;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.TipoCambio;
import com.qhatuna.exchange.domain.repository.TipoCambioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
                        request.fecha()
                );
            }else{
                ultimosTipoCambios = tipoCambioRepository.buscaTipoDeCambioPorMoneda(
                        request.moneda(),
                        LocalDate.now()
                );
            }
            ultimosTipoCambios.forEach(item->{
                item.setEstado(Const.EstadoRegistro.DESHABILITADO);
            });
            tipoCambioRepository.saveAll(ultimosTipoCambios);
        }
        TipoCambio tipoCambio = TipoCambio.builder()
                .venta(request.venta())
                .compra(request.compra())
                .fecha(request.fecha())
                .moneda(request.moneda())
                .estado(
                        request.porDefecto()? Const.EstadoRegistro.ACTIVO:Const.EstadoRegistro.DESHABILITADO
                )
                .build();
        tipoCambio = tipoCambioRepository.save(tipoCambio);
        return TipoCambio.aResponse(tipoCambio);
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
                .map(TipoCambio::aResponse)
                .toList();
    }

    public TipoCambioResponse recuperaTipoCambioUSD(Integer moneda){
        TipoCambio tipoCambio=null;
        Optional<TipoCambio> tipoCambioActual = tipoCambioRepository.buscaTipoDeCambioPorMonedaYFecha(
                moneda,
                LocalDate.now()
        );
        if (tipoCambioActual.isPresent()){
            tipoCambio = tipoCambioActual.get();
        }else{
            Optional<TipoCambio> ultimoTipoCambio = tipoCambioRepository.buscaTipoDeCambioPorMoneda(
                    moneda
            );
            if (ultimoTipoCambio.isPresent()){
                tipoCambio = ultimoTipoCambio.get();
            }else{
                throw new ProviderException(ErrorMsj.TIPO_CAMBIO.getMsj(),ErrorMsj.TIPO_CAMBIO.getCod());
            }
        }
        return TipoCambio.aResponse(tipoCambio);
    }
}
