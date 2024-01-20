package com.qhatuna.exchange.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

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
    @JsonBackReference
    private Empresa empresa;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="horario_id",referencedColumnName="id")
    private Horario horario;
}
