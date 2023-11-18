package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.RolResponse;
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
@Table(name="t_rol")
public class Rol extends BaseModel{
    private String nombre;
    private String descripcion;

    public static RolResponse aResponse(Rol rol){
        return new RolResponse(
                rol.getId(),
                rol.getNombre(),
                rol.getDescripcion()
        );
    }
}
