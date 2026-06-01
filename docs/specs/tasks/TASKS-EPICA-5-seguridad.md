# TASKS — ÉPICA 5: SEGURIDAD Y ADMINISTRACIÓN
# DACTA Help Desk IA v1.0
# Tareas: TASK-051 a TASK-056
# Orquestador: Camilo Ortega FR
# Referencia: SPEC-001 v1.1 HU-016, HU-017

---

### TASK-051 — Endpoints administración de usuarios
**Archivo:** `backend/.../controller/AdminController.java`
**Acción:**
Solo SUPERVISOR:
- GET /api/admin/usuarios
- POST /api/admin/usuarios
- PATCH /api/admin/usuarios/{id}
- PATCH /api/admin/usuarios/{id}/desactivar
- PATCH /api/admin/usuarios/{id}/desbloquear
  (resetea n_intentos_fallidos=0 y b_bloqueado=false)
**Verificación:** CRUD usuarios. Desactivar revoca acceso inmediatamente.

---

### TASK-052 — Endpoints administración de módulos
**Archivo:** `backend/.../controller/AdminController.java`
**Acción:**
Solo SUPERVISOR:
- GET /api/admin/modulos
- POST /api/admin/modulos
- PATCH /api/admin/modulos/{id}
- PATCH /api/admin/modulos/{id}/desactivar
**Verificación:** CRUD módulos. Módulo desactivado no aparece en IA.

---

### TASK-053 — Crear AdminPage.jsx
**Archivo:** `frontend/src/pages/AdminPage.jsx`
**Referencia visual:** docs/ux/UX-008-admin.html
**Acción:**
Replicar mockup UX-008 — solo visible para SUPERVISOR:
2 tabs:
- Tab Usuarios: tabla + editar/desactivar/desbloquear + crear
- Tab Módulos: tabla + editar/desactivar + crear
Formularios en modales con validación.
**Verificación:** CRUD usuarios y módulos desde la interfaz.

---

### TASK-054 — Crear ProtectedRoute.jsx + guards de ruta
**Archivo:** `frontend/src/components/common/ProtectedRoute.jsx`
**Referencia visual:** docs/ux/UX-009-estado-403.html
**Acción:**
- Sin token → /login
- Token expirado → /login
- Rol sin acceso → mostrar UX-009 (403)
Rutas por rol:
- AGENTE: /tickets, /tickets/:id
- SUPERVISOR: todo + /admin, /dashboard
- GERENCIA: solo /dashboard
**Verificación:** Agente en /admin → 403. Token expirado → login.

---

### TASK-055 — Tests de seguridad y roles
**Archivo:** `backend/.../security/SeguridadTest.java`
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
```
git add backend/ frontend/
git commit -m "feat(epica5): seguridad JWT, roles, admin usuarios y modulos"
git push origin develop
```

---
*ÉPICA 5 completa → siguiente: TASKS-CIERRE.md*
