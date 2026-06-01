# TASKS — ÉPICA 3: FRONTEND — PANEL DE AGENTES
# DACTA Help Desk IA v1.0
# Tareas: TASK-034 a TASK-047
# Orquestador: Camilo Ortega FR
# Referencia: SPEC-001 v1.1 HU-009 a HU-013
# IMPORTANTE: Basarse en mockups docs/ux/ para el diseño visual
# IMPORTANTE: Leer docs/skills/INTEGRENS-BRAND-SKILL.md antes de cualquier componente

---

### TASK-034 — Configurar proyecto React + Vite + Tailwind
**Archivo:** `frontend/`
**Acción:**
npm create vite@latest frontend -- --template react
cd frontend && npm install
npm install tailwindcss @tailwindcss/forms axios react-router-dom
npm install react-query date-fns recharts
npx tailwindcss init

tailwind.config.js — colores Integrens:
colors: {
  'int-purple': '#5B33D4',
  'int-purple-dark': '#453E72',
  'int-sidebar': '#353C44',
  'int-cyan': '#38C1E1',
  'int-bg': '#F2F0FE',
}
.env: VITE_API_URL=http://localhost:8080/api
**Verificación:** `npm run dev` — app React en localhost:3000.

---

### TASK-035 — Crear estructura de carpetas frontend
**Archivo:** `frontend/src/`
**Acción:**
src/
├── components/
│   ├── common/    (Layout, Sidebar, Header, ProtectedRoute)
│   ├── tickets/   (TicketCard, FiltrosTickets, CargaAgentes)
│   └── dashboard/ (MetricasCard, GraficoBarras)
├── pages/
├── services/
├── hooks/
├── context/
└── utils/
**Verificación:** Estructura creada. `npm run dev` sin errores.

---

### TASK-036 — Crear authService.js
**Archivo:** `frontend/src/services/authService.js`
**Acción:**
- login(correo, contrasena) → token JWT
- logout() → limpiar token
- getUsuarioActual() → datos del token
- getRol() → rol del usuario
- Interceptor Axios: Authorization header en cada request
- Interceptor Axios: 401 → redirigir a /login
**Verificación:** login() con credenciales válidas retorna token.

---

### TASK-037 — Crear LoginPage.jsx
**Archivo:** `frontend/src/pages/LoginPage.jsx`
**Referencia visual:** docs/ux/UX-001-login.html
**Acción:**
Replicar el diseño del mockup UX-001:
- Split panel: izquierdo #453E72→#353C44, derecho blanco
- Logo Integrens 280px desde /assets/images/logo-integrens.png
- Campos: correo corporativo + contraseña con toggle
- Botón #5B33D4. Badges seguridad. Animaciones entrada.
- Manejo errores: credenciales, cuenta bloqueada
- Responsive: columna única en móvil
**Verificación:** Login correcto → redirige al panel. Error → muestra mensaje.

---

### TASK-038 — Crear Layout.jsx + Sidebar
**Archivo:** `frontend/src/components/common/Layout.jsx`
**Referencia visual:** docs/ux/UX-002-layout-principal.html
**Acción:**
Replicar el diseño del mockup UX-002:
- Sidebar 260px fijo color #353C44
- Header gradient #453E72→#5B33D4
- Logo Integrens 180px
- Menú por rol (AGENTE/SUPERVISOR/GERENCIA)
- Header 64px blanco con badge "IA activa" verde pulsante
- Nombre + rol usuario en sidebar inferior
- Responsive: sidebar colapsable en móvil
**Verificación:** Layout carga con sidebar y header correctos.

---

### TASK-039 — Crear ticketService.js
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

### TASK-040 — Crear TicketCard.jsx
**Archivo:** `frontend/src/components/tickets/TicketCard.jsx`
**Referencia visual:** docs/ux/UX-003-panel-tickets.html
**Acción:**
Fila de ticket con: código, cliente, asunto truncado,
módulo, estado (badge color), urgencia (color), responsable, fecha.
Colores urgencia: Crítica #EF4444, Alta #F97316, Media #EAB308, Baja #22C55E
Badge "IA" indicando clasificación automática.
Click → navega al detalle. Hover con borde #5B33D4.
**Verificación:** Componente renderiza con datos de prueba.

---

### TASK-041 — Crear PanelTicketsPage.jsx
**Archivo:** `frontend/src/pages/PanelTicketsPage.jsx`
**Referencia visual:** docs/ux/UX-003-panel-tickets.html
**Acción:**
- KPIs superiores: total tickets, críticos, mis tickets
- Barra de filtros (usa FiltrosTickets)
- Lista de tickets (usa TicketCard)
- Paginación
- Botón "Crear ticket manual" (AGENTE y SUPERVISOR)
- Actualización automática cada 30 segundos
- Estado vacío descriptivo
**Verificación:** Panel carga lista. Filtros y paginación funcionan.

---

### TASK-042 — Crear TicketDetallePage.jsx
**Archivo:** `frontend/src/pages/TicketDetallePage.jsx`
**Referencia visual:** docs/ux/UX-004-detalle-ticket.html
**Acción:**
Secciones:
- Cabecera: código, estado badge, urgencia, canal origen
- Datos cliente: nombre, correo, teléfono
- Contexto ERP si canal=INTEGRENS_ERP
- Mensaje original completo
- Clasificación IA: tipo, app, módulo, confianza (barra)
- Acciones: Tomar, Cambiar estado, Reasignar (Supervisor)
- Timeline historial de estados
- Comentarios internos y públicos separados
- Formulario responder al cliente / nota interna
**Verificación:** Detalle muestra todos los campos. Cambio estado funciona.

---

### TASK-043 — Crear CrearTicketManualModal.jsx
**Archivo:** `frontend/src/components/tickets/CrearTicketManualModal.jsx`
**Referencia visual:** docs/ux/UX-005-crear-ticket-manual.html
**Acción:**
Modal con:
- Búsqueda cliente por correo
- Asunto (obligatorio)
- Descripción del problema
- Urgencia (select)
- Módulo (select dinámico desde API)
- Botón Crear → ticketService.crearTicketManual()
- Confirmación con código del ticket generado
**Verificación:** Modal crea ticket y muestra código TK-XXXXX.

---

### TASK-044 — Crear FiltrosTickets.jsx
**Archivo:** `frontend/src/components/tickets/FiltrosTickets.jsx`
**Referencia visual:** docs/ux/UX-006-filtros-tickets.html
**Acción:**
- Select: Estado, Urgencia, Módulo, Agente (solo Supervisor), Canal
- DatePicker: Fecha desde / Fecha hasta
- Input: búsqueda libre
- Botón "Limpiar filtros"
- Filtros en tiempo real con debounce 500ms
**Verificación:** Filtros combinables. Limpiar resetea todo.

---

### TASK-045 — Crear CargaAgentesPanel.jsx
**Archivo:** `frontend/src/components/tickets/CargaAgentesPanel.jsx`
**Acción:**
Visible solo para SUPERVISOR:
- Tarjeta por agente: Carlos, Antonny, Diego
- Tickets activos + distribución por urgencia
- Botón rápido de reasignar
**Verificación:** Panel muestra carga real de los 3 agentes.

---

### TASK-046 — Tests de componentes React
**Archivos:** `frontend/src/__tests__/`
**Acción:**
- PanelTicketsPage.test.jsx
- TicketDetallePage.test.jsx
- CrearTicketManualModal.test.jsx — validación formulario
**Verificación:** `npm test` — todos en verde.

---

### TASK-047 — Commit Épica 3
```
git add frontend/
git commit -m "feat(epica3): panel agentes, detalle ticket, filtros y gestion React"
git push origin develop
```

---
*ÉPICA 3 completa → siguiente: TASKS-EPICA-4-dashboard.md*
