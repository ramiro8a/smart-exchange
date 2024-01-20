package com.qhatuna.exchange.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_horarios")
public class Horario {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private LocalTime desde;
    private LocalTime hasta;
}
