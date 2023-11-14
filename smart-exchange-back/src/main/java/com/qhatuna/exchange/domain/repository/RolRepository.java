package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Rol;
import com.qhatuna.exchange.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    @Query("select r from Rol r where r.estado not in (1)")
    List<Usuario> recuperaTodo();
    @Query("select case when count(r) > 0 then true else false end from Rol r where upper(r.nombre) = upper(?1) and r.estado != 1")
    boolean existePorUsuario(String usuario);

}
