package com.qhatuna.exchange.domain.provider.sunat;

import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.ComprobanteVenta;
import com.qhatuna.exchange.domain.model.Operacion;
import com.qhatuna.exchange.domain.provider.sunat.response.ComprobanteDatos;
import io.github.project.openubl.xbuilder.content.models.common.Cliente;
import io.github.project.openubl.xbuilder.content.models.standard.general.DocumentoVentaDetalle;
import io.github.project.openubl.xsender.files.exceptions.UnsupportedXMLFileException;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;

public interface SunatProvider {
    ComprobanteDatos enviaFactura(Cliente cliente, DocumentoVentaDetalle detalle, ComprobanteVenta comprobanteVenta, Operacion operacion) throws Exception;
    ComprobanteDatos enviaFacturaTest() throws Exception;
}
