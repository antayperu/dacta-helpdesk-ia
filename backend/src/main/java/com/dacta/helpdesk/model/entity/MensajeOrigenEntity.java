package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_mensaje_origen")
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
    private Boolean procesado = false;

    @CreationTimestamp
    @Column(name = "dt_recibido", nullable = false, updatable = false)
    private LocalDateTime dtRecibido;

    @Column(name = "dt_procesado")
    private LocalDateTime dtProcesado;

    public MensajeOrigenEntity() {}

    public Long getId() { return id; }
    public TicketEntity getTicket() { return ticket; }
    public String getCanal() { return canal; }
    public String getRemitente() { return remitente; }
    public String getAsunto() { return asunto; }
    public String getCuerpo() { return cuerpo; }
    public String getMessageId() { return messageId; }
    public Boolean getProcesado() { return procesado; }
    public LocalDateTime getDtRecibido() { return dtRecibido; }
    public LocalDateTime getDtProcesado() { return dtProcesado; }

    public void setTicket(TicketEntity ticket) { this.ticket = ticket; }
    public void setCanal(String canal) { this.canal = canal; }
    public void setRemitente(String remitente) { this.remitente = remitente; }
    public void setAsunto(String asunto) { this.asunto = asunto; }
    public void setCuerpo(String cuerpo) { this.cuerpo = cuerpo; }
    public void setMessageId(String messageId) { this.messageId = messageId; }
    public void setProcesado(Boolean procesado) { this.procesado = procesado; }
    public void setDtProcesado(LocalDateTime dtProcesado) { this.dtProcesado = dtProcesado; }
}
