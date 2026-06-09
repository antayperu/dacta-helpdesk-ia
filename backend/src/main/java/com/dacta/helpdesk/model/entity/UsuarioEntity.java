package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_usuario")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
    private Integer intentosFallidos = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean bloqueado = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;

    @UpdateTimestamp
    @Column(name = "dt_actualizado", nullable = false)
    private LocalDateTime dtActualizado;
}
