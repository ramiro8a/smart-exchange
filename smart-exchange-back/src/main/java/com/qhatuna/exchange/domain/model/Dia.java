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
@Table(name="t_dias")
public class Dia {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private boolean laboral;
    @ManyToOne
    @JoinColumn(name="empresa_id",referencedColumnName="id")
    private Empresa empresa;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "dia")
    private List<Horario> horario;
}
