package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
import com.qhatuna.exchange.app.rest.response.OperacionResponse;
import com.qhatuna.exchange.app.rest.response.ReporteOperacion;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.utils.Util;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_operacion")
public class Operacion extends BaseModel{
    @Column(name = "tipo_transferencia")
    private Integer tipoTransferencia;
    @ManyToOne
    @JoinColumn(name="cuenta_origen_id",referencedColumnName="id")
    private CuentaBancaria cuentaOrigen;
    @ManyToOne
    @JoinColumn(name="cuenta_destino_id",referencedColumnName="id")
    private CuentaBancaria cuentaDestino;
    @ManyToOne
    @JoinColumn(name="cuenta_transferencia_id",referencedColumnName="id")
    private CuentaBancaria cuentaTransferencia;
    @ManyToOne
    @JoinColumn(name="salida_transferencia_id",referencedColumnName="id")
    private CuentaBancaria cuentaTransferenciaFinal;
    private BigDecimal monto;
    @Column(name = "monto_final")
    private BigDecimal montoFinal;
    @Column(name = "monto_bancos_aux")
    private BigDecimal montoBancosAux;
    @ManyToOne
    @JoinColumn(name="tipo_cambio_id",referencedColumnName="id")
    private TipoCambio tipoCambio;
    @Column(name = "codigo_transferencia")
    private String codigoTransferencia;
    @Column(name = "codigo_transferencia_empresa")
    private String codigoTransferenciaEmpresa;
    private String ticket;
    @ManyToOne
    @JoinColumn(name="operador_asignado_id",referencedColumnName="id")
    private Usuario operador;
    @ManyToOne
    @JoinColumn(name="cliente_id",referencedColumnName="id")
    private Cliente cliente;
    private String comprobante;
    @Column(name = "comprobante_empresa")
    private String comprobanteEmpresa;
    @Column(name = "fecha_finalizacion")
    private LocalDate fechaFinalizacion;
    @OneToOne
    @JoinColumn(name="comprobante_venta_id",referencedColumnName="id")
    private ComprobanteVenta comprobanteVenta;

/*    @PrePersist
    public void prePersistTicket(){
        if(this.ticket==null)
            this.ticket = Util.generadorTicket();
    }*/

    public String getEstadoDesc(){
        return switch (getEstado()){
            case 0 -> "ACTIVO";
            case 3-> "EN CURSO";
            case 5 -> "ANULADO";
            case 6 -> "PRELIMINAR";
            case 10 -> "FINALIZADO";
            default -> "DESCONOCIDO";
        };
    }

    public static OperacionResponse aResponse(Operacion operacion){
        boolean envioSunat = false;
        if(operacion.getComprobanteVenta()!=null){
            envioSunat = operacion.getComprobanteVenta().isEnvioSunat();
        }
        return new OperacionResponse(
                operacion.getId(),
                operacion.getFechaCreacion(),
                operacion.getVersion(),
                operacion.getEstado(),
                operacion.getTipoTransferencia(),
                CuentaBancaria.aResponse(operacion.getCuentaOrigen()),
                CuentaBancaria.aResponse(operacion.getCuentaDestino()),
                CuentaBancaria.aResponse(operacion.getCuentaTransferencia()),
                CuentaBancaria.aResponse(operacion.getCuentaTransferenciaFinal()),
                operacion.getMonto(),
                operacion.getMontoFinal(),
                TipoCambio.aResponseList(operacion.getTipoCambio()),
                operacion.getCodigoTransferencia(),
                operacion.getCodigoTransferenciaEmpresa(),
                Cliente.aResponse(operacion.getCliente()),
                Usuario.aResponse(operacion.getOperador()),
                operacion.getTicket(),
                operacion.getFechaFinalizacion(),
                envioSunat
        );
    }

    public static ReporteOperacion aReporteOperacion(Operacion operacion){
        return new ReporteOperacion(
                operacion.getTicket(),
                Util.aFormato(operacion.getFechaCreacion(), Util.FECHA_COMPLETO),
                operacion.getFechaFinalizacion()==null?"":operacion.getFechaFinalizacion().format(Util.FECHA_COMPLETO),
                operacion.getEstadoDesc(),
                operacion.getMonto(),
                operacion.getCuentaOrigen().getMomedaDesc(),
                operacion.getMontoFinal(),
                operacion.getCuentaDestino().getMomedaDesc(),
                operacion.getCambio(),
                operacion.getCodigoTransferencia(),
                operacion.getCodigoTransferenciaEmpresa(),
                operacion.getCliente().getNombreCompleto(),
                operacion.getCuentaOrigen().getBanco().getNombre(),
                operacion.getCuentaDestino().getBanco().getNombre(),
                operacion.getCuentaTransferencia().getBanco().getNombre(),
                operacion.getOperador().getUsuario()
        );
    }

    public BigDecimal getCambio(){
        if(cuentaOrigen.esDolares() && cuentaDestino.esSoles()) {
            return tipoCambio.getCompra();
        }else {
            return tipoCambio.getVenta();
        }
    }
}
