package com.dacta.helpdesk.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hds_ticket")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
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
    @Builder.Default
    private Boolean revisadoIa = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean duplicado = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket_padre")
    private TicketEntity ticketPadre;

    // Campos ERP opcionales — integración futura Integrens (DEC-002)
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

    // Timestamps SLA
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
    @Builder.Default
    private Integer minutosPausado = 0;

    @UpdateTimestamp
    @Column(name = "dt_actualizado", nullable = false)
    private LocalDateTime dtActualizado;
}
