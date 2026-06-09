package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_ticket_historial")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistorialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket", nullable = false)
    private TicketEntity ticket;

    @Column(name = "estado_anterior", length = 20)
    private String estadoAnterior;

    @Column(name = "estado_nuevo", nullable = false, length = 20)
    private String estadoNuevo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @CreationTimestamp
    @Column(name = "dt_cambio", nullable = false, updatable = false)
    private LocalDateTime dtCambio;
}
