package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_ticket_comentario")
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
    private Boolean interno = false;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;

    public TicketComentarioEntity() {}

    public Long getId() { return id; }
    public TicketEntity getTicket() { return ticket; }
    public UsuarioEntity getUsuario() { return usuario; }
    public String getContenido() { return contenido; }
    public Boolean getInterno() { return interno; }
    public LocalDateTime getDtCreado() { return dtCreado; }

    public void setTicket(TicketEntity ticket) { this.ticket = ticket; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public void setInterno(Boolean interno) { this.interno = interno; }
}
