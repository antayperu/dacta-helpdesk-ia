package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.NotificacionEntity;
import com.dacta.helpdesk.model.entity.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<NotificacionEntity, Long> {

    List<NotificacionEntity> findByTicketAndEnviadoFalse(TicketEntity ticket);
}
