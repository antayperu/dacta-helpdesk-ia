package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_ticket_historial")
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

    public TicketHistorialEntity() {}

    public Long getId() { return id; }
    public TicketEntity getTicket() { return ticket; }
    public String getEstadoAnterior() { return estadoAnterior; }
    public String getEstadoNuevo() { return estadoNuevo; }
    public UsuarioEntity getUsuario() { return usuario; }
    public String getComentario() { return comentario; }
    public LocalDateTime getDtCambio() { return dtCambio; }

    public void setTicket(TicketEntity ticket) { this.ticket = ticket; }
    public void setEstadoAnterior(String estadoAnterior) { this.estadoAnterior = estadoAnterior; }
    public void setEstadoNuevo(String estadoNuevo) { this.estadoNuevo = estadoNuevo; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}
