# TASKS — ÉPICA 1: RECEPCIÓN AUTOMÁTICA DE CANALES
# DACTA Help Desk IA v1.0
# Tareas: TASK-009 a TASK-024
# Orquestador: Camilo Ortega FR
# Referencia: SPEC-001 v1.1 HU-001, HU-002, HU-003, HU-004, HU-018, HU-019

---

## INSTRUCCIÓN PARA CLAUDE CODE

Lee PROGRESS.md primero. Ejecuta SOLO la tarea indicada.
Confirma antes de proceder. Verifica. Espera aprobación.

---

### TASK-009 — Configurar Gmail API
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/config/GmailConfig.java`
**Acción:**
- Agregar dependencia google-api-services-gmail en pom.xml
- GmailConfig.java con cliente autenticado via Service Account
- application.properties:
  gmail.account=soporte@integrens.com
  gmail.credentials.path=classpath:gmail-credentials.json
  gmail.polling.interval=300000
**Verificación:** `mvn clean compile` sin errores. Bean carga correctamente.

---

### TASK-010 — Crear GmailService
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/GmailService.java`
**Acción:**
Métodos:
- leerCorreosNuevos() — correos no procesados
- marcarComoProcesado(String messageId)
- obtenerCuerpoCorreo(Message message)
- esRespuestaAHiloExistente(Message message) — header In-Reply-To
Anti-duplicados: verificar messageId en hds_mensaje_origen antes de procesar.
**Verificación:** Test unitario GmailServiceTest.java con mock Gmail client.

---

### TASK-011 — Crear WhatsAppService
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/WhatsAppService.java`
**Acción:**
- recibirMensaje(WebhookPayload payload)
- enviarMensaje(String telefono, String mensaje)
- validarWebhook(String token)
- application.properties: whatsapp.phone.number.id, access.token, verify.token
- Endpoints públicos:
  POST /api/webhook/whatsapp — recibe mensajes Meta
  GET /api/webhook/whatsapp — verificación Meta
**Verificación:** `mvn clean compile`. Endpoints accesibles sin JWT.

---

### TASK-012 — Crear TicketCodeGenerator
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/util/TicketCodeGenerator.java`
**Acción:**
- Formato: TK-00001 hasta TK-99999
- Consulta último código en hds_ticket y genera el siguiente
- Método synchronized para evitar duplicados en concurrencia
**Verificación:** Test unitario — genera códigos únicos y secuenciales.

---

### TASK-013 — Crear TicketService — creación de tickets
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/TicketService.java`
**Acción:**
- crearTicketDesdeCorreo(MensajeOrigenEntity) → TicketEntity
- crearTicketDesdeWhatsApp(WhatsAppMensaje) → TicketEntity
Ambos métodos:
  1. Generar código con TicketCodeGenerator
  2. Estado inicial: NUEVO, registrar dt_creado
  3. Guardar mensaje en hds_mensaje_origen con b_procesado=true
  4. Registrar historial: NUEVO
  5. Llamar NotificacionService.enviarConfirmacionRecepcion()
**Verificación:** Test unitario — crear ticket mock, verificar código y estado NUEVO.

---

### TASK-014 — Crear DuplicadoService
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/DuplicadoService.java`
**Acción:**
- detectarDuplicado(asunto, remitente, contenido) → Optional<TicketEntity>
- Buscar tickets abiertos del mismo remitente en últimas 72h
- Calcular similitud Jaccard entre asuntos y contenidos
- Si similitud >= 0.80 → retornar ticket existente
- Si mismo thread (In-Reply-To) → vincular directo sin preguntar
**Verificación:** Test — correo idéntico detecta, correo diferente no detecta.

---

### TASK-015 — Crear EmailPollingService (scheduler)
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/EmailPollingService.java`
**Acción:**
@Scheduled cada 5 minutos:
1. GmailService.leerCorreosNuevos()
2. Para cada correo:
   - Si duplicado → vincular como comentario
   - Si respuesta a Resuelto/Cerrado → reabrirTicket()
   - Si nuevo → crearTicketDesdeCorreo()
3. Log de cada ejecución
**Verificación:** App iniciada → esperar 5 min → verificar log de ejecución.

---

### TASK-016 — Crear NotificacionService
**Archivo:** `backend/src/main/java/com/dacta/helpdesk/service/NotificacionService.java`
**Acción:**
5 métodos de notificación:
- enviarConfirmacionRecepcion(ticket) → al crear ticket
- enviarNotificacionAsignacion(ticket) → al asignar agente
- enviarNotificacionPendienteCliente(ticket) → al pedir info
- enviarNotificacionResuelto(ticket) → al resolver
- enviarNotificacionCerrado(ticket) → al cerrar

Lógica de canal (política oficial DACTA):
- CORREO → responder mismo hilo vía Gmail API
- WHATSAPP → WhatsApp + correo Integrens
- TELEFONO/INTEGRENS_ERP → solo correo Integrens

Registrar cada notificación en hds_notificacion.
**Verificación:** Test unitario — mock GmailService y WhatsAppService,
verificar canal correcto por origen.

---

### TASK-017 — Crear plantillas de notificación
**Archivos:** `backend/src/main/resources/templates/notificaciones/`
**Acción:**
5 plantillas .txt con variables {codigo_ticket}, {nombre_agente}, {nombre_cliente}:
- confirmacion-recepcion.txt
- asignacion-agente.txt
- pendiente-cliente.txt
- ticket-resuelto.txt
- ticket-cerrado.txt
**Verificación:** NotificacionService carga plantillas al iniciar sin errores.

---

### TASK-018 — Endpoint creación manual ticket (HU-019 + DEC-002)
**Archivos:**
- controller/TicketController.java
- model/dto/CrearTicketManualDto.java
**Acción:**
POST /api/tickets/manual (JWT — AGENTE o SUPERVISOR):
Campos obligatorios: correoCliente, nombreCliente, asunto,
  descripcion, urgencia, idModulo
Campos opcionales DEC-002: origenSistema, moduloErp,
  versionErp, usuarioErp, empresaCliente, accionRealizada,
  urlPantalla, screenshotBase64
Lógica:
- Si origenSistema=INTEGRENS_ERP → canal=INTEGRENS_ERP
- Si no → canal=TELEFONO
- Asignar al agente que crea. Enviar confirmación al cliente.
**Verificación:** curl POST retorna ticket con código TK-XXXXX.

---

### TASK-019 — Servicio de reapertura automática
**Archivo:** `backend/.../service/TicketService.java`
**Acción:**
Agregar método:
- reabrirTicket(Long idTicket, String motivo) → TicketEntity
  Estado RESUELTO o CERRADO → REABIERTO
  Registrar historial. Notificar al agente original.
**Verificación:** Test — ticket RESUELTO → reabrirTicket → estado REABIERTO.

---

### TASK-020 — CierreAutomaticoService (scheduler 48h)
**Archivo:** `backend/.../service/CierreAutomaticoService.java`
**Acción:**
@Scheduled cada hora:
- Buscar tickets RESUELTO con dt_resuelto < NOW() - 48h
- Para cada uno:
  1. Estado → CERRADO, registrar dt_cerrado
  2. Historial: "Cierre automático — 48h sin respuesta"
  3. NotificacionService.enviarNotificacionCerrado()
**Verificación:** Test — ticket 49h en RESUELTO → estado CERRADO.

---

### TASK-021 — Endpoint GET /api/tickets (lista paginada)
**Archivo:** `backend/.../controller/TicketController.java`
**Acción:**
GET /api/tickets con filtros opcionales:
estado, urgencia, idModulo, idAgente, canal,
fechaDesde, fechaHasta, busqueda, page, size (default 20)
Control de acceso:
- AGENTE: solo sus tickets + sin asignar
- SUPERVISOR: todos los tickets
- GERENCIA: 403
**Verificación:** GET /api/tickets retorna lista paginada con 200.

---

### TASK-022 — Endpoint GET /api/tickets/{id} (detalle)
**Archivo:** `backend/.../controller/TicketController.java`
**Acción:**
GET /api/tickets/{id} → TicketDetalleDto con:
datos del ticket, clasificación IA, historial completo,
comentarios, mensaje original, contexto ERP si aplica.
Control de acceso:
- AGENTE: solo sus tickets o sin asignar
- SUPERVISOR: cualquier ticket
**Verificación:** GET /api/tickets/1 retorna detalle completo.

---

### TASK-023 — Test de integración Épica 1
**Archivo:** `backend/.../integracion/Epica1IntegracionTest.java`
**Acción:**
Tests:
1. Correo nuevo → ticket estado NUEVO
2. Correo duplicado → vinculado, no nuevo ticket
3. WhatsApp → ticket canal WHATSAPP
4. Ticket manual → notificación por correo
5. Ticket vía ERP → contexto ERP guardado
6. Ticket 49h RESUELTO → estado CERRADO automático
**Verificación:** `mvn test -Dtest=Epica1IntegracionTest` — todos en verde.

---

### TASK-024 — Commit Épica 1
**Acción:**
```
git add backend/ database/
git commit -m "feat(epica1): recepcion canales, tickets automaticos, notificaciones"
git push origin develop
```
**Verificación:** Push exitoso al repositorio GitLab DACTA.

---
*ÉPICA 1 completa → siguiente: TASKS-EPICA-2-motor-ia.md*
*DACTA S.A.C. — Camilo Ortega FR — 2026-05-31*
