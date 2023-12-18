package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.TipoCambioResponse;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name="t_tipo_cambio")
public class TipoCambio extends BaseModel{
    private Integer tipo;
    private Integer moneda;
    private BigDecimal compra;
    private BigDecimal venta;
    private LocalDate fecha;

    public static TipoCambioResponse aResponse(TipoCambio tipoCambio, TipoCambio tipoCambioOficial){
        return new TipoCambioResponse(
                tipoCambio.getTipo(),
                tipoCambio.getId(),
                tipoCambio.getEstado(),
                tipoCambio.getMoneda(),
                tipoCambio.getCompra(),
                tipoCambio.getVenta(),
                tipoCambio.getFecha(),
                tipoCambioOficial.getCompra(),
                tipoCambioOficial.getVenta()
        );
    }

    public static TipoCambioResponse aResponseList(TipoCambio tipoCambio){
        return new TipoCambioResponse(
                tipoCambio.getTipo(),
                tipoCambio.getId(),
                tipoCambio.getEstado(),
                tipoCambio.getMoneda(),
                tipoCambio.getCompra(),
                tipoCambio.getVenta(),
                tipoCambio.getFecha(),
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
    }
}
