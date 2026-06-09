package com.dacta.helpdesk.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CrearTicketManualDto {

    @NotBlank @Email
    private String correoCliente;

    private String nombreCliente;

    @NotBlank
    private String asunto;

    @NotBlank
    private String descripcion;

    @NotNull
    private String urgencia;

    @NotNull
    private Long idModulo;

    // Campos opcionales DEC-002
    private String origenSistema;
    private String moduloErp;
    private String versionErp;
    private String usuarioErp;
    private String empresaCliente;
    private String accionRealizada;
    private String urlPantalla;
    private String screenshotBase64;

    public String getCorreoCliente() { return correoCliente; }
    public String getNombreCliente() { return nombreCliente; }
    public String getAsunto() { return asunto; }
    public String getDescripcion() { return descripcion; }
    public String getUrgencia() { return urgencia; }
    public Long getIdModulo() { return idModulo; }
    public String getOrigenSistema() { return origenSistema; }
    public String getModuloErp() { return moduloErp; }
    public String getVersionErp() { return versionErp; }
    public String getUsuarioErp() { return usuarioErp; }
    public String getEmpresaCliente() { return empresaCliente; }
    public String getAccionRealizada() { return accionRealizada; }
    public String getUrlPantalla() { return urlPantalla; }
    public String getScreenshotBase64() { return screenshotBase64; }

    public void setCorreoCliente(String v) { this.correoCliente = v; }
    public void setNombreCliente(String v) { this.nombreCliente = v; }
    public void setAsunto(String v) { this.asunto = v; }
    public void setDescripcion(String v) { this.descripcion = v; }
    public void setUrgencia(String v) { this.urgencia = v; }
    public void setIdModulo(Long v) { this.idModulo = v; }
    public void setOrigenSistema(String v) { this.origenSistema = v; }
    public void setModuloErp(String v) { this.moduloErp = v; }
    public void setVersionErp(String v) { this.versionErp = v; }
    public void setUsuarioErp(String v) { this.usuarioErp = v; }
    public void setEmpresaCliente(String v) { this.empresaCliente = v; }
    public void setAccionRealizada(String v) { this.accionRealizada = v; }
    public void setUrlPantalla(String v) { this.urlPantalla = v; }
    public void setScreenshotBase64(String v) { this.screenshotBase64 = v; }
}
