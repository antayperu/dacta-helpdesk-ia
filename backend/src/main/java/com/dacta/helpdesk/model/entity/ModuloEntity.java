package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hds_modulo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuloEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 10)
    private String aplicacion;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "dt_creado", nullable = false, updatable = false)
    private LocalDateTime dtCreado;
}
