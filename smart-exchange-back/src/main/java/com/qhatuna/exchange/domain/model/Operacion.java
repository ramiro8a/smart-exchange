package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
import com.qhatuna.exchange.app.rest.response.OperacionResponse;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.utils.Util;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

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

/*    @PrePersist
    public void prePersistTicket(){
        if(this.ticket==null)
            this.ticket = Util.generadorTicket();
    }*/

    public static OperacionResponse aResponse(Operacion operacion){
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
                operacion.getFechaFinalizacion()
        );
    }
}
