package com.qhatuna.exchange.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

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
    private BigDecimal monto;
    @Column(name = "monto_final")
    private BigDecimal montoFinal;
    @ManyToOne
    @JoinColumn(name="tipo_cambio_id",referencedColumnName="id")
    private TipoCambio tipoCambio;
    @Column(name = "codigo_transferencia")
    private String codigoTransferencia;
}
