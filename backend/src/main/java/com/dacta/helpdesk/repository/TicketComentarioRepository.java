package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.TicketComentarioEntity;
import com.dacta.helpdesk.model.entity.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketComentarioRepository extends JpaRepository<TicketComentarioEntity, Long> {

    List<TicketComentarioEntity> findByTicketOrderByDtCreado(TicketEntity ticket);
}
