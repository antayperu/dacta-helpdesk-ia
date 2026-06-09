package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.TicketEntity;
import com.dacta.helpdesk.model.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<TicketEntity, Long> {

    Optional<TicketEntity> findByCodigo(String codigo);

    List<TicketEntity> findByEstado(String estado);

    List<TicketEntity> findByAgente(UsuarioEntity agente);

    List<TicketEntity> findByEstadoAndDtResueltoBefore(String estado, LocalDateTime fecha);
}
