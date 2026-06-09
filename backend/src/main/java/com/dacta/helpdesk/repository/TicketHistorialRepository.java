package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.TicketEntity;
import com.dacta.helpdesk.model.entity.TicketHistorialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistorialRepository extends JpaRepository<TicketHistorialEntity, Long> {

    List<TicketHistorialEntity> findByTicketOrderByDtCambioDesc(TicketEntity ticket);
}
