# TASK-LIST-001 — Lista de Tareas Atómicas
# DACTA Help Desk IA v1.0
# Versión: 1.1 — Agrega métricas de tiempo y preparación integración Integrens
# Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR — QE / SDD
# Referencia: SPEC-001 v1.1 + DEC-002

---

## INSTRUCCIONES PARA CLAUDE CODE

Eres el agente implementador del proyecto DACTA Help Desk IA.
Antes de ejecutar cualquier tarea debes:
1. Leer AGENTS.md — reglas del proyecto.
2. Leer CONVENTIONS.md — nomenclaturas y estándares.
3. Leer SPEC-001-historias-usuario.md — fuente de verdad funcional.
4. Leer DEC-002-integracion-integrens.md — decisión de arquitectura.
5. Ejecutar SOLO la tarea indicada — ni una línea más.
6. Ejecutar la verificación al final de cada tarea.
7. Reportar al Orquestador (Camilo Ortega FR) y esperar aprobación.

**NUNCA avanzar a la siguiente tarea sin aprobación explícita del Orquestador.**

---

## STACK TECNOLÓGICO

- Backend: Java 17 + Spring Boot 3.x
- Frontend: React 18 + Tailwind CSS
- Base de datos: PostgreSQL 15
- IA: Claude API — modelo claude-sonnet-4-20250514
- Correo: Gmail API v1
- Mensajería: WhatsApp Business Cloud API
- Autenticación: JWT (jjwt 0.11.5)
- Build: Maven
- Control de versiones: GitLab DACTA
- Editor: VS Code + Claude Code

## COLORES DACTA — OBLIGATORIOS EN TODO EL FRONTEND

- Azul principal: #2E4AF6 — botones y acciones principales
- Azul acero: #6FA3B2 — elementos secundarios e iconos
- Azul marino: #003366 — sidebar, cabeceras y menú

---

## RESUMEN DE TAREAS POR ÉPICA

| Épica | Tareas | HUs que cubre |
|---|---|---|
| ÉPICA 0 — Cimientos | TASK-001 a TASK-008 | HT-004, HT-005, HT-007 |
| ÉPICA 1 — Canales | TASK-009 a TASK-024 | HU-001 a HU-004, HU-018, HU-019 |
| ÉPICA 2 — Motor IA | TASK-025 a TASK-033 | HU-005 a HU-008, HT-003 |
| ÉPICA 3 — Gestión | TASK-034 a TASK-047 | HU-009 a HU-013 |
| ÉPICA 4 — Dashboard | TASK-048 a TASK-050 | HU-014, HU-015 + métricas tiempo |
| ÉPICA 5 — Seguridad | TASK-051 a TASK-056 | HU-016, HU-017 |
| CIERRE | TASK-057 a TASK-060 | HT-008, HT-009 |

---

## ═══════════════════════════════════════
## ÉPICA 0 — CIMIENTOS
## Base de datos + Spring Boot + Autenticación
## ═══════════════════════════════════════

### TASK-001 — Configurar proyecto Spring Boot base
**Archivo:** `backend/pom.xml`
**Acción:**
Crear el proyecto Spring Boot 3.x con dependencias en pom.xml:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-mail
- spring-boot-starter-webflux
- postgresql (driver)
- jjwt-api, jjwt-impl, jjwt-jackson (versión 0.11.5)
- lombok
- spring-boot-starter-validation
- spring-boot-starter-actuator

Configurar application.properties:
- server.port=8080
- spring.datasource.url=jdbc:postgresql://localhost:5432/dacta_helpdesk
- spring.datasource.username=dacta_user
- spring.datasource.password=dacta_pass
- spring.jpa.hibernate.ddl-auto=validate
- spring.jpa.show-sql=false

**Verificación:** `mvn clean compile` sin errores.

---

### TASK-002 — Crear estructura de paquetes Java
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/`
**Acción:**
Crear estructura de paquetes siguiendo M-O-DES-001:
```
com.dacta.helpdesk/
├── config/
├── controller/
├── service/
├── repository/
├── model/
│   ├── entity/
│   └── dto/
├── security/
├── exception/
└── util/
```
**Verificación:** Estructura creada. `mvn clean compile` sin errores.

---

### TASK-003 — Crear script de base de datos — tablas principales
**Archivo:** `database/scripts/V001__crear_tablas_principales.sql`
**Acción:**
Crear script SQL siguiendo M-O-DES-002:

```sql
CREATE TABLE hds_usuario (
    id_usuario      BIGSERIAL PRIMARY KEY,
    s_correo        VARCHAR(100) NOT NULL UNIQUE,
    s_nombre        VARCHAR(100) NOT NULL,
    s_apellido      VARCHAR(100) NOT NULL,
    s_contrasena    VARCHAR(255) NOT NULL,
    s_rol           VARCHAR(20) NOT NULL CHECK (s_rol IN ('AGENTE','SUPERVISOR','GERENCIA')),
    n_intentos_fallidos INTEGER NOT NULL DEFAULT 0,
    b_bloqueado     BOOLEAN NOT NULL DEFAULT FALSE,
    b_activo        BOOLEAN NOT NULL DEFAULT TRUE,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW(),
    dt_actualizado  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE hds_modulo (
    id_modulo       BIGSERIAL PRIMARY KEY,
    s_codigo        VARCHAR(20) NOT NULL UNIQUE,
    s_nombre        VARCHAR(100) NOT NULL,
    s_aplicacion    VARCHAR(20) NOT NULL CHECK (s_aplicacion IN ('INTEGRENS','INTELIFAC','MOBILE')),
    b_activo        BOOLEAN NOT NULL DEFAULT TRUE,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE hds_ticket (
    id_ticket           BIGSERIAL PRIMARY KEY,
    s_codigo            VARCHAR(20) NOT NULL UNIQUE,
    s_asunto            VARCHAR(300) NOT NULL,
    s_descripcion       TEXT,
    s_canal_origen      VARCHAR(20) NOT NULL CHECK (s_canal_origen IN ('CORREO','WHATSAPP','TELEFONO','INTEGRENS_ERP')),
    s_estado            VARCHAR(30) NOT NULL CHECK (s_estado IN ('NUEVO','EN_PROGRESO','PENDIENTE_CLIENTE','RESUELTO','CERRADO','REABIERTO')),
    s_urgencia          VARCHAR(20) NOT NULL CHECK (s_urgencia IN ('CRITICA','ALTA','MEDIA','BAJA')),
    s_tipo              VARCHAR(20) CHECK (s_tipo IN ('BUG','CONSULTA','CAPACITACION','CONFIGURACION','MEJORA','ACCESO')),
    s_aplicacion        VARCHAR(20) CHECK (s_aplicacion IN ('INTEGRENS','INTELIFAC','MOBILE')),
    id_modulo           BIGINT REFERENCES hds_modulo(id_modulo),
    id_agente_asignado  BIGINT REFERENCES hds_usuario(id_usuario),
    s_correo_cliente    VARCHAR(100),
    s_nombre_cliente    VARCHAR(200),
    s_telefono_cliente  VARCHAR(30),
    n_confianza_ia      NUMERIC(5,2),
    b_revisado_ia       BOOLEAN DEFAULT FALSE,
    b_duplicado         BOOLEAN DEFAULT FALSE,
    id_ticket_padre     BIGINT REFERENCES hds_ticket(id_ticket),
    -- Contexto ERP Integrens (DEC-002 — campos opcionales para v2.0)
    s_origen_sistema    VARCHAR(30),
    s_modulo_erp        VARCHAR(30),
    s_version_erp       VARCHAR(20),
    s_usuario_erp       VARCHAR(100),
    s_empresa_cliente   VARCHAR(200),
    s_accion_erp        VARCHAR(300),
    s_url_pantalla      VARCHAR(500),
    -- Campos de tiempo para métricas gerenciales
    dt_creado           TIMESTAMP NOT NULL DEFAULT NOW(),
    dt_asignado         TIMESTAMP,
    dt_primer_respuesta TIMESTAMP,
    dt_resuelto         TIMESTAMP,
    dt_cerrado          TIMESTAMP,
    n_minutos_pausado   INTEGER NOT NULL DEFAULT 0,
    dt_actualizado      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE hds_ticket_historial (
    id_historial        BIGSERIAL PRIMARY KEY,
    id_ticket           BIGINT NOT NULL REFERENCES hds_ticket(id_ticket),
    s_estado_anterior   VARCHAR(30),
    s_estado_nuevo      VARCHAR(30) NOT NULL,
    id_usuario          BIGINT REFERENCES hds_usuario(id_usuario),
    s_comentario        VARCHAR(500),
    dt_cambio           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE hds_ticket_comentario (
    id_comentario   BIGSERIAL PRIMARY KEY,
    id_ticket       BIGINT NOT NULL REFERENCES hds_ticket(id_ticket),
    id_usuario      BIGINT REFERENCES hds_usuario(id_usuario),
    s_contenido     TEXT NOT NULL,
    b_interno       BOOLEAN NOT NULL DEFAULT FALSE,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE hds_mensaje_origen (
    id_mensaje      BIGSERIAL PRIMARY KEY,
    id_ticket       BIGINT REFERENCES hds_ticket(id_ticket),
    s_canal         VARCHAR(20) NOT NULL,
    s_remitente     VARCHAR(200),
    s_asunto        VARCHAR(300),
    s_cuerpo        TEXT,
    s_message_id    VARCHAR(300) UNIQUE,
    s_screenshot    TEXT,
    b_procesado     BOOLEAN NOT NULL DEFAULT FALSE,
    dt_recibido     TIMESTAMP NOT NULL DEFAULT NOW(),
    dt_procesado    TIMESTAMP
);

CREATE TABLE hds_notificacion (
    id_notificacion BIGSERIAL PRIMARY KEY,
    id_ticket       BIGINT NOT NULL REFERENCES hds_ticket(id_ticket),
    s_canal         VARCHAR(20) NOT NULL,
    s_destinatario  VARCHAR(200) NOT NULL,
    s_asunto        VARCHAR(300),
    s_cuerpo        TEXT,
    s_estado_ticket VARCHAR(30),
    b_enviado       BOOLEAN NOT NULL DEFAULT FALSE,
    dt_enviado      TIMESTAMP,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Verificación:** Script ejecuta sin errores. Todas las tablas creadas.

---

### TASK-004 — Insertar datos iniciales (seed)
**Archivo:** `database/scripts/V002__datos_iniciales.sql`
**Acción:**
```sql
INSERT INTO hds_usuario (s_correo, s_nombre, s_apellido, s_contrasena, s_rol) VALUES
('camilo.ortega@dacta.com.pe',    'Camilo',  'Ortega FR', '$2a$12$PLACEHOLDER', 'SUPERVISOR'),
('carlos.agente@dacta.com.pe',    'Carlos',  'Agente',    '$2a$12$PLACEHOLDER', 'AGENTE'),
('antonny.agente@dacta.com.pe',   'Antonny', 'Agente',    '$2a$12$PLACEHOLDER', 'AGENTE'),
('diego.agente@dacta.com.pe',     'Diego',   'Agente',    '$2a$12$PLACEHOLDER', 'AGENTE'),
('sebastian.rafaile@dacta.com.pe','Sebastian','Rafaile',  '$2a$12$PLACEHOLDER', 'GERENCIA');

INSERT INTO hds_modulo (s_codigo, s_nombre, s_aplicacion) VALUES
('CMR-POS', 'Punto de Venta',                   'INTEGRENS'),
('CMR-VEN', 'Ventas',                            'INTEGRENS'),
('LOG-ALM', 'Almacén',                           'INTEGRENS'),
('LOG-COM', 'Compras',                           'INTEGRENS'),
('FIN-FAC', 'Facturación',                       'INTEGRENS'),
('FIN-CXC', 'Cuentas por Cobrar',                'INTEGRENS'),
('RH',      'Recursos Humanos',                  'INTEGRENS'),
('SYS',     'Sistema / Configuración / Accesos', 'INTEGRENS'),
('IFACE',   'Facturación Electrónica',           'INTELIFAC'),
('MOB',     'Aplicación Móvil',                  'MOBILE');
```
**Verificación:** SELECT COUNT(*) FROM hds_usuario = 5. SELECT COUNT(*) FROM hds_modulo = 10.

---

### TASK-005 — Crear entidades JPA
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/model/entity/`
**Acción:**
Crear entidades JPA para cada tabla con anotaciones @Entity, @Table, @Id,
@GeneratedValue, Lombok @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor:
- UsuarioEntity.java → hds_usuario
- ModuloEntity.java → hds_modulo
- TicketEntity.java → hds_ticket (incluir todos los campos de tiempo y contexto ERP)
- TicketHistorialEntity.java → hds_ticket_historial
- TicketComentarioEntity.java → hds_ticket_comentario
- MensajeOrigenEntity.java → hds_mensaje_origen
- NotificacionEntity.java → hds_notificacion

**Verificación:** `mvn clean compile` sin errores.

---

### TASK-006 — Crear repositorios JPA
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/repository/`
**Acción:**
Crear interfaces JpaRepository:
- UsuarioRepository: findByCorreo, findByCorreoAndActivoTrue
- ModuloRepository: findByActivoTrue, findByCodigoAndActivoTrue
- TicketRepository: findByCodigo, findByEstado, findByAgenteAsignado,
  findByEstadoAndDtResueltoLessThan (para cierre automático)
- TicketHistorialRepository: findByTicketOrderByFechaCambioDesc
- TicketComentarioRepository: findByTicketOrderByDtCreado
- MensajeOrigenRepository: findByMessageIdAndProcesadoFalse, existsByMessageId
- NotificacionRepository: findByTicketAndEnviadoFalse

**Verificación:** `mvn clean compile` sin errores.

---

### TASK-007 — Configurar seguridad JWT
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/security/`
**Acción:**
- JwtUtil.java — generar y validar tokens JWT. Expiración: 8 horas.
- JwtAuthFilter.java — intercepta cada request y valida el token.
- SecurityConfig.java:
  - Rutas públicas: POST /api/auth/login, GET+POST /api/webhook/whatsapp
  - Todo lo demás requiere token válido
  - Stateless session
  - CORS habilitado para localhost:3000

**Verificación:** `mvn clean compile` sin errores.

---

### TASK-008 — Crear endpoint de login
**Archivos:**
- controller/AuthController.java
- service/AuthService.java
- model/dto/LoginRequestDto.java
- model/dto/LoginResponseDto.java

**Acción:**
POST /api/auth/login:
- Valida credenciales. Verifica b_activo = true y b_bloqueado = false.
- Incrementa n_intentos_fallidos en cada fallo.
- Si n_intentos_fallidos >= 5 → b_bloqueado = true.
- Si correcto → resetear n_intentos_fallidos = 0, retornar token JWT + rol + nombre.
- Errores: 401 credenciales incorrectas, 403 cuenta bloqueada, 403 usuario inactivo.

**Verificación:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"camilo.ortega@dacta.com.pe","contrasena":"dacta2026"}'
# Retorna token JWT con status 200
```

---

## ═══════════════════════════════════════
## ÉPICA 1 — RECEPCIÓN AUTOMÁTICA DE CANALES
## HU-001, HU-002, HU-003, HU-004, HU-018, HU-019
## ═══════════════════════════════════════

### TASK-009 — Configurar Gmail API
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/GmailConfig.java`
**Acción:**
- Agregar dependencia google-api-services-gmail en pom.xml.
- Crear GmailConfig.java con cliente autenticado via Service Account.
- application.properties:
  - gmail.account=soporte@integrens.com
  - gmail.credentials.path=classpath:gmail-credentials.json
  - gmail.polling.interval=300000
**Verificación:** `mvn clean compile` sin errores. Bean GmailConfig carga.

---

### TASK-010 — Crear servicio de lectura de correos
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/GmailService.java`
**Acción:**
Métodos:
- leerCorreosNuevos() — lee correos no procesados
- marcarComoProcesado(String messageId)
- obtenerCuerpoCorreo(Message message)
- esRespuestaAHiloExistente(Message message) — detecta In-Reply-To header

Anti-duplicados: verificar messageId en hds_mensaje_origen antes de procesar.

**Verificación:** Test unitario GmailServiceTest.java con mock Gmail client.

---

### TASK-011 — Crear servicio de WhatsApp Business
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/WhatsAppService.java`
**Acción:**
- recibirMensaje(WebhookPayload payload)
- enviarMensaje(String telefono, String mensaje)
- validarWebhook(String token)

application.properties:
- whatsapp.phone.number.id=ID_DEL_NUMERO
- whatsapp.access.token=TOKEN_WHATSAPP
- whatsapp.verify.token=DACTA_VERIFY_2026

Endpoints públicos:
- POST /api/webhook/whatsapp — recibe mensajes
- GET /api/webhook/whatsapp — verificación Meta

**Verificación:** `mvn clean compile`. Endpoint webhook accesible sin token.

---

### TASK-012 — Crear generador de código de ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/util/TicketCodeGenerator.java`
**Acción:**
- Formato: TK-00001 hasta TK-99999
- Consultar último código en hds_ticket y generar el siguiente
- Método synchronized para evitar duplicados en concurrencia

**Verificación:** Test unitario TicketCodeGeneratorTest.java — genera códigos únicos y secuenciales.

---

### TASK-013 — Crear servicio de creación de tickets
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
Métodos:
- crearTicketDesdeCorreo(MensajeOrigenEntity mensaje) → TicketEntity
- crearTicketDesdeWhatsApp(WhatsAppMensaje mensaje) → TicketEntity

En ambos métodos:
  1. Generar código con TicketCodeGenerator
  2. Crear ticket estado NUEVO, registrar dt_creado
  3. Guardar mensaje en hds_mensaje_origen con b_procesado=true
  4. Registrar en historial: NUEVO
  5. Llamar a NotificacionService.enviarConfirmacionRecepcion(ticket)

**Verificación:** Test unitario TicketServiceTest.java — crear ticket mock, verificar código y estado NUEVO.

---

### TASK-014 — Crear detector de duplicados
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/DuplicadoService.java`
**Acción:**
- detectarDuplicado(String asunto, String remitente, String contenido) → Optional<TicketEntity>
- Buscar tickets abiertos del mismo remitente en últimas 72 horas
- Calcular similitud Jaccard entre asuntos y contenidos
- Si similitud >= 0.80 → retornar ticket existente como posible duplicado
- Si es respuesta a hilo (mismo thread) → vincular directamente

**Verificación:** Test unitario DuplicadoServiceTest.java — correo idéntico detecta, correo diferente no detecta.

---

### TASK-015 — Crear scheduler de lectura de correos
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/EmailPollingService.java`
**Acción:**
@Scheduled cada 5 minutos:
1. Llamar GmailService.leerCorreosNuevos()
2. Para cada correo:
   - Si es duplicado → vincular como comentario
   - Si es respuesta a Resuelto/Cerrado → reabrir ticket
   - Si es nuevo → crearTicketDesdeCorreo()
3. Log de cada ejecución

**Verificación:** App iniciada → esperar 5 min → verificar log de ejecución.

---

### TASK-016 — Crear servicio de notificaciones al cliente
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/NotificacionService.java`
**Acción:**
Métodos:
- enviarConfirmacionRecepcion(TicketEntity ticket)
- enviarNotificacionAsignacion(TicketEntity ticket)
- enviarNotificacionPendienteCliente(TicketEntity ticket)
- enviarNotificacionResuelto(TicketEntity ticket)
- enviarNotificacionCerrado(TicketEntity ticket)

Lógica de canal (política oficial DACTA):
- CORREO → responder al mismo hilo vía Gmail API
- WHATSAPP → enviar WhatsApp + correo registrado en Integrens
- TELEFONO / INTEGRENS_ERP → solo correo registrado en Integrens
- Todo seguimiento posterior siempre por correo

Registrar cada notificación en hds_notificacion.

**Verificación:** Test unitario NotificacionServiceTest.java — mock GmailService y WhatsAppService, verificar canal correcto por origen.

---

### TASK-017 — Crear plantillas de notificación
**Archivos:** `backend/src/main/resources/templates/notificaciones/`
**Acción:**
Crear 5 plantillas .txt con variables {codigo_ticket}, {nombre_agente}, {nombre_cliente}:
- confirmacion-recepcion.txt
- asignacion-agente.txt
- pendiente-cliente.txt
- ticket-resuelto.txt
- ticket-cerrado.txt

**Verificación:** NotificacionService carga plantillas sin errores al iniciar.

---

### TASK-018 — Crear endpoint de creación manual de ticket (HU-019 + DEC-002)
**Archivos:**
- controller/TicketController.java
- model/dto/CrearTicketManualDto.java

**Acción:**
POST /api/tickets/manual (JWT — rol AGENTE o SUPERVISOR):
Campos obligatorios: correoCliente, nombreCliente, asunto, descripcion, urgencia, idModulo
Campos opcionales DEC-002: origenSistema, moduloErp, versionErp, usuarioErp,
  empresaCliente, accionRealizada, urlPantalla, screenshotBase64

Lógica:
- Si origenSistema = INTEGRENS_ERP → canal = INTEGRENS_ERP, guardar contexto ERP
- Si no → canal = TELEFONO
- Asignar ticket al agente que lo crea
- Enviar confirmación al correo del cliente

**Verificación:**
```bash
curl -X POST http://localhost:8080/api/tickets/manual \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"correoCliente":"cliente@empresa.com","asunto":"Error POS","urgencia":"ALTA","idModulo":1}'
# Retorna ticket con código TK-XXXXX
```

---

### TASK-019 — Crear servicio de reapertura automática
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
Agregar método:
- reabrirTicket(Long idTicket, String motivo) → TicketEntity
  - Estado RESUELTO o CERRADO → REABIERTO
  - Registrar historial con motivo
  - Notificar al agente que lo atendió

**Verificación:** Test unitario — ticket RESUELTO → reabrirTicket → estado REABIERTO en historial.

---

### TASK-020 — Crear scheduler de cierre automático
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/CierreAutomaticoService.java`
**Acción:**
@Scheduled cada hora:
- Buscar tickets RESUELTO con dt_resuelto < NOW() - 48 horas
- Para cada uno:
  1. Estado → CERRADO. Registrar dt_cerrado = NOW()
  2. Historial: "Cierre automático — sin respuesta del cliente en 48 horas"
  3. NotificacionService.enviarNotificacionCerrado(ticket)

**Verificación:** Test unitario — ticket con dt_resuelto de 49 horas → verifica estado CERRADO.

---

### TASK-021 — Crear endpoint GET de tickets (lista)
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
GET /api/tickets con filtros opcionales:
estado, urgencia, idModulo, idAgente, canal, fechaDesde, fechaHasta, busqueda
Paginado: page, size (default 20)

Control de acceso:
- AGENTE: solo sus tickets + sin asignar
- SUPERVISOR: todos los tickets
- GERENCIA: 403

**Verificación:** GET /api/tickets retorna lista paginada con 200.

---

### TASK-022 — Crear endpoint GET de ticket detalle
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
GET /api/tickets/{id} — retorna TicketDetalleDto con:
datos del ticket, clasificación IA, historial completo, comentarios, mensaje original, contexto ERP si aplica.

Control de acceso:
- AGENTE: solo sus tickets o sin asignar
- SUPERVISOR: cualquier ticket

**Verificación:** GET /api/tickets/1 retorna detalle completo.

---

### TASK-023 — Test de integración Épica 1
**Archivo:** `backend/src/test/java/com/dacta/helpdesk/integracion/Epica1IntegracionTest.java`
**Acción:**
Tests:
1. Correo nuevo → ticket creado estado NUEVO
2. Correo duplicado → vinculado, no nuevo ticket
3. Mensaje WhatsApp → ticket canal WHATSAPP
4. Ticket manual → notificación por correo
5. Ticket vía ERP (DEC-002) → contexto ERP guardado
6. Ticket 49h en RESUELTO → estado CERRADO automático

**Verificación:** `mvn test -Dtest=Epica1IntegracionTest` — todos en verde.

---

### TASK-024 — Commit Épica 1
```bash
git add backend/ database/
git commit -m "feat(epica1): recepcion automatica canales, notificaciones y prep integracion ERP"
git push origin develop
```

---

## ═══════════════════════════════════════
## ÉPICA 2 — MOTOR IA — CLASIFICACIÓN
## HU-005, HU-006, HU-007, HU-008, HT-003
## ═══════════════════════════════════════

### TASK-025 — Configurar Claude API
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/ClaudeApiConfig.java`
**Acción:**
WebClient apuntando a https://api.anthropic.com
application.properties:
- claude.api.key=TU_API_KEY
- claude.api.model=claude-sonnet-4-20250514
- claude.api.max.tokens=1000

**Verificación:** `mvn clean compile`. Bean ClaudeApiConfig carga.

---

### TASK-026 — Crear servicio de clasificación IA
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/ClasificacionIAService.java`
**Acción:**
clasificarTicket(String asunto, String contenido) → ClasificacionResultado

Prompt a Claude API — respuesta en JSON:
```json
{
  "tipo": "BUG|CONSULTA|CAPACITACION|CONFIGURACION|MEJORA|ACCESO",
  "aplicacion": "INTEGRENS|INTELIFAC|MOBILE",
  "modulo": "CMR-POS|CMR-VEN|LOG-ALM|LOG-COM|FIN-FAC|FIN-CXC|RH|SYS|IFACE|MOB",
  "urgencia": "CRITICA|ALTA|MEDIA|BAJA",
  "confianza": 0.95,
  "razon": "Explicación breve"
}
```

**Verificación:** Test unitario — enviar correo de prueba a Claude API, verificar JSON válido con todos los campos.

---

### TASK-027 — Integrar clasificación en creación de ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
Modificar crearTicketDesdeCorreo() y crearTicketDesdeWhatsApp():
- Llamar ClasificacionIAService.clasificarTicket()
- Actualizar ticket: tipo, aplicacion, idModulo, urgencia, n_confianza_ia
- Si confianza < 0.60 → b_revisado_ia = false
- Si urgencia = CRITICA → notificar inmediatamente al equipo

**Verificación:** Crear ticket de prueba → verificar clasificación IA en BD.

---

### TASK-028 — Crear endpoint para corregir clasificación IA
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
PATCH /api/tickets/{id}/clasificacion (AGENTE o SUPERVISOR):
- Recibe: { tipo, aplicacion, idModulo, urgencia }
- Actualiza clasificación. Registra historial: "Clasificación corregida por {usuario}"
- Marca b_revisado_ia = true

**Verificación:** PATCH clasificación → verificar cambio en BD e historial.

---

### TASK-029 — Crear endpoint para cambiar estado del ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
PATCH /api/tickets/{id}/estado (AGENTE o SUPERVISOR):
- Recibe: { nuevoEstado, comentario? }
- Validar transición permitida según flujo definido en SPEC-001
- Si PENDIENTE_CLIENTE → registrar dt inicio pausa SLA
- Si EN_PROGRESO desde PENDIENTE_CLIENTE → calcular minutos pausados, acumular n_minutos_pausado
- Si EN_PROGRESO y sin asignar → asignar al agente, registrar dt_asignado y dt_primer_respuesta
- Si RESUELTO → registrar dt_resuelto = NOW()
- Si CERRADO → registrar dt_cerrado = NOW()
- Registrar en historial. Llamar NotificacionService.

**Verificación:** NUEVO → EN_PROGRESO → verificar dt_asignado, historial y notificación.

---

### TASK-030 — Crear endpoint para asignar ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
PATCH /api/tickets/{id}/asignar (solo SUPERVISOR):
- Verifica agente activo. Actualiza id_agente_asignado y dt_asignado.
- Historial: "Asignado a {agente} por {supervisor}"
- NotificacionService.enviarNotificacionAsignacion(ticket)

**Verificación:** Asignar a Diego → verificar asignación, historial y notificación.

---

### TASK-031 — Crear endpoint para agregar comentario
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
POST /api/tickets/{id}/comentarios:
- Recibe: { contenido, esInterno }
- Si esInterno = false → enviar por correo al cliente (respuesta al hilo)
- Si esInterno = true → guardar solo en BD

**Verificación:** Comentario público → guardado en BD y correo enviado.

---

### TASK-032 — Test de integración Épica 2
**Archivo:** `backend/src/test/java/com/dacta/helpdesk/integracion/Epica2IntegracionTest.java`
**Acción:**
Tests:
1. Ticket creado → clasificación IA con todos los campos
2. Urgencia CRITICA → notificación inmediata al equipo
3. Confianza < 60% → b_revisado_ia = false
4. Corrección clasificación → historial con nombre agente
5. Cambio estado PENDIENTE_CLIENTE → n_minutos_pausado se acumula
6. Transición inválida → error con mensaje descriptivo

**Verificación:** `mvn test -Dtest=Epica2IntegracionTest` — todos en verde.

---

### TASK-033 — Commit Épica 2
```bash
git add backend/
git commit -m "feat(epica2): clasificacion automatica con Claude API y gestion de estados"
git push origin develop
```

---

## ═══════════════════════════════════════
## ÉPICA 3 — FRONTEND — PANEL DE AGENTES
## HU-009, HU-010, HU-011, HU-012, HU-013
## ═══════════════════════════════════════

### TASK-034 — Configurar proyecto React
**Archivo:** `frontend/`
**Acción:**
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss @tailwindcss/forms axios react-router-dom
npm install react-query date-fns recharts
npx tailwindcss init
```

tailwind.config.js — colores DACTA:
```javascript
colors: {
  'dacta-primary': '#2E4AF6',
  'dacta-secondary': '#6FA3B2',
  'dacta-dark': '#003366',
}
```

.env: VITE_API_URL=http://localhost:8080/api

**Verificación:** `npm run dev` — app React en localhost:3000.

---

### TASK-035 — Crear estructura de carpetas frontend
**Archivo:** `frontend/src/`
**Acción:**
```
src/
├── components/
│   ├── common/
│   ├── tickets/
│   └── dashboard/
├── pages/
├── services/
├── hooks/
├── context/
└── utils/
```
**Verificación:** Estructura creada. `npm run dev` sin errores.

---

### TASK-036 — Crear servicio de autenticación frontend
**Archivo:** `frontend/src/services/authService.js`
**Acción:**
- login(correo, contrasena) → token JWT
- logout() → limpiar token
- getUsuarioActual() → datos del usuario
- getRol() → rol del usuario
- Interceptor Axios: Authorization header en cada request
- Interceptor Axios: 401 → redirigir a /login

**Verificación:** Login con credenciales válidas → retorna token.

---

### TASK-037 — Crear página de Login
**Archivo:** `frontend/src/pages/LoginPage.jsx`
**Acción:**
- Logo DACTA Help Desk IA
- Campo correo + campo contraseña
- Botón "Ingresar" color #2E4AF6
- Manejo de errores: credenciales incorrectas, cuenta bloqueada
- Fondo blanco. Responsive centrado.

**Verificación:** Login correcto → redirige al panel. Login incorrecto → muestra error.

---

### TASK-038 — Crear layout principal con sidebar
**Archivo:** `frontend/src/components/common/Layout.jsx`
**Acción:**
Sidebar izquierdo color #003366:
- Logo + nombre DACTA Help Desk IA
- Menú según rol:
  - AGENTE: Mis Tickets, Cola de Tickets
  - SUPERVISOR: Todo lo anterior + Todos los Tickets + Admin
  - GERENCIA: Solo Dashboard
- Nombre + rol del usuario en la parte inferior
- Botón cerrar sesión
- Header: título + nombre usuario + indicador "IA activa"
- Responsive: sidebar colapsable en móvil

**Verificación:** Layout carga con sidebar #003366. Menú varía por rol.

---

### TASK-039 — Crear servicio de tickets frontend
**Archivo:** `frontend/src/services/ticketService.js`
**Acción:**
- obtenerTickets(filtros, pagina)
- obtenerTicketDetalle(id)
- cambiarEstado(id, nuevoEstado, comentario)
- asignarTicket(id, idAgente)
- agregarComentario(id, contenido, esInterno)
- corregirClasificacion(id, clasificacion)
- crearTicketManual(datos)

**Verificación:** obtenerTickets() retorna lista del backend.

---

### TASK-040 — Crear componente TicketCard
**Archivo:** `frontend/src/components/tickets/TicketCard.jsx`
**Acción:**
Fila de ticket con: código, cliente, asunto truncado, módulo, estado (badge),
urgencia (color), responsable, fecha, badge "IA".

Colores urgencia:
- Crítica: #EF4444 (rojo)
- Alta: #F97316 (naranja)
- Media: #EAB308 (amarillo)
- Baja: #22C55E (verde)

Click → navega al detalle. Responsive.

**Verificación:** Componente renderiza con datos de prueba.

---

### TASK-041 — Crear página Panel de Tickets (HU-009)
**Archivo:** `frontend/src/pages/PanelTicketsPage.jsx`
**Acción:**
- Header: total tickets, tickets críticos, mis tickets asignados
- Barra de filtros (usa FiltrosTickets)
- Lista de tickets (usa TicketCard)
- Paginación
- Botón "Crear ticket manual" (AGENTE y SUPERVISOR)
- Actualización automática cada 30 segundos
- Indicador de carga. Estado vacío descriptivo.

**Verificación:** Panel carga lista. Filtros funcionan. Paginación funciona.

---

### TASK-042 — Crear página Detalle de Ticket (HU-012)
**Archivo:** `frontend/src/pages/TicketDetallePage.jsx`
**Acción:**
Secciones:
- Cabecera: código, estado, urgencia, canal de origen
- Datos del cliente: nombre, correo, teléfono
- Contexto ERP (si canal = INTEGRENS_ERP): módulo, versión, acción, captura
- Mensaje original completo
- Clasificación IA: tipo, aplicación, módulo, confianza (barra de progreso)
- Acciones: Tomar ticket, Cambiar estado, Reasignar (Supervisor), Corregir IA
- Historial: timeline vertical de cambios de estado
- Comentarios: internos y públicos separados
- Formulario responder al cliente / agregar nota interna

**Verificación:** Detalle muestra todos los campos. Cambio de estado funciona.

---

### TASK-043 — Crear modal de creación de ticket manual (HU-019)
**Archivo:** `frontend/src/components/tickets/CrearTicketManualModal.jsx`
**Acción:**
Modal con formulario:
- Búsqueda cliente por correo
- Asunto (obligatorio)
- Descripción del problema
- Urgencia (select)
- Módulo (select dinámico desde API)
- Botón Crear → ticketService.crearTicketManual()
- Confirmación con código del ticket generado

**Verificación:** Modal crea ticket y muestra código.

---

### TASK-044 — Crear componente de filtros avanzados (HU-013)
**Archivo:** `frontend/src/components/tickets/FiltrosTickets.jsx`
**Acción:**
- Select: Estado, Urgencia, Módulo, Agente (solo Supervisor), Canal
- DatePicker: Fecha desde / Fecha hasta
- Input: búsqueda libre
- Botón "Limpiar filtros"
- Filtros en tiempo real con debounce 500ms

**Verificación:** Filtros se aplican. Combinación funciona. Limpiar resetea todo.

---

### TASK-045 — Crear panel de carga de agentes
**Archivo:** `frontend/src/components/tickets/CargaAgentesPanel.jsx`
**Acción:**
Visible solo para SUPERVISOR:
- Tarjeta por agente: Carlos, Antonny, Diego
- Tickets activos por agente + distribución por urgencia
- Botón rápido de reasignar

**Verificación:** Panel muestra carga real de los 3 agentes.

---

### TASK-046 — Test de componentes React Épica 3
**Archivos:** `frontend/src/__tests__/`
**Acción:**
- PanelTicketsPage.test.jsx — renderiza lista, filtros funcionan
- TicketDetallePage.test.jsx — muestra todos los campos
- CrearTicketManualModal.test.jsx — validación de formulario

**Verificación:** `npm test` — todos los tests en verde.

---

### TASK-047 — Commit Épica 3
```bash
git add frontend/
git commit -m "feat(epica3): panel agentes, detalle ticket, filtros y gestion"
git push origin develop
```

---

## ═══════════════════════════════════════
## ÉPICA 4 — DASHBOARD GERENCIAL
## HU-014, HU-015 + Métricas de tiempo FRT/TTR
## ═══════════════════════════════════════

### TASK-048 — Crear endpoints de métricas backend
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/MetricasController.java`
**Acción:**
GET /api/metricas (SUPERVISOR o GERENCIA):
Parámetros: fechaDesde, fechaHasta

Retorna métricas estándar + métricas de tiempo:
```json
{
  "totalTickets": 0,
  "porEstado": {},
  "porUrgencia": {},
  "porModulo": [],
  "porCanal": {},
  "porAgente": [
    {
      "nombre": "Carlos",
      "totalTickets": 0,
      "ticketsActivos": 0,
      "frtPromedioMinutos": 0,
      "ttrPromedioHoras": 0,
      "handleTimePromedioHoras": 0
    }
  ],
  "frtEquipoPromedioMinutos": 0,
  "ttrEquipoPromedioHoras": 0,
  "comparativaPeriodoAnterior": { "variacion": 0 }
}
```

Cálculos de tiempo (descontando n_minutos_pausado):
- FRT (First Response Time) = dt_primer_respuesta − dt_creado
- TTR (Time to Resolution) = dt_resuelto − dt_creado − n_minutos_pausado
- Handle Time = dt_resuelto − dt_asignado − n_minutos_pausado

**Verificación:** GET /api/metricas retorna JSON con FRT, TTR y Handle Time calculados.

---

### TASK-049 — Crear página Dashboard Gerencial (HU-014 y HU-015)
**Archivo:** `frontend/src/pages/DashboardPage.jsx`
**Acción:**
Tarjetas resumen (fila superior):
- Total tickets | Tickets críticos | FRT promedio equipo | TTR promedio equipo

Gráficos (Recharts, colores DACTA):
- Barras: tickets por módulo (#2E4AF6)
- Torta: distribución por urgencia
- Líneas: evolución tickets por día

Tabla comparativa de agentes:
- Carlos / Antonny / Diego
- Columnas: tickets resueltos, FRT promedio, TTR promedio, Handle Time
- Barras de progreso por agente

Selector período: Hoy, Semana, Mes, Trimestre, Personalizado
Actualización automática cada 60 segundos.
Solo lectura — sin botones de acción.
Colores DACTA obligatorios.

**Verificación:** Dashboard carga métricas reales incluyendo FRT y TTR por agente. Filtro de período actualiza todos los gráficos.

---

### TASK-050 — Commit Épica 4
```bash
git add backend/ frontend/
git commit -m "feat(epica4): dashboard gerencial con metricas FRT TTR y comparativa agentes"
git push origin develop
```

---

## ═══════════════════════════════════════
## ÉPICA 5 — SEGURIDAD Y ADMINISTRACIÓN
## HU-016, HU-017
## ═══════════════════════════════════════

### TASK-051 — Crear endpoints de administración de usuarios
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/AdminController.java`
**Acción:**
Solo rol SUPERVISOR:
- GET /api/admin/usuarios
- POST /api/admin/usuarios
- PATCH /api/admin/usuarios/{id}
- PATCH /api/admin/usuarios/{id}/desactivar
- PATCH /api/admin/usuarios/{id}/desbloquear — resetea n_intentos_fallidos y b_bloqueado

**Verificación:** CRUD usuarios. Desactivar revoca acceso inmediatamente.

---

### TASK-052 — Crear endpoints de administración de módulos
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/AdminController.java`
**Acción:**
Solo rol SUPERVISOR:
- GET /api/admin/modulos
- POST /api/admin/modulos
- PATCH /api/admin/modulos/{id}
- PATCH /api/admin/modulos/{id}/desactivar

**Verificación:** CRUD módulos. Módulo desactivado no aparece en clasificación IA.

---

### TASK-053 — Crear página de Administración frontend
**Archivo:** `frontend/src/pages/AdminPage.jsx`
**Acción:**
2 tabs — solo visible para SUPERVISOR:
- Tab Usuarios: tabla + acciones editar/desactivar/desbloquear + crear usuario
- Tab Módulos: tabla + acciones editar/desactivar + crear módulo
- Formularios en modales con validación

**Verificación:** CRUD usuarios y módulos funciona desde la interfaz.

---

### TASK-054 — Implementar guards de ruta por rol
**Archivo:** `frontend/src/components/common/ProtectedRoute.jsx`
**Acción:**
- Sin token → /login
- Token expirado → /login
- Rol sin acceso → 403

Rutas:
- AGENTE: /tickets, /tickets/:id
- SUPERVISOR: todo + /admin, /dashboard
- GERENCIA: solo /dashboard

**Verificación:** Agente accede a /admin → 403. Token expirado → login.

---

### TASK-055 — Test de seguridad y roles
**Archivo:** `backend/src/test/java/com/dacta/helpdesk/security/SeguridadTest.java`
**Acción:**
Tests:
1. Sin token → 401
2. Token expirado → 401
3. Agente en /api/admin → 403
4. Gerencia en /api/tickets → 403
5. 5 intentos fallidos → cuenta bloqueada
6. Usuario desactivado → 403

**Verificación:** `mvn test -Dtest=SeguridadTest` — todos en verde.

---

### TASK-056 — Commit Épica 5
```bash
git add backend/ frontend/
git commit -m "feat(epica5): seguridad JWT, roles, administracion usuarios y modulos"
git push origin develop
```

---

## ═══════════════════════════════════════
## CIERRE — LOGS, CI/CD Y VALIDACIÓN FINAL
## ═══════════════════════════════════════

### TASK-057 — Implementar sistema de logs y auditoría (HT-008)
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/AuditoriaConfig.java`
**Acción:**
- Interceptor: registra cada request con usuario, endpoint, método, timestamp, IP
- Log de cada cambio de estado con usuario responsable
- Log de cada clasificación IA con confianza y resultado
- Logback: archivo rotativo diario
- Formato: [FECHA] [USUARIO] [ACCION] [ENTIDAD] [DETALLE]

**Verificación:** Cambiar estado de ticket → verificar registro en log de auditoría.

---

### TASK-058 — Configurar pipeline CI/CD GitLab (HT-009)
**Archivo:** `.gitlab-ci.yml`
**Acción:**
```yaml
stages:
  - build
  - test
  - deploy

build-backend:
  stage: build
  script: cd backend && mvn clean package -DskipTests

test-backend:
  stage: test
  script: cd backend && mvn test

build-frontend:
  stage: build
  script: cd frontend && npm install && npm run build

deploy-dev:
  stage: deploy
  script: echo "Deploy servidor DACTA"
  only: [develop]
```
**Verificación:** Push a develop → pipeline ejecuta todas las etapas en verde.

---

### TASK-059 — Pruebas de aceptación finales (QA)
**Archivo:** `docs/qa/PRUEBAS-ACEPTACION-MVP.md`
**Acción:**
Ejecutar y documentar los criterios QA del SPEC-001:

| Criterio | Resultado |
|---|---|
| Correo nuevo → ticket en < 5 minutos | ✓/✗ |
| Correo duplicado → vinculado, no nuevo ticket | ✓/✗ |
| WhatsApp → ticket canal WHATSAPP | ✓/✗ |
| Ticket manual → notificación por correo | ✓/✗ |
| Dos agentes toman mismo ticket → solo uno lo obtiene | ✓/✗ |
| SLA pausa en Pendiente Cliente | ✓/✗ |
| Cierre automático 48h | ✓/✗ |
| Dashboard gerencia → solo lectura | ✓/✗ |
| FRT y TTR calculados correctamente | ✓/✗ |
| Cuenta bloqueada tras 5 intentos | ✓/✗ |
| Interfaz responsiva en móvil | ✓/✗ |

Registrar cada prueba con evidencia (captura de pantalla).

**Verificación:** Todos los criterios marcados ✓. Documento en docs/qa/.

---

### TASK-060 — Release MVP v1.0
**Acción:**
```bash
git add .
git commit -m "release: DACTA Help Desk IA v1.0 MVP listo para demo"
git tag v1.0.0
git push origin develop
git push origin --tags
```
**Verificación:** Tag v1.0.0 en GitLab. Pipeline verde.

---

## RESUMEN TOTAL

| Bloque | Tareas | Descripción |
|---|---|---|
| Épica 0 — Cimientos | TASK-001 a 008 | 8 tareas |
| Épica 1 — Canales | TASK-009 a 024 | 16 tareas |
| Épica 2 — Motor IA | TASK-025 a 033 | 9 tareas |
| Épica 3 — Gestión | TASK-034 a 047 | 14 tareas |
| Épica 4 — Dashboard | TASK-048 a 050 | 3 tareas |
| Épica 5 — Seguridad | TASK-051 a 056 | 6 tareas |
| Cierre | TASK-057 a 060 | 4 tareas |
| **TOTAL** | **60 tareas** | |

---

## REGLAS PARA CLAUDE CODE — RECORDATORIO FINAL

1. LEER SPEC-001 + DEC-002 antes de cada tarea.
2. EJECUTAR solo la tarea indicada — ni una línea más.
3. VERIFICAR con el comando indicado antes de reportar.
4. REPORTAR al Orquestador Camilo Ortega FR y ESPERAR aprobación.
5. NUNCA avanzar sin aprobación explícita.
6. RESPETAR colores DACTA: #2E4AF6 / #6FA3B2 / #003366.
7. SEGUIR estándares: M-O-DES-001, M-O-DES-002, M-O-DES-003.

---
*DACTA S.A.C. — Documento controlado*
*TASK-LIST-001 v1.1 — 2026-05-31*
*Orquestador: Camilo Ortega FR — QE / SDD*
