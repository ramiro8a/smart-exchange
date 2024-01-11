package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    @Query("select u from Usuario u where u.estado not in (1)")
    List<Usuario> recuperaTodo();

    @Query("select case when count(u) > 0 then true else false end from Usuario u where upper(u.usuario) = upper(?1) and u.estado != 1")
    boolean existePorUsuario(String usuario);

    @Query("select case when count(u) > 0 then true else false end from Usuario u where upper(u.correo) = upper(?1) and u.estado != 1")
    boolean existePorCorreo(String correo);

    @Query("select u from Usuario u where upper(u.usuario) = upper(?1) and u.estado != 1")
    Optional<Usuario> buscaPorUsuario(String usuario);

    Optional<Usuario> findByCorreo(String correo);
    List<Usuario> findByRolesNombre(String nombreRol);
    @Query("select u from Usuario u join u.roles r where r.nombre =?1 and u.estado = 0")
    List<Usuario> buscaUsuarioPorNombreDeRol(String rol);
}
