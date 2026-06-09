package com.dacta.helpdesk.model.dto;

import java.time.LocalDateTime;

public class TicketResumenDto {

    private Long id;
    private String codigo;
    private String asunto;
    private String estado;
    private String urgencia;
    private String canalOrigen;
    private String correoCliente;
    private String nombreCliente;
    private String nombreAgente;
    private String nombreModulo;
    private LocalDateTime dtCreado;

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getAsunto() { return asunto; }
    public String getEstado() { return estado; }
    public String getUrgencia() { return urgencia; }
    public String getCanalOrigen() { return canalOrigen; }
    public String getCorreoCliente() { return correoCliente; }
    public String getNombreCliente() { return nombreCliente; }
    public String getNombreAgente() { return nombreAgente; }
    public String getNombreModulo() { return nombreModulo; }
    public LocalDateTime getDtCreado() { return dtCreado; }

    public void setId(Long id) { this.id = id; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public void setAsunto(String asunto) { this.asunto = asunto; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setUrgencia(String urgencia) { this.urgencia = urgencia; }
    public void setCanalOrigen(String canalOrigen) { this.canalOrigen = canalOrigen; }
    public void setCorreoCliente(String correoCliente) { this.correoCliente = correoCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public void setNombreAgente(String nombreAgente) { this.nombreAgente = nombreAgente; }
    public void setNombreModulo(String nombreModulo) { this.nombreModulo = nombreModulo; }
    public void setDtCreado(LocalDateTime dtCreado) { this.dtCreado = dtCreado; }
}
