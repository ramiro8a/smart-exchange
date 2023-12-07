package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_cliente")
public class Cliente  extends BaseModel{
    private String nombres;
    @Column(name = "ap_paterno")
    private String paterno;
    @Column(name = "ap_materno")
    private String materno;
    @Column(name = "tipo_doc")
    private String tipoDocumento;
    @Column(name = "nro_doc")
    private String nroDocumento;
    private String telefono;
    private String celular;
    @Column(name = "dni_anverso")
    private String dniAnverso;
    @Column(name = "dni_reverso")
    private String dniReverso;
    @Column(name = "usuario_id")
    private Long usuarioId;
/*    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;*/

    public static ClienteResponse aResponse(Cliente cliente){
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNombres(),
                cliente.getPaterno(),
                cliente.getMaterno(),
                cliente.getTipoDocumento(),
                cliente.getNroDocumento(),
                cliente.getTelefono(),
                cliente.getCelular()
        );
    }
}
