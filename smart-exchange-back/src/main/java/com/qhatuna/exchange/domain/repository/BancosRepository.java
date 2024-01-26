package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Bancos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BancosRepository extends JpaRepository<Bancos, Long> {
    @Query("select b from Bancos b where b.estado = 0")
    List<Bancos> recuperaActivos();

    @Query("select b from Bancos b where b.estado in (0, 2) order by b.id desc")
    List<Bancos> recuperaTodos();
}
