package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.ComprobanteResponse;
import com.qhatuna.exchange.app.rest.response.ComprobanteVentaResponse;
import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.model.ComprobanteVenta;
import com.qhatuna.exchange.domain.model.Operacion;
import com.qhatuna.exchange.domain.repository.ComprobanteVentaRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class ComprobanteVentaService {
    private final ComprobanteVentaRepository repository;
    private final OperacionService operacionService;

    public ComprobanteVentaService(
            ComprobanteVentaRepository repository,
            @Lazy OperacionService operacionService
    ){
        this.repository = repository;
        this.operacionService = operacionService;
    }

    public ComprobanteResponse recuperaArchivosSunat(Long id, Integer tipo){
     Operacion operacion = operacionService.recuperaOperacionPorComprovanteVentaId(id);
     ComprobanteVenta comprobanteVenta = operacion.getComprobanteVenta();
     if(tipo.equals(ConstValues.FACTURA_ZIP)){
         return Util.recuperaArchivoSunat(comprobanteVenta.getRutaFacturaZip(),"FACTURA", tipo);
     } else if (tipo.equals(ConstValues.CDR_XML)) {
         return Util.recuperaArchivoSunat(comprobanteVenta.getRutaFacturaCdr(),"CDR", tipo);
     } else if (tipo.equals(ConstValues.COMPROBANTE_PDF)) {
         return Util.recuperaArchivoSunat(comprobanteVenta.getRutaFacturaImpresa(),"PDF", tipo);
     }else {
         throw new ProviderException(ErrorMsj.OPCION_NO_EXISTE.getMsj(), ErrorMsj.OPCION_NO_EXISTE.getCod());
     }
    }

    public ComprobanteVentaResponse reEnviaFacturaSunat(Long id){
        Operacion operacion = operacionService.recuperaOperacionPorComprovanteVentaId(id);
        ComprobanteVenta comprobanteVenta = operacion.getComprobanteVenta();
        operacionService.enviarComprobanteVenta(operacion, comprobanteVenta);
        return ComprobanteVenta.aResponse(repository.save(comprobanteVenta));
    }

    public ComprobanteVentaResponse recuperaPorOperacionId(Long operacionId){
        Operacion operacion = operacionService.recuperaOperacionPorId(operacionId);
        return ComprobanteVenta.aResponse(operacion.getComprobanteVenta());
    }

    public ComprobanteVenta creaNuevaFactura(){
        Integer ultimoNroFactura = repository.findMaxNroFactura();
        return ComprobanteVenta.builder()
                .nroFactura(ultimoNroFactura==null?1:(ultimoNroFactura+1))
                .build();

    }
    public ComprobanteVenta creaNuevoComprobante(){
        Integer ultimoNroComprobante = repository.findMaxNroComprobante();
        return ComprobanteVenta.builder()
                .nroComprobante(ultimoNroComprobante==null?1:(ultimoNroComprobante+1))
                .build();

    }

    public ComprobanteVenta guarda(ComprobanteVenta comprobante){
        return repository.save(comprobante);
    }

}
