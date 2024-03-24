package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.TipoCambioRequest;
import com.qhatuna.exchange.app.rest.response.TCPublicoResponse;
import com.qhatuna.exchange.app.rest.response.TipoCambioResponse;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.TipoCambio;
import com.qhatuna.exchange.domain.provider.apiperu.ApiPeruProvider;
import com.qhatuna.exchange.domain.provider.apiperu.dto.TipoCambioResponseDTO;
import com.qhatuna.exchange.domain.repository.TipoCambioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class TipoCambioService {
    private final TipoCambioRepository tipoCambioRepository;
    private final ApiPeruProvider apiPeruProvider;

    public TipoCambio recuperaTCBancos(){
        List<TipoCambio> bancos = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                ConstValues.USD_ISO,
                ConstValues.TC_BANCOS,
                PageRequest.of(0, 1)
        );
        if (bancos.isEmpty()){
            throw new ProviderException(ErrorMsj.TIPO_CAMBIO.getMsj(),ErrorMsj.TIPO_CAMBIO.getCod());
        }
        return bancos.get(0);
    }

    public List<TCPublicoResponse> recuperaTCPulico(){
        Integer moneda = ConstValues.USD_ISO;
        List<TipoCambio> lcExchange = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                moneda,
                ConstValues.TC_LC_EXCHANGE,
                PageRequest.of(0, 1)
        );
        List<TipoCambio> sunat = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                moneda,
                ConstValues.TC_SUNAT,
                PageRequest.of(0, 1)
        );
        List<TipoCambio> bancos = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                moneda,
                ConstValues.TC_BANCOS,
                PageRequest.of(0, 1)
        );
        if(lcExchange.isEmpty() || bancos.isEmpty()){
            throw new ProviderException(ErrorMsj.TIPO_CAMBIO.getMsj(),ErrorMsj.TIPO_CAMBIO.getCod());
        }
        List<TCPublicoResponse> lista = new ArrayList<>();
        lista.add(new TCPublicoResponse(
                lcExchange.get(0).getTipo(),
                "Lc Exchange",
                lcExchange.get(0).getCompra(),
                lcExchange.get(0).getVenta()
                ));
        if(!sunat.isEmpty()){
            lista.add(new TCPublicoResponse(
                    sunat.get(0).getTipo(),
                    "Sunat",
                    sunat.get(0).getCompra(),
                    sunat.get(0).getVenta()
            ));
        }
        lista.add(new TCPublicoResponse(
                bancos.get(0).getTipo(),
                "Bancos",
                bancos.get(0).getCompra(),
                bancos.get(0).getVenta()
        ));
        return lista;
    }


    public void sincroniza(){
        try {
            TipoCambioResponseDTO tc = apiPeruProvider.recuperaTipoCambio();
            if(tc.data()!=null){
                TipoCambioRequest tcr= new TipoCambioRequest(
                        ConstValues.TC_SUNAT,
                        true,
                        LocalDate.now(),
                        ConstValues.USD_ISO,
                        tc.data().compra(),
                        tc.data().venta()
                        );
                List<TipoCambio> sunats = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                        ConstValues.USD_ISO,
                        ConstValues.TC_SUNAT,
                        LocalDate.now(),
                        PageRequest.of(0, 1)
                );
                if(sunats.isEmpty()){
                    crea(tcr);
                }else {
                    TipoCambio sunatLocal = sunats.get(0);
                    if(!(tcr.compra().compareTo(sunatLocal.getCompra())==0 &&
                            tcr.venta().compareTo(sunatLocal.getVenta())==0)
                    ){
                        crea(tcr);
                    }
                }
            }
        }catch (Exception ex){
            log.error("Error al sincronizar tipo de cambio: {}", ex.getMessage());
        }
    }

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
                ConstValues.TC_BANCOS,
                PageRequest.of(0, 1)
        );
        List<TipoCambio> empresa = tipoCambioRepository.buscaTipoDeCambioRecientePorMonedaYTipo(
                moneda,
                ConstValues.TC_LC_EXCHANGE,
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
