package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_usuario")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String correo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false, length = 20)
    private String rol;

    @Column(name = "intentos_fallidos", nullable = false)
    private Integer intentosFallidos = 0;

    @Column(nullable = false)
    private Boolean bloqueado = false;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;

    @UpdateTimestamp
    @Column(name = "dt_actualizado", nullable = false)
    private LocalDateTime dtActualizado;

    public UsuarioEntity() {}

    public UsuarioEntity(Long id, String correo, String nombre, String apellido,
                         String contrasena, String rol, Integer intentosFallidos,
                         Boolean bloqueado, Boolean activo,
                         LocalDateTime dtCreado, LocalDateTime dtActualizado) {
        this.id = id;
        this.correo = correo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.contrasena = contrasena;
        this.rol = rol;
        this.intentosFallidos = intentosFallidos;
        this.bloqueado = bloqueado;
        this.activo = activo;
        this.dtCreado = dtCreado;
        this.dtActualizado = dtActualizado;
    }

    public static UsuarioEntityBuilder builder() { return new UsuarioEntityBuilder(); }

    public Long getId() { return id; }
    public String getCorreo() { return correo; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getContrasena() { return contrasena; }
    public String getRol() { return rol; }
    public Integer getIntentosFallidos() { return intentosFallidos; }
    public Boolean getBloqueado() { return bloqueado; }
    public Boolean getActivo() { return activo; }
    public LocalDateTime getDtCreado() { return dtCreado; }
    public LocalDateTime getDtActualizado() { return dtActualizado; }

    public void setId(Long id) { this.id = id; }
    public void setCorreo(String correo) { this.correo = correo; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    public void setRol(String rol) { this.rol = rol; }
    public void setIntentosFallidos(Integer intentosFallidos) { this.intentosFallidos = intentosFallidos; }
    public void setBloqueado(Boolean bloqueado) { this.bloqueado = bloqueado; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public void setDtCreado(LocalDateTime dtCreado) { this.dtCreado = dtCreado; }
    public void setDtActualizado(LocalDateTime dtActualizado) { this.dtActualizado = dtActualizado; }

    public static class UsuarioEntityBuilder {
        private Long id;
        private String correo;
        private String nombre;
        private String apellido;
        private String contrasena;
        private String rol;
        private Integer intentosFallidos = 0;
        private Boolean bloqueado = false;
        private Boolean activo = true;
        private LocalDateTime dtCreado;
        private LocalDateTime dtActualizado;

        public UsuarioEntityBuilder id(Long id) { this.id = id; return this; }
        public UsuarioEntityBuilder correo(String correo) { this.correo = correo; return this; }
        public UsuarioEntityBuilder nombre(String nombre) { this.nombre = nombre; return this; }
        public UsuarioEntityBuilder apellido(String apellido) { this.apellido = apellido; return this; }
        public UsuarioEntityBuilder contrasena(String contrasena) { this.contrasena = contrasena; return this; }
        public UsuarioEntityBuilder rol(String rol) { this.rol = rol; return this; }
        public UsuarioEntityBuilder intentosFallidos(Integer intentosFallidos) { this.intentosFallidos = intentosFallidos; return this; }
        public UsuarioEntityBuilder bloqueado(Boolean bloqueado) { this.bloqueado = bloqueado; return this; }
        public UsuarioEntityBuilder activo(Boolean activo) { this.activo = activo; return this; }

        public UsuarioEntity build() {
            return new UsuarioEntity(id, correo, nombre, apellido, contrasena, rol,
                    intentosFallidos, bloqueado, activo, dtCreado, dtActualizado);
        }
    }
}
