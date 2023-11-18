package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    @Query("select r from Rol r where r.estado not in (1)")
    List<Rol> recuperaTodo();
    @Query("select case when count(r) > 0 then true else false end from Rol r where upper(r.nombre) = upper(?1) and r.estado != 1")
    boolean existePorUsuario(String usuario);
    @Query("select r from Rol r where upper(r.nombre) = upper('CLIENTE') and r.estado != 1")
    Optional<Rol> buscaRolCliente();

}
