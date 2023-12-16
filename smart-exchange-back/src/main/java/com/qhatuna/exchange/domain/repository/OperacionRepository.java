package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Operacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperacionRepository extends JpaRepository<Operacion, Long> {
}
