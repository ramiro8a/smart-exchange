package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
import com.qhatuna.exchange.commons.constant.ConstValues;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_cuenta_bancaria")
public class CuentaBancaria extends BaseModel{
    @Column(name = "tipo_cuenta")
    private Integer tipoCuenta;
    private Integer moneda;
    @ManyToOne
    @JoinColumn(name="banco_id",referencedColumnName="id")
    private Bancos banco;
    @Column(name = "nro_cuenta")
    private String nroCuenta;
    @Column(name = "usuario_id")
    private Long usuarioId;
    private String nombre;
    //private String ruc;

    public boolean esDolares(){
        return this.moneda.equals(ConstValues.USD_ISO);
    }
    public boolean esSoles(){
        return this.moneda.equals(ConstValues.SOLES_ISO);
    }

    public static CuentaBancariaResponse aResponse(CuentaBancaria cuenta){
        return new CuentaBancariaResponse(
                cuenta.getId(),
                cuenta.getTipoCuenta(),
                cuenta.getMoneda(),
                cuenta.getBanco().getId(),
                cuenta.getBanco().getNombre(),
                cuenta.getNroCuenta(),
                cuenta.getNombre(),
                cuenta.getEstado()
        );
    }
}
