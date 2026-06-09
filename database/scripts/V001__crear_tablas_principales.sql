-- V001__crear_tablas_principales.sql
-- DACTA Help Desk IA v1.0
-- Autor: Camilo Ortega FR
-- Fecha: 2026-06-08

-- ============================================================
-- 1. hds_usuario
-- ============================================================
CREATE TABLE hds_usuario (
    id                BIGSERIAL    PRIMARY KEY,
    correo            VARCHAR(255) NOT NULL UNIQUE,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    contrasena        VARCHAR(255) NOT NULL,
    rol               VARCHAR(20)  NOT NULL CHECK (rol IN ('AGENTE', 'SUPERVISOR', 'GERENCIA')),
    intentos_fallidos INTEGER      NOT NULL DEFAULT 0,
    bloqueado         BOOLEAN      NOT NULL DEFAULT FALSE,
    activo            BOOLEAN      NOT NULL DEFAULT TRUE,
    dt_creado         TIMESTAMP    NOT NULL DEFAULT NOW(),
    dt_actualizado    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. hds_modulo
-- ============================================================
CREATE TABLE hds_modulo (
    id          BIGSERIAL    PRIMARY KEY,
    codigo      VARCHAR(20)  NOT NULL UNIQUE,
    nombre      VARCHAR(100) NOT NULL,
    aplicacion  VARCHAR(10)  NOT NULL CHECK (aplicacion IN ('ECS', 'EWB', 'MOV', 'IFC', 'OTR')),
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    dt_creado   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. hds_ticket
-- ============================================================
CREATE TABLE hds_ticket (
    id                  BIGSERIAL    PRIMARY KEY,
    codigo              VARCHAR(20)  NOT NULL UNIQUE,
    asunto              VARCHAR(500) NOT NULL,
    descripcion         TEXT         NOT NULL,
    canal_origen        VARCHAR(20)  NOT NULL CHECK (canal_origen IN ('EMAIL', 'WHATSAPP', 'MANUAL')),
    estado              VARCHAR(20)  NOT NULL DEFAULT 'NUEVO' CHECK (estado IN ('NUEVO', 'ASIGNADO', 'EN_PROGRESO', 'EN_ESPERA', 'RESUELTO', 'CERRADO')),
    urgencia            VARCHAR(10)  NOT NULL CHECK (urgencia IN ('CRITICA', 'ALTA', 'MEDIA', 'BAJA')),
    tipo                VARCHAR(5)   CHECK (tipo IN ('BUG', 'DAT', 'USR', 'CON', 'CAP', 'PER', 'INT', 'INF')),
    aplicacion          VARCHAR(5)   CHECK (aplicacion IN ('ECS', 'EWB', 'MOV', 'IFC', 'OTR')),
    id_modulo           BIGINT       REFERENCES hds_modulo(id),
    id_agente           BIGINT       REFERENCES hds_usuario(id),
    correo_cliente      VARCHAR(255) NOT NULL,
    nombre_cliente      VARCHAR(200),
    confianza_ia        DECIMAL(5,2),
    revisado_ia         BOOLEAN      NOT NULL DEFAULT FALSE,
    duplicado           BOOLEAN      NOT NULL DEFAULT FALSE,
    id_ticket_padre     BIGINT       REFERENCES hds_ticket(id),
    -- Campos ERP opcionales — integración futura Integrens (DEC-002)
    origen_sistema      VARCHAR(50),
    modulo_erp          VARCHAR(20),
    version_erp         VARCHAR(20),
    usuario_erp         VARCHAR(255),
    empresa_cliente     VARCHAR(200),
    accion_realizada    VARCHAR(500),
    url_pantalla        VARCHAR(500),
    screenshot_base64   TEXT,
    -- Timestamps SLA
    dt_creado           TIMESTAMP    NOT NULL DEFAULT NOW(),
    dt_asignado         TIMESTAMP,
    dt_primer_respuesta TIMESTAMP,
    dt_resuelto         TIMESTAMP,
    dt_cerrado          TIMESTAMP,
    minutos_pausado     INTEGER      NOT NULL DEFAULT 0,
    dt_actualizado      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_estado    ON hds_ticket(estado);
CREATE INDEX idx_ticket_id_agente ON hds_ticket(id_agente);
CREATE INDEX idx_ticket_dt_creado ON hds_ticket(dt_creado);

-- ============================================================
-- 4. hds_ticket_historial
-- ============================================================
CREATE TABLE hds_ticket_historial (
    id              BIGSERIAL   PRIMARY KEY,
    id_ticket       BIGINT      NOT NULL REFERENCES hds_ticket(id),
    estado_anterior VARCHAR(20),
    estado_nuevo    VARCHAR(20) NOT NULL,
    id_usuario      BIGINT      REFERENCES hds_usuario(id),
    comentario      TEXT,
    dt_cambio       TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historial_id_ticket ON hds_ticket_historial(id_ticket);

-- ============================================================
-- 5. hds_ticket_comentario
-- ============================================================
CREATE TABLE hds_ticket_comentario (
    id          BIGSERIAL   PRIMARY KEY,
    id_ticket   BIGINT      NOT NULL REFERENCES hds_ticket(id),
    id_usuario  BIGINT      REFERENCES hds_usuario(id),
    contenido   TEXT        NOT NULL,
    interno     BOOLEAN     NOT NULL DEFAULT FALSE,
    dt_creado   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comentario_id_ticket ON hds_ticket_comentario(id_ticket);

-- ============================================================
-- 6. hds_mensaje_origen
-- ============================================================
CREATE TABLE hds_mensaje_origen (
    id           BIGSERIAL    PRIMARY KEY,
    id_ticket    BIGINT       REFERENCES hds_ticket(id),
    canal        VARCHAR(20)  NOT NULL CHECK (canal IN ('EMAIL', 'WHATSAPP')),
    remitente    VARCHAR(255) NOT NULL,
    asunto       VARCHAR(500),
    cuerpo       TEXT,
    message_id   VARCHAR(500) UNIQUE,
    procesado    BOOLEAN      NOT NULL DEFAULT FALSE,
    dt_recibido  TIMESTAMP    NOT NULL DEFAULT NOW(),
    dt_procesado TIMESTAMP
);

-- ============================================================
-- 7. hds_notificacion
-- ============================================================
CREATE TABLE hds_notificacion (
    id            BIGSERIAL    PRIMARY KEY,
    id_ticket     BIGINT       REFERENCES hds_ticket(id),
    canal         VARCHAR(20)  NOT NULL CHECK (canal IN ('EMAIL', 'WHATSAPP')),
    destinatario  VARCHAR(255) NOT NULL,
    asunto        VARCHAR(500),
    cuerpo        TEXT,
    estado_ticket VARCHAR(20),
    enviado       BOOLEAN      NOT NULL DEFAULT FALSE,
    dt_creado     TIMESTAMP    NOT NULL DEFAULT NOW(),
    dt_enviado    TIMESTAMP
);
