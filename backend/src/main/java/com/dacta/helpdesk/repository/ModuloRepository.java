package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.ModuloEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<ModuloEntity, Long> {

    List<ModuloEntity> findByActivoTrue();

    Optional<ModuloEntity> findByCodigoAndActivoTrue(String codigo);
}
