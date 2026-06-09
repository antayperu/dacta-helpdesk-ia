package com.dacta.helpdesk.repository;

import com.dacta.helpdesk.model.entity.MensajeOrigenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MensajeOrigenRepository extends JpaRepository<MensajeOrigenEntity, Long> {

    Optional<MensajeOrigenEntity> findByMessageIdAndProcesadoFalse(String messageId);

    boolean existsByMessageId(String messageId);
}
