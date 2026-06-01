# TASKS — ÉPICA 0: CIMIENTOS
# DACTA Help Desk IA v1.0
# Tareas: TASK-001 a TASK-008
# Orquestador: Camilo Ortega FR
# Referencia: SPEC-001 v1.1 + docs/specs/archive/TASK-LIST-001-v1.1-COMPLETO.md

---

## INSTRUCCIÓN PARA CLAUDE CODE

Lee PROGRESS.md primero para ver el estado actual.
Ejecuta SOLO la tarea indicada. Confirma antes de proceder.
Verifica con el comando indicado. Espera aprobación del Orquestador.

---

### TASK-001 — Configurar proyecto Spring Boot base
**Archivo:** `backend/pom.xml` + `backend/src/main/resources/application.properties`
**Acción:**
- Spring Boot 3.x compatible con Java 25
- Dependencias: web, data-jpa, security, mail, webflux, postgresql,
  jjwt-api/impl/jackson 0.11.5, lombok, validation, actuator
- application.properties:
  server.port=8080
  spring.datasource.url=jdbc:postgresql://localhost:5432/dacta_helpdesk
  spring.datasource.username=dacta_user
  spring.datasource.password=dacta_pass
  spring.jpa.hibernate.ddl-auto=validate
  spring.jpa.show-sql=false
- HelpDeskApplication.java con cabecera CONVENTIONS.md
**Verificación:** `mvn clean compile` sin errores.

---

### TASK-002 — Crear estructura de paquetes Java
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/`
**Acción:**
Crear paquetes siguiendo M-O-DES-001:
- config/ — configuraciones Spring
- controller/ — endpoints REST
- service/ — lógica de negocio
- repository/ — acceso a datos
- model/entity/ — entidades JPA
- model/dto/ — objetos de transferencia
- security/ — JWT y filtros
- exception/ — manejo de errores
- util/ — utilidades
**Verificación:** `mvn clean compile` sin errores.

---

### TASK-003 — Crear script BD — tablas principales
**Archivo:** `database/scripts/V001__crear_tablas_principales.sql`
**Acción:**
Crear tablas siguiendo M-O-DES-002:
- hds_usuario (id, correo, nombre, apellido, contrasena, rol,
  intentos_fallidos, bloqueado, activo, fechas)
- hds_modulo (id, codigo, nombre, aplicacion, activo, fecha)
- hds_ticket (id, codigo, asunto, descripcion, canal_origen,
  estado, urgencia, tipo, aplicacion, id_modulo, id_agente,
  correo_cliente, nombre_cliente, confianza_ia, revisado_ia,
  duplicado, id_ticket_padre, campos ERP DEC-002,
  dt_creado, dt_asignado, dt_primer_respuesta, dt_resuelto,
  dt_cerrado, minutos_pausado, dt_actualizado)
- hds_ticket_historial (id, id_ticket, estado_anterior,
  estado_nuevo, id_usuario, comentario, dt_cambio)
- hds_ticket_comentario (id, id_ticket, id_usuario,
  contenido, interno, dt_creado)
- hds_mensaje_origen (id, id_ticket, canal, remitente,
  asunto, cuerpo, message_id, procesado, fechas)
- hds_notificacion (id, id_ticket, canal, destinatario,
  asunto, cuerpo, estado_ticket, enviado, fechas)
**Verificación:** Script ejecuta sin errores en PostgreSQL.
SELECT COUNT(*) de cada tabla = 0 (vacías pero creadas).

---

### TASK-004 — Insertar datos iniciales (seed)
**Archivo:** `database/scripts/V002__datos_iniciales.sql`
**Acción:**
Insertar usuarios del equipo DACTA:
- camilo.ortega@dacta.com.pe → SUPERVISOR
- carlos.agente@dacta.com.pe → AGENTE
- antonny.agente@dacta.com.pe → AGENTE
- diego.agente@dacta.com.pe → AGENTE
- sebastian.rafaile@dacta.com.pe → GERENCIA

Insertar módulos Integrens:
CMR-POS, CMR-VEN, LOG-ALM, LOG-COM, FIN-FAC,
FIN-CXC, RH, SYS (Integrens) + IFACE (Intelifac) + MOB (Mobile)
**Verificación:**
SELECT COUNT(*) FROM hds_usuario = 5
SELECT COUNT(*) FROM hds_modulo = 10

---

### TASK-005 — Crear entidades JPA
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/model/entity/`
**Acción:**
Crear con @Entity, @Table, @Id, @GeneratedValue, Lombok
@Data @Builder @NoArgsConstructor @AllArgsConstructor:
- UsuarioEntity.java → hds_usuario
- ModuloEntity.java → hds_modulo
- TicketEntity.java → hds_ticket (todos los campos incluyendo DEC-002)
- TicketHistorialEntity.java → hds_ticket_historial
- TicketComentarioEntity.java → hds_ticket_comentario
- MensajeOrigenEntity.java → hds_mensaje_origen
- NotificacionEntity.java → hds_notificacion
**Verificación:** `mvn clean compile` sin errores.

---

### TASK-006 — Crear repositorios JPA
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/repository/`
**Acción:**
Interfaces JpaRepository con métodos custom:
- UsuarioRepository: findByCorreo, findByCorreoAndActivoTrue
- ModuloRepository: findByActivoTrue, findByCodigoAndActivoTrue
- TicketRepository: findByCodigo, findByEstado,
  findByAgenteAsignado, findByEstadoAndDtResueltoLessThan
- TicketHistorialRepository: findByTicketOrderByFechaCambioDesc
- TicketComentarioRepository: findByTicketOrderByDtCreado
- MensajeOrigenRepository: findByMessageIdAndProcesadoFalse,
  existsByMessageId
- NotificacionRepository: findByTicketAndEnviadoFalse
**Verificación:** `mvn clean compile` sin errores.

---

### TASK-007 — Configurar seguridad JWT
**Archivos:** `backend/src/main/java/com/dacta/helpdesk/security/`
**Acción:**
- JwtUtil.java — generar y validar tokens. Expiración: 8 horas.
- JwtAuthFilter.java — intercepta requests y valida token.
- SecurityConfig.java:
  Rutas públicas: POST /api/auth/login,
                  GET+POST /api/webhook/whatsapp
  Todo lo demás requiere token válido.
  Stateless session. CORS: localhost:3000.
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
- Recibe: { correo, contrasena }
- Verifica b_activo=true y b_bloqueado=false
- Incrementa n_intentos_fallidos en cada fallo
- Si >= 5 intentos → b_bloqueado=true
- Si correcto → reset intentos, retorna token JWT + rol + nombre
- Errores: 401 credenciales, 403 bloqueado, 403 inactivo
**Verificación:**
curl -X POST http://localhost:8080/api/auth/login
  -H "Content-Type: application/json"
  -d '{"correo":"camilo.ortega@dacta.com.pe","contrasena":"dacta2026"}'
Debe retornar token JWT con status 200.

---
*ÉPICA 0 completa → siguiente: TASKS-EPICA-1-canales.md*
*DACTA S.A.C. — Camilo Ortega FR — 2026-05-31*
