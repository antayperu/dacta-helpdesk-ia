# PROGRESS.md — Control de Progreso del Proyecto
# DACTA Help Desk IA v1.0
# Orquestador: Camilo Ortega FR — QE / SDD
# Última actualización: 2026-06-01

---

## INSTRUCCIÓN OBLIGATORIA PARA TODO AGENTE IA

Antes de ejecutar cualquier tarea, leer este archivo COMPLETO.
Identificar la primera tarea con estado ⬜ PENDIENTE.
Ejecutar SOLO esa tarea — ni una más.
Al terminar y recibir aprobación del Orquestador:
  1. Cambiar el estado de ⬜ a ✅
  2. Registrar la fecha en el campo correspondiente
  3. Hacer commit: git add PROGRESS.md && git commit -m "progress: TASK-XXX completada"
  4. Reportar al Orquestador y esperar instrucción para la siguiente tarea

NUNCA marcar una tarea como ✅ sin aprobación explícita de Camilo Ortega FR.
NUNCA ejecutar más de una tarea por sesión sin aprobación entre cada una.
NUNCA asumir que una tarea está completa si no tiene fecha registrada.

---

## REGLA ANTI-DESFASE ENTRE AGENTES IA

Este archivo es la ÚNICA fuente de verdad del estado del proyecto.
No importa qué IA trabajó antes (Claude, Codex, Cursor, Copilot).
No importa qué se hizo en sesiones anteriores.
El estado real del proyecto es exactamente lo que dice este archivo.

Al iniciar cualquier sesión con cualquier IA:
1. Mostrar este archivo al agente
2. El agente lee el estado actual
3. El agente ejecuta solo la primera tarea ⬜
4. Nunca confiar en la "memoria" del agente — confiar en este archivo

---

## DOCUMENTOS DE REFERENCIA OBLIGATORIA

| Documento | Ruta | Para qué |
|---|---|---|
| Especificación funcional | docs/specs/SPEC-001-historias-usuario.md | QUÉ construir |
| Tareas atómicas por épica | docs/specs/tasks/ | CÓMO construir |
| Tarea completa archivada | docs/specs/archive/TASK-LIST-001-v1.1-COMPLETO.md | Referencia histórica completa |
| Design System | docs/skills/INTEGRENS-BRAND-SKILL.md | CÓMO se ve |
| Reglas del proyecto | AGENTS.md | CÓMO comportarse |
| Nomenclaturas | CONVENTIONS.md | CÓMO nombrar |
| Decisión integración | docs/decisions/DEC-002-integracion-integrens.md | Arquitectura futura |

---

## ESTADO GENERAL DEL PROYECTO

```
FASE 0 — Configuración        ✅ COMPLETA
FASE 1 — Especificación       ✅ COMPLETA
FASE 2 — Planificación        ✅ COMPLETA
FASE 2.5 — Diseño UI/UX       ✅ COMPLETA — 10 mockups aprobados
FASE 3 — Implementación       🔄 EN PROGRESO
FASE 4 — Verificación QA      ⬜ PENDIENTE
FASE 5 — Demo equipo DACTA    ⬜ PENDIENTE
```

---

## FASE 2.5 — UI/UX MOCKUPS ✅ COMPLETA

| Archivo | Pantalla | Estado | Fecha |
|---|---|---|---|
| docs/ux/UX-001-login.html | Login | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-002-layout-principal.html | Layout base + sidebar | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-003-panel-tickets.html | Lista de tickets + KPIs | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-004-detalle-ticket.html | Detalle de ticket | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-005-crear-ticket-manual.html | Crear ticket manual | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-006-filtros-tickets.html | Filtros avanzados | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-007-dashboard-gerencial.html | Dashboard gerencial | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-008-admin.html | Panel administración | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-009-estado-403.html | Error 403 | ✅ Aprobado | 2026-05-31 |
| docs/ux/UX-010-responsive-mobile.html | Vista móvil | ✅ Aprobado | 2026-05-31 |

---

## FASE 3 — IMPLEMENTACIÓN

### ÉPICA 0 — CIMIENTOS
> Base de datos + Spring Boot + JWT + Login
> Al completar: login funcional con correo DACTA

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-001 | Configurar proyecto Spring Boot base — backend/pom.xml + application.properties | ✅ COMPLETA | 2026-05-31 | Claude Code |
| TASK-002 | Crear estructura de paquetes Java en com.dacta.helpdesk | ✅ COMPLETA | 2026-05-31 | Claude Code |
| TASK-003 | Crear script BD V001__crear_tablas_principales.sql | ✅ COMPLETA | 2026-06-08 | Claude Code |
| TASK-004 | Crear script BD V002__datos_iniciales.sql (seed) | ✅ COMPLETA | 2026-06-08 | Claude Code |
| TASK-005 | Crear entidades JPA — 7 entidades | ✅ COMPLETA | 2026-06-08 | Claude Code |
| TASK-006 | Crear repositorios JPA — 7 repositorios | ⬜ PENDIENTE | — | — |
| TASK-007 | Configurar seguridad JWT — JwtUtil + JwtAuthFilter + SecurityConfig | ⬜ PENDIENTE | — | — |
| TASK-008 | Crear endpoint de login POST /api/auth/login | ⬜ PENDIENTE | — | — |

### ÉPICA 1 — RECEPCIÓN AUTOMÁTICA DE CANALES
> Gmail + WhatsApp + Tickets automáticos + Notificaciones
> Al completar: correo a soporte@integrens.com crea ticket solo

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-009 | Configurar Gmail API — GmailConfig.java | ⬜ PENDIENTE | — | — |
| TASK-010 | Crear GmailService — leer correos no procesados | ⬜ PENDIENTE | — | — |
| TASK-011 | Crear WhatsAppService — webhook + envío mensajes | ⬜ PENDIENTE | — | — |
| TASK-012 | Crear TicketCodeGenerator — códigos TK-00001 | ⬜ PENDIENTE | — | — |
| TASK-013 | Crear TicketService — crearDesdeCorreo + crearDesdeWhatsApp | ⬜ PENDIENTE | — | — |
| TASK-014 | Crear DuplicadoService — detección similitud >= 80% | ⬜ PENDIENTE | — | — |
| TASK-015 | Crear EmailPollingService — scheduler cada 5 minutos | ⬜ PENDIENTE | — | — |
| TASK-016 | Crear NotificacionService — 5 tipos de notificación | ⬜ PENDIENTE | — | — |
| TASK-017 | Crear plantillas de notificación — 5 archivos .txt | ⬜ PENDIENTE | — | — |
| TASK-018 | Crear endpoint POST /api/tickets/manual (HU-019 + DEC-002) | ⬜ PENDIENTE | — | — |
| TASK-019 | Crear servicio de reapertura automática de tickets | ⬜ PENDIENTE | — | — |
| TASK-020 | Crear CierreAutomaticoService — scheduler 48h | ⬜ PENDIENTE | — | — |
| TASK-021 | Crear endpoint GET /api/tickets (lista paginada + filtros) | ⬜ PENDIENTE | — | — |
| TASK-022 | Crear endpoint GET /api/tickets/{id} (detalle completo) | ⬜ PENDIENTE | — | — |
| TASK-023 | Test de integración Épica 1 | ⬜ PENDIENTE | — | — |
| TASK-024 | Commit Épica 1 al repositorio GitLab | ⬜ PENDIENTE | — | — |

### ÉPICA 2 — MOTOR IA — CLASIFICACIÓN
> Claude API + clasificación automática
> Al completar: IA clasifica tipo, módulo y urgencia sin intervención humana

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-025 | Configurar Claude API — ClaudeApiConfig.java | ⬜ PENDIENTE | — | — |
| TASK-026 | Crear ClasificacionIAService — prompt + respuesta JSON | ⬜ PENDIENTE | — | — |
| TASK-027 | Integrar clasificación en creación de ticket | ⬜ PENDIENTE | — | — |
| TASK-028 | Crear endpoint PATCH /api/tickets/{id}/clasificacion | ⬜ PENDIENTE | — | — |
| TASK-029 | Crear endpoint PATCH /api/tickets/{id}/estado + SLA | ⬜ PENDIENTE | — | — |
| TASK-030 | Crear endpoint PATCH /api/tickets/{id}/asignar | ⬜ PENDIENTE | — | — |
| TASK-031 | Crear endpoint POST /api/tickets/{id}/comentarios | ⬜ PENDIENTE | — | — |
| TASK-032 | Test de integración Épica 2 | ⬜ PENDIENTE | — | — |
| TASK-033 | Commit Épica 2 al repositorio GitLab | ⬜ PENDIENTE | — | — |

### ÉPICA 3 — FRONTEND — PANEL DE AGENTES
> React + Tailwind + Panel de tickets + Filtros
> Al completar: Carlos, Antonny y Diego gestionan tickets desde el navegador

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-034 | Configurar proyecto React + Vite + Tailwind con colores Integrens | ⬜ PENDIENTE | — | — |
| TASK-035 | Crear estructura de carpetas frontend/src/ | ⬜ PENDIENTE | — | — |
| TASK-036 | Crear authService.js — login + JWT + interceptores Axios | ⬜ PENDIENTE | — | — |
| TASK-037 | Crear LoginPage.jsx — basado en UX-001-login.html | ⬜ PENDIENTE | — | — |
| TASK-038 | Crear Layout.jsx — sidebar + header basado en UX-002 | ⬜ PENDIENTE | — | — |
| TASK-039 | Crear ticketService.js — todas las llamadas a la API | ⬜ PENDIENTE | — | — |
| TASK-040 | Crear TicketCard.jsx — componente fila de ticket | ⬜ PENDIENTE | — | — |
| TASK-041 | Crear PanelTicketsPage.jsx — basado en UX-003 | ⬜ PENDIENTE | — | — |
| TASK-042 | Crear TicketDetallePage.jsx — basado en UX-004 | ⬜ PENDIENTE | — | — |
| TASK-043 | Crear CrearTicketManualModal.jsx — basado en UX-005 | ⬜ PENDIENTE | — | — |
| TASK-044 | Crear FiltrosTickets.jsx — basado en UX-006 | ⬜ PENDIENTE | — | — |
| TASK-045 | Crear CargaAgentesPanel.jsx — carga de Carlos, Antonny, Diego | ⬜ PENDIENTE | — | — |
| TASK-046 | Tests de componentes React Épica 3 | ⬜ PENDIENTE | — | — |
| TASK-047 | Commit Épica 3 al repositorio GitLab | ⬜ PENDIENTE | — | — |

### ÉPICA 4 — DASHBOARD GERENCIAL
> Métricas + FRT + TTR + Gráficos
> Al completar: Sebastian Rafaile ve métricas reales del equipo

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-048 | Crear MetricasController — endpoint GET /api/metricas con FRT/TTR | ⬜ PENDIENTE | — | — |
| TASK-049 | Crear DashboardPage.jsx — basado en UX-007-dashboard-gerencial.html | ⬜ PENDIENTE | — | — |
| TASK-050 | Commit Épica 4 al repositorio GitLab | ⬜ PENDIENTE | — | — |

### ÉPICA 5 — SEGURIDAD Y ADMINISTRACIÓN
> Roles + bloqueo + usuarios + módulos
> Al completar: control de acceso completo por rol

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-051 | Crear AdminController — CRUD usuarios | ⬜ PENDIENTE | — | — |
| TASK-052 | Crear AdminController — CRUD módulos Integrens | ⬜ PENDIENTE | — | — |
| TASK-053 | Crear AdminPage.jsx — basado en UX-008-admin.html | ⬜ PENDIENTE | — | — |
| TASK-054 | Crear ProtectedRoute.jsx — guards por rol + UX-009-403 | ⬜ PENDIENTE | — | — |
| TASK-055 | Tests de seguridad y roles | ⬜ PENDIENTE | — | — |
| TASK-056 | Commit Épica 5 al repositorio GitLab | ⬜ PENDIENTE | — | — |

### CIERRE — LOGS, CI/CD Y VALIDACIÓN FINAL

| Tarea | Descripción | Estado | Fecha | IA usada |
|---|---|---|---|---|
| TASK-057 | Implementar logs y auditoría — AuditoriaConfig.java | ⬜ PENDIENTE | — | — |
| TASK-058 | Configurar pipeline CI/CD — .gitlab-ci.yml | ⬜ PENDIENTE | — | — |
| TASK-059 | Ejecutar pruebas de aceptación finales — docs/qa/ | ⬜ PENDIENTE | — | — |
| TASK-060 | Release MVP v1.0 — tag v1.0.0 en GitLab | ⬜ PENDIENTE | — | — |

---

## RESUMEN DE PROGRESO

```
FASE 3 — Implementación:
██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  2/60 tareas completadas

Épica 0 — Cimientos:    ✅✅⬜⬜⬜⬜⬜⬜   2/8
Épica 1 — Canales:      ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜   0/16
Épica 2 — Motor IA:     ⬜⬜⬜⬜⬜⬜⬜⬜⬜   0/9
Épica 3 — Frontend:     ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜   0/14
Épica 4 — Dashboard:    ⬜⬜⬜   0/3
Épica 5 — Seguridad:    ⬜⬜⬜⬜⬜⬜   0/6
Cierre:                 ⬜⬜⬜⬜   0/4
```

---

## HISTORIAL DE SESIONES

| Fecha | IA usada | Tareas ejecutadas | Orquestador |
|---|---|---|---|
| 2026-05-31 | Claude.ai + Claude Code | FASE 0, 1, 2, 2.5 completas | Camilo Ortega FR |

---

## CÓMO INICIAR CADA SESIÓN

### Instrucción estándar para cualquier agente IA:

```
Lee en este orden:
1. PROGRESS.md — estado actual del proyecto
2. AGENTS.md — reglas del proyecto
3. CONVENTIONS.md — nomenclaturas
4. docs/specs/SPEC-001-historias-usuario.md — qué construir
5. docs/specs/tasks/TASKS-EPICA-0-cimientos.md — cómo construir la siguiente tarea
6. docs/skills/INTEGRENS-BRAND-SKILL.md — diseño visual

Identifica la primera tarea con estado ⬜ PENDIENTE en PROGRESS.md.
Dime cuál es y qué harás antes de ejecutar.
Espera mi confirmación para proceder.
```

---
*DACTA S.A.C. — Documento controlado*
*PROGRESS.md v1.0 — 2026-05-31*
*Orquestador: Camilo Ortega FR — QE / SDD*
*Fuente de verdad del estado del proyecto — actualizar después de cada tarea*
