package com.qhatuna.exchange.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@SuperBuilder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_usuario")
public class Usuario extends BaseModel{
    private String usuario;
    private String password;
    private String correo;
    @Column(name = "correo_validado")
    private boolean correoValidado;
    private String celular;
    private boolean bloqueado;
    private LocalDateTime inicio;
    private LocalDateTime fin;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "t_usuario_rol", joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Rol> roles= new HashSet<>();

    @PrePersist
    public void prePersistEntity(){
        if(this.inicio==null)
            this.fin = null;
    }
}
