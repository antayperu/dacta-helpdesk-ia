package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_notificacion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket")
    private TicketEntity ticket;

    @Column(nullable = false, length = 20)
    private String canal;

    @Column(nullable = false, length = 255)
    private String destinatario;

    @Column(length = 500)
    private String asunto;

    @Column(columnDefinition = "TEXT")
    private String cuerpo;

    @Column(name = "estado_ticket", length = 20)
    private String estadoTicket;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enviado = false;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;

    @Column(name = "dt_enviado")
    private LocalDateTime dtEnviado;
}
