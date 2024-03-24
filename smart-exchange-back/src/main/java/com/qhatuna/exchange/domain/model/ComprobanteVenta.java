package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.ComprobanteVentaResponse;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Entity
@Table(name="t_comprobante_venta")
@AllArgsConstructor
@NoArgsConstructor
public class ComprobanteVenta {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nro_factura")
    private Integer nroFactura;
    @Column(name = "ruta_factura_zip")
    private String rutaFacturaZip;
    @Column(name = "ruta_factura_impresa")
    private String rutaFacturaImpresa;
    @Column(name = "ruta_factura_cdr")
    private String rutaFacturaCdr;
    @Column(name = "factura_ticket_sunat")
    private String facturaTicketSunat;
    @Column(name = "factura_hash")
    private String facturaHash;
    @Column(name = "nro_comprobante")
    private Integer nroComprobante;
    @Column(name = "ruta_comprobante")
    private String rutaComprobante;
    @Column(name = "envio_sunat")
    private boolean envioSunat;
    private String estado;
    @Column(name = "codigo_respuesta")
    private Integer codigoRespuesta;
    private String descripcion;
    @Column(name = "nro_completo")
    private String nroCompleto;

    public static ComprobanteVentaResponse aResponse(ComprobanteVenta comprobante){
        return new ComprobanteVentaResponse(
                comprobante.getId(),
                comprobante.getNroFactura(),
                comprobante.getFacturaTicketSunat(),
                comprobante.getFacturaHash(),
                comprobante.getNroComprobante(),
                comprobante.getEstado(),
                comprobante.getCodigoRespuesta(),
                comprobante.getDescripcion(),
                comprobante.getNroCompleto(),
                comprobante.isEnvioSunat()
        );
    }
}
