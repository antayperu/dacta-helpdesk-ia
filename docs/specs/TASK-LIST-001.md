# TASK-LIST-001 — Lista de Tareas Atómicas
# DACTA Help Desk IA v1.0
# Versión: 1.0 | Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR — QE / SDD
# Metodología: SDD — Spec-Driven Development
# Referencia: SPEC-001 v1.1

---

## INSTRUCCIONES PARA CLAUDE CODE

Eres el agente implementador del proyecto DACTA Help Desk IA.
Antes de ejecutar cualquier tarea debes:
1. Leer AGENTS.md — reglas del proyecto.
2. Leer CONVENTIONS.md — nomenclaturas y estándares.
3. Leer SPEC-001-historias-usuario.md — fuente de verdad funcional.
4. Ejecutar SOLO la tarea indicada — ni una línea más.
5. Ejecutar la verificación al final de cada tarea.
6. Reportar al Orquestador (Camilo Ortega FR) y esperar aprobación.

**NUNCA avanzar a la siguiente tarea sin aprobación explícita del Orquestador.**

---

## STACK TECNOLÓGICO

- Backend: Java 17 + Spring Boot 3.x
- Frontend: React 18 + Tailwind CSS
- Base de datos: PostgreSQL 15
- IA: Claude API — modelo claude-sonnet-4-20250514
- Correo: Gmail API v1
- Mensajería: WhatsApp Business Cloud API
- Autenticación: JWT (jjwt)
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
| ÉPICA 3 — Gestión | TASK-034 a TASK-050 | HU-009 a HU-013 |
| ÉPICA 4 — Dashboard | TASK-051 a TASK-058 | HU-014, HU-015 |
| ÉPICA 5 — Seguridad | TASK-059 a TASK-066 | HU-016, HU-017 |
| CIERRE | TASK-067 a TASK-070 | HT-008, HT-009 |

---

## ═══════════════════════════════════════
## ÉPICA 0 — CIMIENTOS
## Base de datos + Spring Boot + Autenticación
## ═══════════════════════════════════════

### TASK-001 — Configurar proyecto Spring Boot base
**Archivo:** `backend/pom.xml`
**Acción:**
Crear el proyecto Spring Boot 3.x con las siguientes dependencias en pom.xml:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-mail
- postgresql (driver)
- jjwt-api, jjwt-impl, jjwt-jackson (versión 0.11.5)
- lombok
- spring-boot-starter-validation
- spring-boot-starter-actuator

Configurar `application.properties` con:
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
Crear la estructura de paquetes siguiendo M-O-DES-001:
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
**Verificación:** Estructura de carpetas creada. `mvn clean compile` sin errores.

---

### TASK-003 — Crear script de base de datos — tablas principales
**Archivo:** `database/scripts/V001__crear_tablas_principales.sql`
**Acción:**
Crear script SQL siguiendo M-O-DES-002 con las tablas:

```sql
-- Tabla de usuarios del sistema
CREATE TABLE hds_usuario (
    id_usuario      BIGSERIAL PRIMARY KEY,
    s_correo        VARCHAR(100) NOT NULL UNIQUE,
    s_nombre        VARCHAR(100) NOT NULL,
    s_apellido      VARCHAR(100) NOT NULL,
    s_contrasena    VARCHAR(255) NOT NULL,
    s_rol           VARCHAR(20) NOT NULL CHECK (s_rol IN ('AGENTE','SUPERVISOR','GERENCIA')),
    b_activo        BOOLEAN NOT NULL DEFAULT TRUE,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW(),
    dt_actualizado  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de módulos (mantenible por Supervisor)
CREATE TABLE hds_modulo (
    id_modulo       BIGSERIAL PRIMARY KEY,
    s_codigo        VARCHAR(20) NOT NULL UNIQUE,
    s_nombre        VARCHAR(100) NOT NULL,
    s_aplicacion    VARCHAR(20) NOT NULL CHECK (s_aplicacion IN ('INTEGRENS','INTELIFAC','MOBILE')),
    b_activo        BOOLEAN NOT NULL DEFAULT TRUE,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla principal de tickets
CREATE TABLE hds_ticket (
    id_ticket           BIGSERIAL PRIMARY KEY,
    s_codigo            VARCHAR(20) NOT NULL UNIQUE,
    s_asunto            VARCHAR(300) NOT NULL,
    s_descripcion       TEXT,
    s_canal_origen      VARCHAR(20) NOT NULL CHECK (s_canal_origen IN ('CORREO','WHATSAPP','TELEFONO')),
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
    dt_creado           TIMESTAMP NOT NULL DEFAULT NOW(),
    dt_asignado         TIMESTAMP,
    dt_resuelto         TIMESTAMP,
    dt_cerrado          TIMESTAMP,
    dt_actualizado      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de historial de cambios de estado
CREATE TABLE hds_ticket_historial (
    id_historial        BIGSERIAL PRIMARY KEY,
    id_ticket           BIGINT NOT NULL REFERENCES hds_ticket(id_ticket),
    s_estado_anterior   VARCHAR(30),
    s_estado_nuevo      VARCHAR(30) NOT NULL,
    id_usuario          BIGINT REFERENCES hds_usuario(id_usuario),
    s_comentario        VARCHAR(500),
    dt_cambio           TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de comentarios del ticket
CREATE TABLE hds_ticket_comentario (
    id_comentario   BIGSERIAL PRIMARY KEY,
    id_ticket       BIGINT NOT NULL REFERENCES hds_ticket(id_ticket),
    id_usuario      BIGINT REFERENCES hds_usuario(id_usuario),
    s_contenido     TEXT NOT NULL,
    b_interno       BOOLEAN NOT NULL DEFAULT FALSE,
    dt_creado       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de mensajes/correos originales
CREATE TABLE hds_mensaje_origen (
    id_mensaje      BIGSERIAL PRIMARY KEY,
    id_ticket       BIGINT REFERENCES hds_ticket(id_ticket),
    s_canal         VARCHAR(20) NOT NULL,
    s_remitente     VARCHAR(200),
    s_asunto        VARCHAR(300),
    s_cuerpo        TEXT,
    s_message_id    VARCHAR(300) UNIQUE,
    b_procesado     BOOLEAN NOT NULL DEFAULT FALSE,
    dt_recibido     TIMESTAMP NOT NULL DEFAULT NOW(),
    dt_procesado    TIMESTAMP
);

-- Tabla de notificaciones enviadas al cliente
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

**Verificación:** Script ejecuta sin errores en PostgreSQL. Tablas creadas correctamente.

---

### TASK-004 — Insertar datos iniciales (seed)
**Archivo:** `database/scripts/V002__datos_iniciales.sql`
**Acción:**
Insertar datos iniciales:

```sql
-- Usuarios iniciales del sistema
INSERT INTO hds_usuario (s_correo, s_nombre, s_apellido, s_contrasena, s_rol) VALUES
('camilo.ortega@dacta.com.pe', 'Camilo', 'Ortega FR', '$2a$12$HASH_BCRYPT_AQUI', 'SUPERVISOR'),
('carlos.agente@dacta.com.pe', 'Carlos', 'Agente', '$2a$12$HASH_BCRYPT_AQUI', 'AGENTE'),
('antonny.agente@dacta.com.pe', 'Antonny', 'Agente', '$2a$12$HASH_BCRYPT_AQUI', 'AGENTE'),
('diego.agente@dacta.com.pe', 'Diego', 'Agente', '$2a$12$HASH_BCRYPT_AQUI', 'AGENTE'),
('sebastian.rafaile@dacta.com.pe', 'Sebastian', 'Rafaile', '$2a$12$HASH_BCRYPT_AQUI', 'GERENCIA');

-- Módulos iniciales de Integrens
INSERT INTO hds_modulo (s_codigo, s_nombre, s_aplicacion) VALUES
('CMR-POS', 'Punto de Venta', 'INTEGRENS'),
('CMR-VEN', 'Ventas', 'INTEGRENS'),
('LOG-ALM', 'Almacén', 'INTEGRENS'),
('LOG-COM', 'Compras', 'INTEGRENS'),
('FIN-FAC', 'Facturación', 'INTEGRENS'),
('FIN-CXC', 'Cuentas por Cobrar', 'INTEGRENS'),
('RH', 'Recursos Humanos', 'INTEGRENS'),
('SYS', 'Sistema / Configuración / Accesos', 'INTEGRENS'),
('IFACE', 'Facturación Electrónica', 'INTELIFAC'),
('MOB', 'Aplicación Móvil', 'MOBILE');
```

**Verificación:** Datos insertados. SELECT COUNT(*) FROM hds_usuario = 5. SELECT COUNT(*) FROM hds_modulo = 10.

---

### TASK-005 — Crear entidades JPA
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/model/entity/`
**Acción:**
Crear las entidades JPA correspondientes a cada tabla:
- `UsuarioEntity.java` → tabla hds_usuario
- `ModuloEntity.java` → tabla hds_modulo
- `TicketEntity.java` → tabla hds_ticket
- `TicketHistorialEntity.java` → tabla hds_ticket_historial
- `TicketComentarioEntity.java` → tabla hds_ticket_comentario
- `MensajeOrigenEntity.java` → tabla hds_mensaje_origen
- `NotificacionEntity.java` → tabla hds_notificacion

Cada entidad debe seguir M-O-DES-001:
- Anotaciones JPA: @Entity, @Table, @Id, @GeneratedValue
- Lombok: @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor
- Nombres de campos en camelCase mapeados a snake_case de la BD

**Verificación:** `mvn clean compile` sin errores. Todas las entidades compilan.

---

### TASK-006 — Crear repositorios JPA
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/repository/`
**Acción:**
Crear interfaces JpaRepository para cada entidad:
- `UsuarioRepository.java` — incluir: findByCorreo(String correo)
- `ModuloRepository.java` — incluir: findByActivoTrue()
- `TicketRepository.java` — incluir: findByCodigo(String codigo), findByEstado(String estado), findByAgenteAsignado(Long idAgente)
- `TicketHistorialRepository.java` — incluir: findByTicketOrderByFechaCambioDesc(Long idTicket)
- `TicketComentarioRepository.java` — incluir: findByTicketOrderByFechadCreado(Long idTicket)
- `MensajeOrigenRepository.java` — incluir: findByMessageIdAndProcesadoFalse(String messageId)
- `NotificacionRepository.java` — incluir: findByTicketAndEnviadoFalse(Long idTicket)

**Verificación:** `mvn clean compile` sin errores.

---

### TASK-007 — Configurar seguridad JWT
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/security/`
**Acción:**
Crear los componentes de seguridad:
- `JwtUtil.java` — generar y validar tokens JWT. Expiración: 8 horas.
- `JwtAuthFilter.java` — filtro que intercepta cada request y valida el token.
- `SecurityConfig.java` — configurar Spring Security:
  - Rutas públicas: POST /api/auth/login
  - Rutas protegidas: todo lo demás requiere token válido
  - Stateless session
  - CORS habilitado para localhost:3000

**Verificación:** `mvn clean compile` sin errores. Configuración de seguridad carga sin errores.

---

### TASK-008 — Crear endpoint de login
**Archivos:**
- `backend/src/main/java/com/dacta/helpdesk/controller/AuthController.java`
- `backend/src/main/java/com/dacta/helpdesk/service/AuthService.java`
- `backend/src/main/java/com/dacta/helpdesk/model/dto/LoginRequestDto.java`
- `backend/src/main/java/com/dacta/helpdesk/model/dto/LoginResponseDto.java`

**Acción:**
Implementar el endpoint POST /api/auth/login:
- Recibe: { "correo": "...", "contrasena": "..." }
- Valida credenciales contra hds_usuario
- Verifica que usuario esté activo (b_activo = true)
- Incrementa contador de intentos fallidos (máximo 5 — bloquea cuenta)
- Si correcto: retorna token JWT + datos del usuario + rol
- Si incorrecto: retorna 401 con mensaje de error
- Si bloqueado: retorna 403 con mensaje de cuenta bloqueada

**Verificación:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"camilo.ortega@dacta.com.pe","contrasena":"dacta2026"}'
# Debe retornar token JWT
```

---

## ═══════════════════════════════════════
## ÉPICA 1 — RECEPCIÓN AUTOMÁTICA DE CANALES
## HU-001, HU-002, HU-003, HU-004, HU-018, HU-019
## ═══════════════════════════════════════

### TASK-009 — Configurar Gmail API
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/GmailConfig.java`
**Acción:**
Configurar el cliente de Gmail API:
- Agregar dependencia google-api-services-gmail en pom.xml
- Crear GmailConfig.java con el cliente autenticado usando Service Account
- Configurar en application.properties:
  - gmail.account=soporte@integrens.com
  - gmail.credentials.path=classpath:gmail-credentials.json
  - gmail.polling.interval=300000 (5 minutos en ms)

**Verificación:** `mvn clean compile` sin errores. Bean GmailConfig carga correctamente.

---

### TASK-010 — Crear servicio de lectura de correos
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/GmailService.java`
**Acción:**
Implementar GmailService con los métodos:
- `leerCorreosNuevos()` — lee correos no procesados de soporte@integrens.com
- `marcarComoProcesado(String messageId)` — marca el correo como leído/procesado
- `obtenerCuerpoCorreo(Message message)` — extrae el cuerpo del correo (texto plano y HTML)
- `esRespuestaAHiloExistente(Message message)` — detecta si es respuesta a hilo previo

Lógica anti-duplicados:
- Antes de procesar, verificar en hds_mensaje_origen si el messageId ya existe
- Si existe y b_procesado = true → ignorar

**Verificación:** Test unitario `GmailServiceTest.java` — mock del cliente Gmail, verificar que leerCorreosNuevos() retorna lista de mensajes.

---

### TASK-011 — Crear servicio de lectura de WhatsApp
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/WhatsAppService.java`
**Acción:**
Implementar WhatsAppService con los métodos:
- `recibirMensaje(WebhookPayload payload)` — procesa el webhook de WhatsApp Business API
- `enviarMensaje(String telefono, String mensaje)` — envía mensaje de respuesta
- `validarWebhook(String token)` — valida el token de verificación de Meta

Configurar en application.properties:
- whatsapp.phone.number.id=ID_DEL_NUMERO
- whatsapp.access.token=TOKEN_WHATSAPP
- whatsapp.verify.token=DACTA_VERIFY_2026

Crear endpoint: POST /api/webhook/whatsapp (público — sin JWT)
Crear endpoint: GET /api/webhook/whatsapp (verificación Meta — público)

**Verificación:** `mvn clean compile` sin errores. Endpoint webhook accesible sin token.

---

### TASK-012 — Crear generador de código de ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/util/TicketCodeGenerator.java`
**Acción:**
Implementar la generación del código único de ticket:
- Formato: TK-00001, TK-00002, ... TK-99999
- Consultar el último código en hds_ticket y generar el siguiente
- Usar synchronized para evitar duplicados en concurrencia

**Verificación:** Test unitario `TicketCodeGeneratorTest.java` — verificar que genera códigos únicos y secuenciales.

---

### TASK-013 — Crear servicio de creación de tickets
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
Implementar TicketService con el método:
- `crearTicketDesdeCorreo(MensajeOrigenEntity mensaje)` → TicketEntity
  - Genera código único con TicketCodeGenerator
  - Crea ticket con estado NUEVO
  - Registra canal de origen: CORREO
  - Guarda mensaje original en hds_mensaje_origen con b_procesado=true
  - Guarda ticket en hds_ticket
  - Registra en hds_ticket_historial el cambio a estado NUEVO
  - Llama a NotificacionService.enviarConfirmacionRecepcion(ticket)

- `crearTicketDesdeWhatsApp(WhatsAppMensaje mensaje)` → TicketEntity
  - Similar al anterior con canal WHATSAPP

**Verificación:** Test unitario `TicketServiceTest.java` — crear ticket desde correo mock, verificar código generado y estado NUEVO.

---

### TASK-014 — Crear detector de duplicados
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/DuplicadoService.java`
**Acción:**
Implementar DuplicadoService con el método:
- `detectarDuplicado(String asunto, String remitente, String contenido)` → Optional<TicketEntity>
  - Buscar tickets abiertos del mismo remitente en las últimas 72 horas
  - Calcular similitud usando Jaccard Similarity entre asuntos y contenidos
  - Si similitud >= 0.80 → retornar el ticket existente como posible duplicado
  - Si es respuesta a hilo (mismo messageId de thread) → vincular directamente sin preguntar

**Verificación:** Test unitario `DuplicadoServiceTest.java` — casos: correo idéntico (debe detectar), correo diferente (no debe detectar), respuesta a hilo (debe vincular).

---

### TASK-015 — Crear scheduler de lectura de correos
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/EmailPollingService.java`
**Acción:**
Implementar el scheduler con @Scheduled:
- Ejecutar cada 5 minutos (configurable en application.properties)
- Para cada correo nuevo:
  1. Verificar si es duplicado con DuplicadoService
  2. Si es duplicado → vincular al ticket existente como comentario
  3. Si es respuesta a ticket Resuelto/Cerrado → reabrir ticket automáticamente
  4. Si es nuevo → crear ticket con TicketService
- Log de cada ejecución en consola

**Verificación:** Iniciar la app, esperar 5 minutos, verificar en logs que el scheduler ejecutó sin errores.

---

### TASK-016 — Crear servicio de notificaciones al cliente
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/NotificacionService.java`
**Acción:**
Implementar NotificacionService con los métodos:
- `enviarConfirmacionRecepcion(TicketEntity ticket)` — notifica creación del ticket
- `enviarNotificacionAsignacion(TicketEntity ticket)` — notifica agente asignado
- `enviarNotificacionPendienteCliente(TicketEntity ticket)` — solicita información
- `enviarNotificacionResuelto(TicketEntity ticket)` — notifica solución
- `enviarNotificacionCerrado(TicketEntity ticket)` — notifica cierre

Lógica de canal:
- Si canal_origen = CORREO → enviar por correo al mismo hilo (usando Gmail API)
- Si canal_origen = WHATSAPP → enviar por WhatsApp + correo registrado en Integrens
- Si canal_origen = TELEFONO → enviar solo por correo registrado en Integrens

Plantillas de mensaje configurables en `resources/templates/notificaciones/`

**Verificación:** Test unitario `NotificacionServiceTest.java` — mock de GmailService y WhatsAppService, verificar que cada método llama al canal correcto.

---

### TASK-017 — Crear plantillas de notificación
**Archivos:** `backend/src/main/resources/templates/notificaciones/`
**Acción:**
Crear plantillas de texto para cada notificación:
- `confirmacion-recepcion.txt`
- `asignacion-agente.txt`
- `pendiente-cliente.txt`
- `ticket-resuelto.txt`
- `ticket-cerrado.txt`

Cada plantilla usa variables: {codigo_ticket}, {nombre_agente}, {nombre_cliente}

Ejemplo confirmacion-recepcion.txt:
```
Estimado/a {nombre_cliente},

Hemos recibido su solicitud de soporte.
Su número de caso es: {codigo_ticket}

Nuestro equipo lo atenderá a la brevedad.
Para hacer seguimiento, responda a este correo.

Equipo de Soporte Integrens
soporte@integrens.com
```

**Verificación:** Archivos creados. NotificacionService carga plantillas correctamente.

---

### TASK-018 — Crear endpoint de creación manual de ticket (HU-019)
**Archivos:**
- `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
- `backend/src/main/java/com/dacta/helpdesk/model/dto/CrearTicketManualDto.java`

**Acción:**
Implementar endpoint POST /api/tickets/manual (requiere JWT — rol AGENTE o SUPERVISOR):
- Recibe: { correoCliente, nombreCliente, asunto, descripcion, urgencia, idModulo }
- Busca cliente en base de datos Integrens por correo
- Crea ticket con canal_origen = TELEFONO
- Asigna el ticket al agente que lo crea
- Llama a NotificacionService.enviarConfirmacionRecepcion(ticket)
- Retorna el ticket creado con su código

**Verificación:**
```bash
curl -X POST http://localhost:8080/api/tickets/manual \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"correoCliente":"cliente@empresa.com","asunto":"Error en POS","urgencia":"ALTA","idModulo":1}'
# Debe retornar ticket con código TK-XXXXX
```

---

### TASK-019 — Crear endpoint de reapertura automática
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
Agregar método al TicketService:
- `reabrirTicket(Long idTicket, String motivo)` → TicketEntity
  - Cambia estado de RESUELTO o CERRADO a REABIERTO
  - Registra en historial con motivo "Cliente respondió"
  - Notifica al agente que atendió el ticket que fue reabierto

**Verificación:** Test unitario — ticket en estado RESUELTO → llamar reabrirTicket → verificar estado REABIERTO en historial.

---

### TASK-020 — Crear scheduler de cierre automático (RN-010)
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/CierreAutomaticoService.java`
**Acción:**
Implementar scheduler que ejecuta cada hora:
- Buscar tickets en estado RESUELTO con dt_resuelto < NOW() - 48 horas
- Para cada ticket encontrado:
  1. Cambiar estado a CERRADO
  2. Registrar en historial: "Cierre automático — sin respuesta del cliente en 48 horas"
  3. Llamar a NotificacionService.enviarNotificacionCerrado(ticket)

**Verificación:** Test unitario `CierreAutomaticoServiceTest.java` — ticket con dt_resuelto de hace 49 horas → verificar que cambia a CERRADO.

---

### TASK-021 — Crear endpoint GET de tickets (lista)
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
Implementar GET /api/tickets con parámetros opcionales de filtro:
- estado, urgencia, idModulo, idAgente, canal, fechaDesde, fechaHasta, busqueda
- Paginado: page, size (default 20)
- Rol AGENTE: ve solo sus tickets + sin asignar
- Rol SUPERVISOR: ve todos los tickets
- Rol GERENCIA: no tiene acceso a este endpoint (403)
- Retorna lista paginada de TicketResumenDto

**Verificación:** GET /api/tickets retorna lista paginada con código 200.

---

### TASK-022 — Crear endpoint GET de ticket detalle
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
Implementar GET /api/tickets/{id}:
- Retorna TicketDetalleDto con: datos del ticket, clasificación IA, historial completo, comentarios, mensaje original
- Rol AGENTE: solo puede ver tickets asignados a él o sin asignar
- Rol SUPERVISOR: puede ver cualquier ticket

**Verificación:** GET /api/tickets/1 retorna detalle completo del ticket.

---

### TASK-023 — Test de integración Épica 1
**Archivo:** `backend/src/test/java/com/dacta/helpdesk/integracion/Epica1IntegracionTest.java`
**Acción:**
Crear test de integración que simula el flujo completo:
1. Simular llegada de correo nuevo → verificar ticket creado en BD
2. Simular llegada de correo duplicado → verificar vinculación, no ticket nuevo
3. Simular mensaje WhatsApp → verificar ticket creado con canal WHATSAPP
4. Crear ticket manual → verificar notificación enviada
5. Verificar scheduler cierre automático con ticket de 49 horas

**Verificación:** `mvn test -Dtest=Epica1IntegracionTest` — todos los tests pasan en verde.

---

### TASK-024 — Commit Épica 1 backend
**Acción:**
```bash
git add backend/
git add database/
git commit -m "feat(epica1): implementa recepcion automatica de canales y notificaciones"
git push origin develop
```
**Verificación:** Push exitoso al repositorio GitLab DACTA.

---

## ═══════════════════════════════════════
## ÉPICA 2 — MOTOR IA — CLASIFICACIÓN
## HU-005, HU-006, HU-007, HU-008, HT-003
## ═══════════════════════════════════════

### TASK-025 — Configurar Claude API
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/ClaudeApiConfig.java`
**Acción:**
Configurar cliente HTTP para Claude API:
- Agregar dependencia spring-boot-starter-webflux en pom.xml (para WebClient)
- Crear ClaudeApiConfig.java con WebClient apuntando a https://api.anthropic.com
- Configurar en application.properties:
  - claude.api.key=TU_API_KEY
  - claude.api.model=claude-sonnet-4-20250514
  - claude.api.max.tokens=1000

**Verificación:** `mvn clean compile` sin errores. Bean ClaudeApiConfig carga correctamente.

---

### TASK-026 — Crear servicio de clasificación IA
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/ClasificacionIAService.java`
**Acción:**
Implementar ClasificacionIAService con el método principal:
- `clasificarTicket(String asunto, String contenido)` → ClasificacionResultado

El prompt a Claude API debe solicitar respuesta en JSON:
```
Eres un asistente de clasificación de tickets de soporte del ERP Integrens.
Analiza el siguiente ticket y clasifícalo.

Asunto: {asunto}
Contenido: {contenido}

Responde SOLO con JSON válido:
{
  "tipo": "BUG|CONSULTA|CAPACITACION|CONFIGURACION|MEJORA|ACCESO",
  "aplicacion": "INTEGRENS|INTELIFAC|MOBILE",
  "modulo": "CMR-POS|CMR-VEN|LOG-ALM|LOG-COM|FIN-FAC|FIN-CXC|RH|SYS|IFACE|MOB",
  "urgencia": "CRITICA|ALTA|MEDIA|BAJA",
  "confianza": 0.95,
  "razon": "Breve explicación de la clasificación"
}
```

**Verificación:** Test unitario `ClasificacionIAServiceTest.java` — enviar correo de prueba real a Claude API y verificar que retorna JSON válido con todos los campos.

---

### TASK-027 — Integrar clasificación en creación de ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
Modificar crearTicketDesdeCorreo() y crearTicketDesdeWhatsApp() para:
- Llamar a ClasificacionIAService.clasificarTicket() después de crear el ticket
- Actualizar el ticket con: tipo, aplicacion, idModulo, urgencia, n_confianza_ia
- Si confianza < 0.60 → marcar b_revisado_ia = false (requiere revisión manual)
- Si urgencia = CRITICA → notificar inmediatamente al equipo por correo

**Verificación:** Crear ticket de prueba, verificar que tiene clasificación IA en BD.

---

### TASK-028 — Crear endpoint para corregir clasificación IA
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
Implementar PATCH /api/tickets/{id}/clasificacion (rol AGENTE o SUPERVISOR):
- Recibe: { tipo, aplicacion, idModulo, urgencia }
- Actualiza la clasificación del ticket
- Registra en historial: "Clasificación corregida manualmente por {usuario}"
- Marca b_revisado_ia = true

**Verificación:** PATCH con nueva clasificación → verificar cambio en BD e historial.

---

### TASK-029 — Crear endpoint para cambiar estado del ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
Implementar PATCH /api/tickets/{id}/estado (rol AGENTE o SUPERVISOR):
- Recibe: { nuevoEstado, comentario? }
- Validar transición de estado permitida según flujo:
  NUEVO→EN_PROGRESO, EN_PROGRESO→PENDIENTE_CLIENTE, PENDIENTE_CLIENTE→EN_PROGRESO,
  EN_PROGRESO→RESUELTO, RESUELTO→CERRADO
- Si nuevoEstado = EN_PROGRESO y ticket sin asignar → asignar al agente que llama
- Si nuevoEstado = PENDIENTE_CLIENTE → activar pausa de SLA
- Si nuevoEstado = RESUELTO → registrar dt_resuelto = NOW()
- Registrar cambio en hds_ticket_historial
- Llamar a NotificacionService con el cambio correspondiente

**Verificación:** Cambiar ticket de NUEVO a EN_PROGRESO → verificar historial y notificación.

---

### TASK-030 — Crear endpoint para asignar/reasignar ticket
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
Implementar PATCH /api/tickets/{id}/asignar (rol SUPERVISOR):
- Recibe: { idAgente }
- Verifica que el agente existe y está activo
- Actualiza id_agente_asignado y dt_asignado en el ticket
- Registra en historial: "Ticket asignado a {nombre_agente} por {supervisor}"
- Llama a NotificacionService.enviarNotificacionAsignacion(ticket)

**Verificación:** Asignar ticket a Diego → verificar asignación e historial.

---

### TASK-031 — Crear endpoint para agregar comentario
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/TicketController.java`
**Acción:**
Implementar POST /api/tickets/{id}/comentarios:
- Recibe: { contenido, esInterno: true/false }
- Si esInterno = false → también enviar por correo al cliente (respuesta al hilo)
- Si esInterno = true → guardar solo en BD, no notificar al cliente
- Registrar en hds_ticket_comentario

**Verificación:** Agregar comentario público → verificar que se guarda y llama a NotificacionService.

---

### TASK-032 — Test de integración Épica 2
**Archivo:** `backend/src/test/java/com/dacta/helpdesk/integracion/Epica2IntegracionTest.java`
**Acción:**
Tests de integración:
1. Crear ticket → verificar clasificación IA asignada con todos los campos
2. Ticket con urgencia CRITICA → verificar notificación inmediata al equipo
3. Ticket con confianza < 60% → verificar b_revisado_ia = false
4. Corregir clasificación → verificar historial con nombre del agente
5. Cambiar estados → verificar transiciones válidas e inválidas

**Verificación:** `mvn test -Dtest=Epica2IntegracionTest` — todos los tests en verde.

---

### TASK-033 — Commit Épica 2 backend
**Acción:**
```bash
git add backend/
git commit -m "feat(epica2): implementa clasificacion automatica con Claude API"
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
Crear proyecto React 18 con Vite:
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install tailwindcss @tailwindcss/forms axios react-router-dom
npm install react-query date-fns recharts
npx tailwindcss init
```

Configurar tailwind.config.js con colores DACTA:
```javascript
colors: {
  'dacta-primary': '#2E4AF6',
  'dacta-secondary': '#6FA3B2',
  'dacta-dark': '#003366',
}
```

Configurar .env:
```
VITE_API_URL=http://localhost:8080/api
```

**Verificación:** `npm run dev` — app React carga en localhost:3000.

---

### TASK-035 — Crear estructura de carpetas frontend
**Archivo:** `frontend/src/`
**Acción:**
Crear estructura siguiendo M-O-DES-001 adaptado a React:
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
Implementar authService con:
- `login(correo, contrasena)` → token JWT
- `logout()` → limpiar token
- `getUsuarioActual()` → datos del usuario del token
- `getRol()` → rol del usuario
- Interceptor Axios: agregar Authorization header en cada request
- Interceptor Axios: si response 401 → redirigir a login

**Verificación:** Llamada a login con credenciales válidas → retorna token y redirige al panel.

---

### TASK-037 — Crear página de Login
**Archivo:** `frontend/src/pages/LoginPage.jsx`
**Acción:**
Crear pantalla de login con:
- Logo/nombre DACTA Help Desk IA
- Campo correo corporativo
- Campo contraseña
- Botón "Ingresar" en color #2E4AF6
- Manejo de error: credenciales incorrectas, cuenta bloqueada
- Fondo blanco, sidebar en #003366
- Responsive: centrado en desktop, full screen en móvil

**Verificación:** Login con credenciales correctas → redirige al panel. Login incorrecto → muestra error.

---

### TASK-038 — Crear layout principal con sidebar
**Archivo:** `frontend/src/components/common/Layout.jsx`
**Acción:**
Crear layout con:
- Sidebar izquierdo fijo color #003366 con:
  - Logo DACTA Help Desk IA
  - Menú: Mis Tickets, Todos los Tickets (solo Supervisor), Dashboard (solo Gerencia), Admin (solo Supervisor)
  - Nombre y rol del usuario en la parte inferior
  - Botón cerrar sesión
- Área de contenido principal a la derecha
- Header con: título de sección, nombre del usuario, indicador "IA activa"
- Responsive: sidebar se colapsa en móvil

**Verificación:** Layout carga con sidebar #003366 y área de contenido. Responsive funciona en móvil.

---

### TASK-039 — Crear servicio de tickets frontend
**Archivo:** `frontend/src/services/ticketService.js`
**Acción:**
Implementar ticketService con:
- `obtenerTickets(filtros, pagina)` → lista paginada
- `obtenerTicketDetalle(id)` → detalle completo
- `cambiarEstado(id, nuevoEstado, comentario)` → ticket actualizado
- `asignarTicket(id, idAgente)` → ticket actualizado
- `agregarComentario(id, contenido, esInterno)` → comentario
- `corregirClasificacion(id, clasificacion)` → ticket actualizado
- `crearTicketManual(datos)` → ticket creado

**Verificación:** Llamada a obtenerTickets() retorna lista de tickets del backend.

---

### TASK-040 — Crear componente TicketCard
**Archivo:** `frontend/src/components/tickets/TicketCard.jsx`
**Acción:**
Crear componente para cada fila del panel de tickets:
- Mostrar: código, cliente, asunto (truncado), módulo, estado, urgencia (color), responsable, fecha
- Colores de urgencia: Crítica=#EF4444, Alta=#F97316, Media=#EAB308, Baja=#22C55E
- Badge "IA" indicando clasificación automática
- Click en la fila → navega al detalle
- Hover effect sutil
- Responsive: en móvil muestra solo campos clave

**Verificación:** Componente renderiza correctamente con datos de prueba.

---

### TASK-041 — Crear página Panel de Tickets (HU-009)
**Archivo:** `frontend/src/pages/PanelTicketsPage.jsx`
**Acción:**
Crear panel principal de tickets:
- Header con: total de tickets, tickets críticos, mis tickets asignados
- Barra de filtros: estado, urgencia, módulo, agente, canal, fechas, búsqueda
- Lista de tickets usando TicketCard
- Paginación
- Botón "Crear ticket manual" (solo Agente y Supervisor)
- Actualización en tiempo real cada 30 segundos (polling)
- Indicador de carga mientras obtiene datos
- Estado vacío: "No hay tickets que coincidan con los filtros"

**Verificación:** Panel carga lista de tickets. Filtros funcionan. Paginación funciona.

---

### TASK-042 — Crear página Detalle de Ticket (HU-012)
**Archivo:** `frontend/src/pages/TicketDetallePage.jsx`
**Acción:**
Crear vista de detalle del ticket con secciones:
- Cabecera: código, estado (badge color), urgencia, canal de origen
- Datos del cliente: nombre, correo, teléfono
- Mensaje original completo (correo o WhatsApp)
- Clasificación IA: tipo, aplicación, módulo, confianza (barra de progreso)
- Botones de acción: Tomar ticket, Cambiar estado, Reasignar (solo Supervisor)
- Historial de cambios de estado (timeline vertical)
- Sección de comentarios: internos y públicos separados
- Formulario para agregar comentario o responder al cliente
- Botón "Corregir clasificación IA"

**Verificación:** Detalle muestra todos los campos. Cambio de estado funciona. Agregar comentario funciona.

---

### TASK-043 — Crear modal de creación de ticket manual (HU-019)
**Archivo:** `frontend/src/components/tickets/CrearTicketManualModal.jsx`
**Acción:**
Crear modal con formulario:
- Campo búsqueda de cliente (busca por correo en base Integrens)
- Asunto (obligatorio)
- Descripción del problema
- Urgencia (select: Crítica, Alta, Media, Baja)
- Módulo (select dinámico desde API)
- Botón Crear → llama a ticketService.crearTicketManual()
- Mensaje de confirmación con código del ticket generado

**Verificación:** Modal abre, formulario válida campos, crea ticket y muestra código.

---

### TASK-044 — Crear componente de filtros avanzados (HU-013)
**Archivo:** `frontend/src/components/tickets/FiltrosTickets.jsx`
**Acción:**
Crear barra de filtros con:
- Select: Estado (todos los estados)
- Select: Urgencia (Crítica, Alta, Media, Baja)
- Select: Módulo (dinámico desde API)
- Select: Agente (Carlos, Antonny, Diego — solo Supervisor)
- Select: Canal (Correo, WhatsApp, Teléfono)
- DatePicker: Fecha desde / Fecha hasta
- Input búsqueda: texto libre
- Botón "Limpiar filtros"
- Aplicar filtros en tiempo real (debounce 500ms)

**Verificación:** Filtros se aplican correctamente. Combinación de filtros funciona.

---

### TASK-045 — Crear panel de carga de agentes (para Supervisor)
**Archivo:** `frontend/src/components/tickets/CargaAgentesPanel.jsx`
**Acción:**
Crear panel visible solo para Supervisor que muestra:
- Tarjeta por cada agente: Carlos, Antonny, Diego
- Número de tickets activos por agente
- Distribución por urgencia (mini gráfico de barras)
- Botón rápido de reasignar desde aquí

**Verificación:** Panel muestra carga real de los 3 agentes.

---

### TASK-046 — Test de componentes React Épica 3
**Archivo:** `frontend/src/__tests__/`
**Acción:**
Crear tests con React Testing Library:
- `PanelTicketsPage.test.jsx` — renderiza lista, filtros funcionan
- `TicketDetallePage.test.jsx` — muestra todos los campos del ticket
- `CrearTicketManualModal.test.jsx` — validación de formulario

**Verificación:** `npm test` — todos los tests en verde.

---

### TASK-047 — Commit Épica 3 frontend
**Acción:**
```bash
git add frontend/
git commit -m "feat(epica3): implementa panel de agentes y gestion de tickets"
git push origin develop
```

---

## ═══════════════════════════════════════
## ÉPICA 4 — DASHBOARD GERENCIAL
## HU-014, HU-015
## ═══════════════════════════════════════

### TASK-048 — Crear endpoints de métricas backend
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/MetricasController.java`
**Acción:**
Implementar GET /api/metricas (rol SUPERVISOR o GERENCIA):
Parámetros: fechaDesde, fechaHasta
Retorna:
```json
{
  "totalTickets": 0,
  "porEstado": { "NUEVO": 0, "EN_PROGRESO": 0, ... },
  "porUrgencia": { "CRITICA": 0, "ALTA": 0, ... },
  "porModulo": [{ "modulo": "FIN-FAC", "total": 0 }],
  "porAgente": [{ "nombre": "Carlos", "total": 0, "activos": 0 }],
  "porCanal": { "CORREO": 0, "WHATSAPP": 0, "TELEFONO": 0 },
  "tiempoPromedioResolucionHoras": 0,
  "comparativaPeriodoAnterior": { "variacion": 0 }
}
```

**Verificación:** GET /api/metricas retorna JSON con todos los campos correctamente calculados.

---

### TASK-049 — Crear página Dashboard Gerencial (HU-014 y HU-015)
**Archivo:** `frontend/src/pages/DashboardPage.jsx`
**Acción:**
Crear dashboard con:
- Tarjetas resumen: Total tickets, Tickets críticos, Tiempo promedio resolución, Tickets resueltos hoy
- Gráfico de barras: tickets por módulo (usando Recharts, color #2E4AF6)
- Gráfico de torta: distribución por urgencia (colores de urgencia)
- Gráfico de líneas: evolución de tickets por día/semana
- Tabla: carga por agente con barras de progreso
- Selector de período: Hoy, Semana, Mes, Trimestre, Personalizado
- Actualización automática cada 60 segundos
- Todo en solo lectura — sin botones de acción

**Verificación:** Dashboard carga métricas reales. Filtro de período actualiza todos los gráficos.

---

### TASK-050 — Commit Épica 4
**Acción:**
```bash
git add backend/ frontend/
git commit -m "feat(epica4): implementa dashboard gerencial con metricas en tiempo real"
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
Implementar endpoints (solo rol SUPERVISOR):
- GET /api/admin/usuarios — lista todos los usuarios
- POST /api/admin/usuarios — crear nuevo usuario
- PATCH /api/admin/usuarios/{id} — editar usuario
- PATCH /api/admin/usuarios/{id}/desactivar — desactivar usuario
- PATCH /api/admin/usuarios/{id}/desbloquear — desbloquear cuenta bloqueada

**Verificación:** CRUD completo de usuarios funciona. Desactivar usuario revoca acceso inmediatamente.

---

### TASK-052 — Crear endpoints de administración de módulos
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/controller/AdminController.java`
**Acción:**
Implementar endpoints (solo rol SUPERVISOR):
- GET /api/admin/modulos — lista todos los módulos
- POST /api/admin/modulos — crear nuevo módulo
- PATCH /api/admin/modulos/{id} — editar módulo
- PATCH /api/admin/modulos/{id}/desactivar — desactivar módulo

**Verificación:** CRUD de módulos funciona. Módulo desactivado no aparece en clasificación IA.

---

### TASK-053 — Crear página de Administración frontend
**Archivo:** `frontend/src/pages/AdminPage.jsx`
**Acción:**
Crear página con 2 tabs:
- Tab Usuarios: tabla de usuarios con acciones editar/desactivar/desbloquear + botón crear usuario
- Tab Módulos: tabla de módulos con acciones editar/desactivar + botón crear módulo
- Solo visible para rol SUPERVISOR
- Formularios en modales con validación

**Verificación:** CRUD de usuarios y módulos funciona desde la interfaz.

---

### TASK-054 — Implementar guards de ruta por rol
**Archivo:** `frontend/src/components/common/ProtectedRoute.jsx`
**Acción:**
Crear componente ProtectedRoute que:
- Si no hay token → redirige a /login
- Si token expirado → redirige a /login
- Si rol no tiene acceso a la ruta → muestra 403
- Rutas por rol:
  - AGENTE: /tickets, /tickets/:id
  - SUPERVISOR: todo lo anterior + /admin, /dashboard
  - GERENCIA: solo /dashboard

**Verificación:** Acceder a /admin como Agente → muestra error 403. Token expirado → redirige a login.

---

### TASK-055 — Test de seguridad y roles
**Archivo:** `backend/src/test/java/com/dacta/helpdesk/security/SeguridadTest.java`
**Acción:**
Tests de seguridad:
1. Request sin token → 401
2. Request con token expirado → 401
3. Agente accede a /api/admin → 403
4. Gerencia accede a /api/tickets → 403
5. 5 intentos fallidos → cuenta bloqueada
6. Usuario desactivado intenta login → 403

**Verificación:** `mvn test -Dtest=SeguridadTest` — todos los tests en verde.

---

### TASK-056 — Commit Épica 5
**Acción:**
```bash
git add backend/ frontend/
git commit -m "feat(epica5): implementa seguridad JWT, roles y administracion"
git push origin develop
```

---

## ═══════════════════════════════════════
## CIERRE — LOGS, CI/CD Y VALIDACIÓN FINAL
## HT-008, HT-009
## ═══════════════════════════════════════

### TASK-057 — Implementar sistema de logs y auditoría (HT-008)
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/AuditoriaConfig.java`
**Acción:**
Implementar log de auditoría con:
- Interceptor que registra cada request: usuario, endpoint, método, timestamp, IP
- Log de cada cambio de estado de ticket con usuario responsable
- Log de cada clasificación IA con confianza y resultado
- Configurar logback para guardar logs en archivo rotativo diario
- Formato: `[FECHA] [USUARIO] [ACCION] [ENTIDAD] [DETALLE]`

**Verificación:** Cambiar estado de ticket → verificar registro en log de auditoría.

---

### TASK-058 — Configurar pipeline CI/CD GitLab (HT-009)
**Archivo:** `.gitlab-ci.yml`
**Acción:**
Crear pipeline con 3 etapas:
```yaml
stages:
  - build
  - test
  - deploy

build-backend:
  stage: build
  script:
    - cd backend && mvn clean package -DskipTests

test-backend:
  stage: test
  script:
    - cd backend && mvn test

build-frontend:
  stage: build
  script:
    - cd frontend && npm install && npm run build

deploy-dev:
  stage: deploy
  script:
    - echo "Deploy al servidor DACTA"
  only:
    - develop
```

**Verificación:** Push a develop → pipeline ejecuta y pasa todas las etapas.

---

### TASK-059 — Pruebas de aceptación finales
**Archivo:** `docs/qa/PRUEBAS-ACEPTACION-MVP.md`
**Acción:**
Ejecutar y documentar manualmente los criterios QA del SPEC-001:
- Correo nuevo → ticket creado en < 5 minutos ✓/✗
- Correo duplicado → vinculado, no nuevo ticket ✓/✗
- Mensaje WhatsApp → ticket con canal WHATSAPP ✓/✗
- Ticket manual por teléfono → notificación por correo ✓/✗
- Dos agentes intentan tomar mismo ticket → solo uno lo obtiene ✓/✗
- SLA pausa en Pendiente Cliente ✓/✗
- Cierre automático 48h ✓/✗
- Dashboard gerencia — solo lectura ✓/✗
- Cuenta bloqueada tras 5 intentos ✓/✗
- Interfaz responsiva en móvil ✓/✗

Registrar resultado de cada prueba con evidencia (capturas).

**Verificación:** Todos los criterios marcados como ✓. Documento guardado en docs/qa/.

---

### TASK-060 — Commit final MVP v1.0
**Acción:**
```bash
git add .
git commit -m "release: DACTA Help Desk IA v1.0 MVP — listo para demo"
git tag v1.0.0
git push origin develop
git push origin --tags
```
**Verificación:** Tag v1.0.0 visible en GitLab. Pipeline pasa en verde.

---

## RESUMEN TOTAL DE TAREAS

| Bloque | Tareas | Descripción |
|---|---|---|
| Épica 0 — Cimientos | TASK-001 a TASK-008 | 8 tareas |
| Épica 1 — Canales | TASK-009 a TASK-024 | 16 tareas |
| Épica 2 — Motor IA | TASK-025 a TASK-033 | 9 tareas |
| Épica 3 — Gestión | TASK-034 a TASK-047 | 14 tareas |
| Épica 4 — Dashboard | TASK-048 a TASK-050 | 3 tareas |
| Épica 5 — Seguridad | TASK-051 a TASK-056 | 6 tareas |
| Cierre | TASK-057 a TASK-060 | 4 tareas |
| **TOTAL** | **60 tareas** | |

---

## REGLAS PARA CLAUDE CODE — RECORDATORIO FINAL

1. LEER SPEC-001 antes de cada tarea.
2. EJECUTAR solo la tarea indicada — ni una línea más.
3. VERIFICAR con el comando indicado antes de reportar.
4. REPORTAR al Orquestador Camilo Ortega FR y ESPERAR aprobación.
5. NUNCA avanzar sin aprobación explícita.
6. RESPETAR colores DACTA: #2E4AF6 / #6FA3B2 / #003366.
7. SEGUIR estándares: M-O-DES-001, M-O-DES-002, M-O-DES-003.

---
*DACTA S.A.C. — Documento controlado*
*TASK-LIST-001 v1.0 — 2026-05-31*
*Orquestador: Camilo Ortega FR — QE / SDD*
