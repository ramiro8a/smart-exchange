package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.BancoResponse;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_bancos")
public class Bancos  extends BaseModel{
    private String nombre;
    private String logo;

    public static BancoResponse aResponse(Bancos banco){
        return new BancoResponse(
                banco.getId(),
                banco.getNombre(),
                banco.getLogo(),
                banco.getEstado()
        );
    }

}
