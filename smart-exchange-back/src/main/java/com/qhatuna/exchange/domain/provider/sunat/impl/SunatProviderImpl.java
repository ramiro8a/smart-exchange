package com.qhatuna.exchange.domain.provider.sunat.impl;

import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.log.LogPrinter;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.model.ComprobanteVenta;
import com.qhatuna.exchange.domain.model.Operacion;
import com.qhatuna.exchange.domain.provider.sunat.SunatProvider;
/*import io.github.carlosthe19916.webservices.managers.BillServiceManager;
import io.github.carlosthe19916.webservices.providers.BillServiceModel;
import io.github.carlosthe19916.webservices.wrappers.ServiceConfig;*/
import com.qhatuna.exchange.domain.provider.sunat.response.ComprobanteDatos;
/*import io.github.carlosthe19916.webservices.managers.BillServiceManager;
import io.github.carlosthe19916.webservices.providers.BillServiceModel;
import io.github.carlosthe19916.webservices.wrappers.ServiceConfig;*/
import io.github.project.openubl.xbuilder.content.catalogs.Catalog6;
import io.github.project.openubl.xbuilder.content.models.common.Cliente;
import io.github.project.openubl.xbuilder.content.models.common.Firmante;
import io.github.project.openubl.xbuilder.content.models.common.Proveedor;
import io.github.project.openubl.xbuilder.content.models.standard.general.DocumentoVentaDetalle;
import io.github.project.openubl.xbuilder.content.models.standard.general.FormaDePago;
import io.github.project.openubl.xbuilder.content.models.standard.general.Invoice;
import io.github.project.openubl.xbuilder.enricher.ContentEnricher;
import io.github.project.openubl.xbuilder.enricher.config.DateProvider;
import io.github.project.openubl.xbuilder.enricher.config.Defaults;
import io.github.project.openubl.xbuilder.enricher.kie.rules.enrich.header.invoice.FormaDePagoTipoRule;
import io.github.project.openubl.xbuilder.renderer.TemplateProducer;
import io.github.project.openubl.xbuilder.signature.XmlSignatureHelper;
import io.github.project.openubl.xsender.Constants;
import io.github.project.openubl.xsender.camel.StandaloneCamel;
import io.github.project.openubl.xsender.camel.utils.CamelData;
import io.github.project.openubl.xsender.camel.utils.CamelUtils;
import io.github.project.openubl.xsender.company.CompanyCredentials;
import io.github.project.openubl.xsender.company.CompanyURLs;
import io.github.project.openubl.xsender.files.BillServiceFileAnalyzer;
import io.github.project.openubl.xsender.files.BillServiceXMLFileAnalyzer;
import io.github.project.openubl.xsender.files.ZipFile;
import io.github.project.openubl.xsender.models.SunatResponse;
import io.github.project.openubl.xsender.sunat.BillServiceDestination;
import io.quarkus.qute.Template;
import lombok.extern.slf4j.Slf4j;
import org.apache.camel.CamelContext;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class SunatProviderImpl implements SunatProvider {
    private final Environment env;
    private final LogPrinter<?> logPrinter;
    public SunatProviderImpl(Environment env, LogPrinter<?> logPrinter) {
        this.env = env;
        this.logPrinter = logPrinter;
    }

    @Override
    public ComprobanteDatos enviaFactura(Cliente cliente, DocumentoVentaDetalle detalle, ComprobanteVenta comprobanteVenta, Operacion operacion) throws Exception {
        DateProvider dateProvider = LocalDate::now;
        Defaults icbIgv = cargaIcbIgvTasa();
        Integer nroSecuencialComprobante = Util.recuperaTipoComprobante(cliente.getTipoDocumentoIdentidad()).equals("01")?comprobanteVenta.getNroFactura(): comprobanteVenta.getNroComprobante();
        Invoice invoice = createInvoice(nroSecuencialComprobante, cliente, detalle, operacion);
        ContentEnricher enricher = new ContentEnricher(icbIgv, dateProvider);
        enricher.enrich(invoice);
        Template template = TemplateProducer.getInstance().getInvoice();
        String xml = template.data(invoice).render();
        Document xmlFirmado = Util.firmarXml(
                xml,
                env.getProperty("provider.sunat.certificado.path"),
                env.getProperty("provider.sunat.certificado.password"),
                env.getProperty("provider.sunat.firmador-id.value")
        );
        CompanyURLs companyURLs = CompanyURLs.builder()
                .invoice(env.getProperty("provider.sunat.factura-url"))
                .build();
        CompanyCredentials credentials = CompanyCredentials.builder()
                .username(env.getProperty("provider.sunat.username"))
                .password(env.getProperty("provider.sunat.password"))
                .build();
        BillServiceFileAnalyzer fileAnalyzer = new BillServiceXMLFileAnalyzer(
                XmlSignatureHelper.getBytesFromDocument(xmlFirmado),
                companyURLs
        );
        ZipFile zipFile = fileAnalyzer.getZipFile();
        log.warn("Nombre del archivo {}", zipFile.getFilename());
        comprobanteVenta.setRutaFacturaZip(Util.guardaArchivo(zipFile.getFile(),"facturasEnviadasASunat", zipFile.getFilename()));
        BillServiceDestination fileDestination = fileAnalyzer.getSendFileDestination();
        CamelContext camelContext = StandaloneCamel.getInstance()
                .getMainCamel()
                .getCamelContext();
        CamelData camelData = CamelUtils.getBillServiceCamelData(zipFile, fileDestination, credentials);
        SunatResponse sendFileSunatResponse = camelContext.createProducerTemplate()
                .requestBodyAndHeaders(
                        Constants.XSENDER_BILL_SERVICE_URI,
                        camelData.getBody(),
                        camelData.getHeaders(),
                        SunatResponse.class
                );
        comprobanteVenta.setEstado(sendFileSunatResponse.getStatus().toString());
        comprobanteVenta.setCodigoRespuesta(sendFileSunatResponse.getMetadata().getResponseCode());
        comprobanteVenta.setDescripcion(sendFileSunatResponse.getMetadata().getDescription());
        comprobanteVenta.setFacturaTicketSunat(sendFileSunatResponse.getSunat().getTicket());
        comprobanteVenta.setFacturaHash(String.valueOf(sendFileSunatResponse.getSunat().hashCode()));
        comprobanteVenta.setNroCompleto(
                String.valueOf(invoice.getSerie())
                        .concat(invoice.getTipoComprobante())
                        .concat("-".concat(String.valueOf(invoice.getNumero())))
        );
        logPrinter.write(Util.objectToString(sendFileSunatResponse.getStatus(),true));
        logPrinter.write(Util.objectToString(sendFileSunatResponse.getMetadata(),true));
        comprobanteVenta.setRutaFacturaCdr(Util.guardaArchivo(sendFileSunatResponse.getSunat().getCdr(),"cdrRecibidasDeSunat", zipFile.getFilename()));
        return new ComprobanteDatos(
                invoice.getSerie()+"-"+invoice.getNumero().toString(),
                zipFile.getFilename().replace(".zip",""),
                invoice.getFechaEmision(),
                invoice.getHoraEmision(),
                detalle.getDescripcion()
        );
    }

    private Invoice createInvoice(Integer numeroFact, Cliente cliente, DocumentoVentaDetalle detalle, Operacion operacion) {

        return Invoice.builder()
                .firmante(Firmante.builder()
                        .ruc(env.getProperty("lc-exchange.factura.ruc.value"))
                        .razonSocial(env.getProperty("lc-exchange.factura.razon-social.value"))
                        .build())
                .serie(Util.recuperaSerie(cliente.getTipoDocumentoIdentidad(), operacion.getTicket().substring(operacion.getTicket().length() - 3)))
                .tipoComprobante(Util.recuperaTipoComprobante(cliente.getTipoDocumentoIdentidad()))
                .numero(numeroFact)
                .proveedor(Proveedor.builder()
                        .ruc(env.getProperty("lc-exchange.factura.ruc.value"))
                        .razonSocial(env.getProperty("lc-exchange.factura.razon-social.value"))
                        .build()
                ).cliente(cliente)
                .detalle(detalle)
                .formaDePago(
                        FormaDePago.builder()
                                .tipo("CONTADO")
                                .total(operacion.getMonto())
                                .build()
                )
                .build();
    }

    private Defaults cargaIcbIgvTasa(){
        return Defaults.builder()
                .icbTasa(new BigDecimal(Objects.requireNonNull(env.getProperty("provider.sunat.icb-tasa"))))
                .igvTasa(new BigDecimal(Objects.requireNonNull(env.getProperty("provider.sunat.igv-tasa"))))
                .build();
    }

    @Override
    public ComprobanteDatos enviaFacturaTest() throws Exception {
        DateProvider dateProvider = LocalDate::now;
        Defaults defaults = Defaults.builder()
                .icbTasa(new BigDecimal("0.2"))
                .igvTasa(new BigDecimal("0.18"))
                .build();
        Invoice invoice = createInvoiceTest();
        ContentEnricher enricher = new ContentEnricher(defaults, dateProvider);
        enricher.enrich(invoice);
        Template template = TemplateProducer.getInstance().getInvoice();
        String xml = template.data(invoice).render();
        Document xmlFirmado = Util.firmarXml(
                xml,
                env.getProperty("provider.sunat.certificado.path"),
                env.getProperty("provider.sunat.certificado.password"),
                env.getProperty("provider.sunat.firmador-id.value")
        );
        CompanyURLs companyURLs = CompanyURLs.builder()
                .invoice(env.getProperty("provider.sunat.factura-url"))
                .build();
        CompanyCredentials credentials = CompanyCredentials.builder()
                .username(env.getProperty("provider.sunat.username"))
                .password(env.getProperty("provider.sunat.password"))
                .build();
        BillServiceFileAnalyzer fileAnalyzer = new BillServiceXMLFileAnalyzer(
                XmlSignatureHelper.getBytesFromDocument(xmlFirmado),
                companyURLs
        );
        ZipFile zipFile = fileAnalyzer.getZipFile();
        log.warn("Nombre del archivo {}", zipFile.getFilename());
        Util.guardaArchivo(zipFile.getFile(),"facturasEnviadasASunat", zipFile.getFilename());
        BillServiceDestination fileDestination = fileAnalyzer.getSendFileDestination();
        CamelContext camelContext = StandaloneCamel.getInstance()
                .getMainCamel()
                .getCamelContext();
        CamelData camelData = CamelUtils.getBillServiceCamelData(zipFile, fileDestination, credentials);
        SunatResponse sendFileSunatResponse = camelContext.createProducerTemplate()
                .requestBodyAndHeaders(
                        Constants.XSENDER_BILL_SERVICE_URI,
                        camelData.getBody(),
                        camelData.getHeaders(),
                        SunatResponse.class
                );
        log.info(Util.objectToString(sendFileSunatResponse.getStatus(),true));
        log.info(Util.objectToString(sendFileSunatResponse.getMetadata(),true));
        Util.guardaArchivo(sendFileSunatResponse.getSunat().getCdr(),"cdrRecibidasDeSunat", zipFile.getFilename());
        return new ComprobanteDatos(
                invoice.getSerie()+"-"+invoice.getNumero().toString(),
                zipFile.getFilename().replace(".zip",""),
                invoice.getFechaEmision(),
                invoice.getHoraEmision(),
                "detalle venta"
        );
    }

    private Invoice createInvoiceTest() {
        return Invoice.builder()
                .firmante(Firmante.builder()
                        .ruc("20000000001")
                        .razonSocial("Test operacion")
                        .build())
                .serie("F001")
                .tipoComprobante("01")
                .numero(1)
                .proveedor(Proveedor.builder()
                        .ruc("12345678912")
                        .razonSocial("Softgreen S.A.C.")
                        .build()
                )
                .cliente(Cliente.builder()
                        .nombre("Carlos Feria")
                        .numeroDocumentoIdentidad("12121212121")
                        .tipoDocumentoIdentidad(Catalog6.RUC.toString())
                        .build()
                )
                .detalle(DocumentoVentaDetalle.builder()
                        .descripcion("Item1")
                        .cantidad(new BigDecimal("10"))
                        .precio(new BigDecimal("100"))
                        .unidadMedida("KGM")
                        .build()
                )
                .detalle(DocumentoVentaDetalle.builder()
                        .descripcion("Item2")
                        .cantidad(new BigDecimal("10"))
                        .precio(new BigDecimal("100"))
                        .unidadMedida("KGM")
                        .build()
                )
                .build();
    }

}
