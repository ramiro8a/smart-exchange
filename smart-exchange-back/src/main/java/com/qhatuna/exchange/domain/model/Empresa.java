package com.qhatuna.exchange.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_empresa")
public class Empresa {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(name = "razon_social")
    private String razonSocial;
    private String ruc;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "empresa")
    private List<Dia> dias;
}
