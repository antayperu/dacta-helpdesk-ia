package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hds_ticket")
public class TicketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 500)
    private String asunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "canal_origen", nullable = false, length = 20)
    private String canalOrigen;

    @Column(nullable = false, length = 20)
    private String estado = "NUEVO";

    @Column(nullable = false, length = 10)
    private String urgencia;

    @Column(length = 5)
    private String tipo;

    @Column(length = 5)
    private String aplicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo")
    private ModuloEntity modulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_agente")
    private UsuarioEntity agente;

    @Column(name = "correo_cliente", nullable = false, length = 255)
    private String correoCliente;

    @Column(name = "nombre_cliente", length = 200)
    private String nombreCliente;

    @Column(name = "confianza_ia", precision = 5, scale = 2)
    private BigDecimal confianzaIa;

    @Column(name = "revisado_ia", nullable = false)
    private Boolean revisadoIa = false;

    @Column(nullable = false)
    private Boolean duplicado = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket_padre")
    private TicketEntity ticketPadre;

    @Column(name = "origen_sistema", length = 50)
    private String origenSistema;

    @Column(name = "modulo_erp", length = 20)
    private String moduloErp;

    @Column(name = "version_erp", length = 20)
    private String versionErp;

    @Column(name = "usuario_erp", length = 255)
    private String usuarioErp;

    @Column(name = "empresa_cliente", length = 200)
    private String empresaCliente;

    @Column(name = "accion_realizada", length = 500)
    private String accionRealizada;

    @Column(name = "url_pantalla", length = 500)
    private String urlPantalla;

    @Column(name = "screenshot_base64", columnDefinition = "TEXT")
    private String screenshotBase64;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;

    @Column(name = "dt_asignado")
    private LocalDateTime dtAsignado;

    @Column(name = "dt_primer_respuesta")
    private LocalDateTime dtPrimerRespuesta;

    @Column(name = "dt_resuelto")
    private LocalDateTime dtResuelto;

    @Column(name = "dt_cerrado")
    private LocalDateTime dtCerrado;

    @Column(name = "minutos_pausado", nullable = false)
    private Integer minutosPausado = 0;

    @UpdateTimestamp
    @Column(name = "dt_actualizado", nullable = false)
    private LocalDateTime dtActualizado;

    public TicketEntity() {}

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getAsunto() { return asunto; }
    public String getDescripcion() { return descripcion; }
    public String getCanalOrigen() { return canalOrigen; }
    public String getEstado() { return estado; }
    public String getUrgencia() { return urgencia; }
    public String getTipo() { return tipo; }
    public String getAplicacion() { return aplicacion; }
    public ModuloEntity getModulo() { return modulo; }
    public UsuarioEntity getAgente() { return agente; }
    public String getCorreoCliente() { return correoCliente; }
    public String getNombreCliente() { return nombreCliente; }
    public BigDecimal getConfianzaIa() { return confianzaIa; }
    public Boolean getRevisadoIa() { return revisadoIa; }
    public Boolean getDuplicado() { return duplicado; }
    public TicketEntity getTicketPadre() { return ticketPadre; }
    public String getOrigenSistema() { return origenSistema; }
    public String getModuloErp() { return moduloErp; }
    public String getVersionErp() { return versionErp; }
    public String getUsuarioErp() { return usuarioErp; }
    public String getEmpresaCliente() { return empresaCliente; }
    public String getAccionRealizada() { return accionRealizada; }
    public String getUrlPantalla() { return urlPantalla; }
    public String getScreenshotBase64() { return screenshotBase64; }
    public LocalDateTime getDtCreado() { return dtCreado; }
    public LocalDateTime getDtAsignado() { return dtAsignado; }
    public LocalDateTime getDtPrimerRespuesta() { return dtPrimerRespuesta; }
    public LocalDateTime getDtResuelto() { return dtResuelto; }
    public LocalDateTime getDtCerrado() { return dtCerrado; }
    public Integer getMinutosPausado() { return minutosPausado; }
    public LocalDateTime getDtActualizado() { return dtActualizado; }

    public void setId(Long id) { this.id = id; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public void setAsunto(String asunto) { this.asunto = asunto; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setCanalOrigen(String canalOrigen) { this.canalOrigen = canalOrigen; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setUrgencia(String urgencia) { this.urgencia = urgencia; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setAplicacion(String aplicacion) { this.aplicacion = aplicacion; }
    public void setModulo(ModuloEntity modulo) { this.modulo = modulo; }
    public void setAgente(UsuarioEntity agente) { this.agente = agente; }
    public void setCorreoCliente(String correoCliente) { this.correoCliente = correoCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public void setConfianzaIa(BigDecimal confianzaIa) { this.confianzaIa = confianzaIa; }
    public void setRevisadoIa(Boolean revisadoIa) { this.revisadoIa = revisadoIa; }
    public void setDuplicado(Boolean duplicado) { this.duplicado = duplicado; }
    public void setTicketPadre(TicketEntity ticketPadre) { this.ticketPadre = ticketPadre; }
    public void setOrigenSistema(String origenSistema) { this.origenSistema = origenSistema; }
    public void setModuloErp(String moduloErp) { this.moduloErp = moduloErp; }
    public void setVersionErp(String versionErp) { this.versionErp = versionErp; }
    public void setUsuarioErp(String usuarioErp) { this.usuarioErp = usuarioErp; }
    public void setEmpresaCliente(String empresaCliente) { this.empresaCliente = empresaCliente; }
    public void setAccionRealizada(String accionRealizada) { this.accionRealizada = accionRealizada; }
    public void setUrlPantalla(String urlPantalla) { this.urlPantalla = urlPantalla; }
    public void setScreenshotBase64(String screenshotBase64) { this.screenshotBase64 = screenshotBase64; }
    public void setDtAsignado(LocalDateTime dtAsignado) { this.dtAsignado = dtAsignado; }
    public void setDtPrimerRespuesta(LocalDateTime dtPrimerRespuesta) { this.dtPrimerRespuesta = dtPrimerRespuesta; }
    public void setDtResuelto(LocalDateTime dtResuelto) { this.dtResuelto = dtResuelto; }
    public void setDtCerrado(LocalDateTime dtCerrado) { this.dtCerrado = dtCerrado; }
    public void setMinutosPausado(Integer minutosPausado) { this.minutosPausado = minutosPausado; }
}
