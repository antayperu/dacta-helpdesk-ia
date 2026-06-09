package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_notificacion")
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
    private Boolean enviado = false;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;

    @Column(name = "dt_enviado")
    private LocalDateTime dtEnviado;

    public NotificacionEntity() {}

    public Long getId() { return id; }
    public TicketEntity getTicket() { return ticket; }
    public String getCanal() { return canal; }
    public String getDestinatario() { return destinatario; }
    public String getAsunto() { return asunto; }
    public String getCuerpo() { return cuerpo; }
    public String getEstadoTicket() { return estadoTicket; }
    public Boolean getEnviado() { return enviado; }
    public LocalDateTime getDtCreado() { return dtCreado; }
    public LocalDateTime getDtEnviado() { return dtEnviado; }

    public void setTicket(TicketEntity ticket) { this.ticket = ticket; }
    public void setCanal(String canal) { this.canal = canal; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }
    public void setAsunto(String asunto) { this.asunto = asunto; }
    public void setCuerpo(String cuerpo) { this.cuerpo = cuerpo; }
    public void setEstadoTicket(String estadoTicket) { this.estadoTicket = estadoTicket; }
    public void setEnviado(Boolean enviado) { this.enviado = enviado; }
    public void setDtEnviado(LocalDateTime dtEnviado) { this.dtEnviado = dtEnviado; }
}
