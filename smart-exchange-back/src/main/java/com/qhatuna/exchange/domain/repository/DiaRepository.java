package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Dia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiaRepository extends JpaRepository<Dia, Long> {
}
