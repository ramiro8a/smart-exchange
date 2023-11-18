package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.utils.Util;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class BaseModel {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    @Column(name = "usuario_creacion")
    private Long usuarioCreacion;
    @Column(name = "fecha_actualizacion")
    //@UpdateTimestamp
    private LocalDateTime fechaActualizacion;
    @Column(name = "usuario_actualizacion")
    private Long usuarioActualizacion;
    @Version
    private Integer version;
    @Column(name = "est_reg")
    private Integer estado;
    @PreUpdate
    public void preUpdate(){
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist(){
        if(this.estado==null)
            this.estado = Const.EstadoRegistro.ACTIVO;
    }

    public String getCreacion(){
        return concatenaUsuarioFecha(
                this.fechaCreacion,
                this.usuarioCreacion==null?"":this.usuarioCreacion.toString()
        );
    }
    public String getActualiacion(){
        return concatenaUsuarioFecha(
                this.fechaActualizacion,
                this.usuarioActualizacion==null?"":this.usuarioActualizacion.toString()
        );
    }

    private String concatenaUsuarioFecha(LocalDateTime fecha, String usuario){
        String fechaString = fecha!=null? Util.dateTimeToString(fecha):"";
        String usuarioString = usuario!=null? usuario:"";
        return (fechaString+usuarioString).trim();
    }

}
