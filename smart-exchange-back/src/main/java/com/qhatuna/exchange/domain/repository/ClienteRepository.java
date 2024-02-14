package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Cliente;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByUsuarioId(Long id);
    @Query("select c from Cliente c where c.estado not in (1)")
    List<Cliente> recuperaTodo(Pageable pageable);
    @Query("select c from Cliente c where (LOWER(c.paterno) like LOWER(%?1%) or LOWER(c.materno) like LOWER(%?1%)) and c.estado not in (1)")
    List<Cliente> recuperaPorApellido(String apellido, Pageable pageable);

    @Query("select c from Cliente c where c.nroDocumento=?1 and c.estado not in (1)")
    List<Cliente> recuperaPorNroDocumento(String nroDocumento, Pageable pageable);
    @Query("select c from Cliente c where c.nroDocumento=?1 and c.estado not in (1)")
    List<Cliente> recuperaPorNroDocumento(String nroDocumento);
}
