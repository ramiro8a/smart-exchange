package com.qhatuna.exchange.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="t_propiedades")
public class Propiedades {
    @Id
    private Long id;
    private String propiedad;
    private String valor;
}
