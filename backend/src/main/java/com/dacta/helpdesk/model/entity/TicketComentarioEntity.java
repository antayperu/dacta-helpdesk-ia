package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_ticket_comentario")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketComentarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket", nullable = false)
    private TicketEntity ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    @Builder.Default
    private Boolean interno = false;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;
}
