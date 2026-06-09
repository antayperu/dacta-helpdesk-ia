package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.TicketEntity;
import com.dacta.helpdesk.model.entity.UsuarioEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<TicketEntity, Long> {

    Optional<TicketEntity> findByCodigo(String codigo);

    List<TicketEntity> findByEstado(String estado);

    Page<TicketEntity> findByEstado(String estado, Pageable pageable);

    List<TicketEntity> findByAgente(UsuarioEntity agente);

    Page<TicketEntity> findByAgenteAndEstado(UsuarioEntity agente, String estado, Pageable pageable);

    @Query("SELECT t FROM TicketEntity t WHERE t.agente = :agente OR t.agente IS NULL")
    Page<TicketEntity> findByAgenteOrAgenteIsNull(@Param("agente") UsuarioEntity agente, Pageable pageable);

    List<TicketEntity> findByEstadoAndDtResueltoBefore(String estado, LocalDateTime fecha);
}
