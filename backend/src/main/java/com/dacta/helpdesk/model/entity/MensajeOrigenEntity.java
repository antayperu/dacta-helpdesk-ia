package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_mensaje_origen")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MensajeOrigenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket")
    private TicketEntity ticket;

    @Column(nullable = false, length = 20)
    private String canal;

    @Column(nullable = false, length = 255)
    private String remitente;

    @Column(length = 500)
    private String asunto;

    @Column(columnDefinition = "TEXT")
    private String cuerpo;

    @Column(name = "message_id", unique = true, length = 500)
    private String messageId;

    @Column(nullable = false)
    @Builder.Default
    private Boolean procesado = false;

    @CreationTimestamp
    @Column(name = "dt_recibido", nullable = false, updatable = false)
    private LocalDateTime dtRecibido;

    @Column(name = "dt_procesado")
    private LocalDateTime dtProcesado;
}
