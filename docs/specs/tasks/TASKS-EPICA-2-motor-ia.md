# TASKS — ÉPICA 2: MOTOR IA — CLASIFICACIÓN
# DACTA Help Desk IA v1.0
# Tareas: TASK-025 a TASK-033
# Orquestador: Camilo Ortega FR
# Referencia: SPEC-001 v1.1 HU-005 a HU-008, HT-003

---

### TASK-025 — Configurar Claude API
**Archivo:** `backend/.../config/ClaudeApiConfig.java`
**Acción:**
- WebClient apuntando a https://api.anthropic.com
- application.properties:
  claude.api.key=TU_API_KEY
  claude.api.model=claude-sonnet-4-20250514
  claude.api.max.tokens=1000
**Verificación:** `mvn clean compile`. Bean ClaudeApiConfig carga.

---

### TASK-026 — Crear ClasificacionIAService
**Archivo:** `backend/.../service/ClasificacionIAService.java`
**Acción:**
clasificarTicket(String asunto, String contenido) → ClasificacionResultado
Prompt a Claude API — respuesta JSON:
{
  "tipo": "BUG|CONSULTA|CAPACITACION|CONFIGURACION|MEJORA|ACCESO",
  "aplicacion": "INTEGRENS|INTELIFAC|MOBILE",
  "modulo": "CMR-POS|CMR-VEN|LOG-ALM|LOG-COM|FIN-FAC|FIN-CXC|RH|SYS|IFACE|MOB",
  "urgencia": "CRITICA|ALTA|MEDIA|BAJA",
  "confianza": 0.95,
  "razon": "Explicación breve"
}
**Verificación:** Test — correo de prueba a Claude API retorna JSON válido.

---

### TASK-027 — Integrar clasificación en creación de ticket
**Archivo:** `backend/.../service/TicketService.java`
**Acción:**
Modificar crearTicketDesdeCorreo() y crearTicketDesdeWhatsApp():
- Llamar ClasificacionIAService.clasificarTicket()
- Actualizar ticket: tipo, aplicacion, idModulo, urgencia, confianza_ia
- Si confianza < 0.60 → b_revisado_ia = false
- Si urgencia = CRITICA → notificar equipo inmediatamente
**Verificación:** Crear ticket de prueba → verificar clasificación en BD.

---

### TASK-028 — Endpoint PATCH clasificación IA
**Archivo:** `backend/.../controller/TicketController.java`
**Acción:**
PATCH /api/tickets/{id}/clasificacion (AGENTE o SUPERVISOR):
- Recibe: { tipo, aplicacion, idModulo, urgencia }
- Actualiza clasificación
- Historial: "Clasificación corregida por {usuario}"
- Marca b_revisado_ia = true
**Verificación:** PATCH clasificación → cambio en BD e historial.

---

### TASK-029 — Endpoint PATCH estado del ticket + SLA
**Archivo:** `backend/.../controller/TicketController.java`
**Acción:**
PATCH /api/tickets/{id}/estado (AGENTE o SUPERVISOR):
- Recibe: { nuevoEstado, comentario? }
- Validar transición según flujo SPEC-001
- Si PENDIENTE_CLIENTE → registrar inicio pausa SLA
- Si EN_PROGRESO desde PENDIENTE_CLIENTE → acumular minutos_pausado
- Si EN_PROGRESO sin asignar → asignar al agente,
  registrar dt_asignado y dt_primer_respuesta
- Si RESUELTO → registrar dt_resuelto = NOW()
- Si CERRADO → registrar dt_cerrado = NOW()
- Registrar historial. Llamar NotificacionService.
**Verificación:** NUEVO → EN_PROGRESO → verificar dt_asignado e historial.

---

### TASK-030 — Endpoint PATCH asignar ticket
**Archivo:** `backend/.../controller/TicketController.java`
**Acción:**
PATCH /api/tickets/{id}/asignar (solo SUPERVISOR):
- Verifica agente activo
- Actualiza id_agente_asignado y dt_asignado
- Historial: "Asignado a {agente} por {supervisor}"
- NotificacionService.enviarNotificacionAsignacion()
**Verificación:** Asignar a Diego → asignación, historial y notificación.

---

### TASK-031 — Endpoint POST comentarios
**Archivo:** `backend/.../controller/TicketController.java`
**Acción:**
POST /api/tickets/{id}/comentarios:
- Recibe: { contenido, esInterno }
- Si esInterno=false → enviar correo al cliente (respuesta al hilo)
- Si esInterno=true → solo guardar en BD
- Registrar en hds_ticket_comentario
**Verificación:** Comentario público → guardado en BD y correo enviado.

---

### TASK-032 — Test de integración Épica 2
**Archivo:** `backend/.../integracion/Epica2IntegracionTest.java`
**Acción:**
Tests:
1. Ticket → clasificación IA con todos los campos
2. Urgencia CRITICA → notificación inmediata al equipo
3. Confianza < 60% → b_revisado_ia = false
4. Corrección clasificación → historial con nombre agente
5. PENDIENTE_CLIENTE → minutos_pausado se acumula
6. Transición inválida → error descriptivo
**Verificación:** `mvn test -Dtest=Epica2IntegracionTest` — verde.

---

### TASK-033 — Commit Épica 2
```
git add backend/
git commit -m "feat(epica2): clasificacion automatica Claude API, estados, SLA"
git push origin develop
```

---
*ÉPICA 2 completa → siguiente: TASKS-EPICA-3-frontend.md*
