# TASKS — CIERRE: LOGS, CI/CD Y VALIDACIÓN FINAL
# DACTA Help Desk IA v1.0
# Tareas: TASK-057 a TASK-060
# Orquestador: Camilo Ortega FR

---

### TASK-057 — Implementar logs y auditoría (HT-008)
**Archivo:** `backend/.../config/AuditoriaConfig.java`
**Acción:**
- Interceptor: registra cada request con usuario, endpoint,
  método, timestamp, IP
- Log de cada cambio de estado con usuario responsable
- Log de cada clasificación IA con confianza y resultado
- Logback: archivo rotativo diario
- Formato: [FECHA] [USUARIO] [ACCION] [ENTIDAD] [DETALLE]
**Verificación:** Cambiar estado de ticket → registro en log de auditoría.

---

### TASK-058 — Configurar pipeline CI/CD GitLab (HT-009)
**Archivo:** `.gitlab-ci.yml`
**Acción:**
stages: [build, test, deploy]
- build-backend: cd backend && mvn clean package -DskipTests
- test-backend: cd backend && mvn test
- build-frontend: cd frontend && npm install && npm run build
- deploy-dev: solo en rama develop
**Verificación:** Push a develop → pipeline verde en todas las etapas.

---

### TASK-059 — Pruebas de aceptación finales (QA)
**Archivo:** `docs/qa/PRUEBAS-ACEPTACION-MVP.md`
**Acción:**
Ejecutar y documentar criterios QA del SPEC-001:
✓/✗ Correo nuevo → ticket en < 5 minutos
✓/✗ Correo duplicado → vinculado, no nuevo ticket
✓/✗ WhatsApp → ticket canal WHATSAPP
✓/✗ Ticket manual → notificación por correo
✓/✗ Dos agentes → solo uno toma el ticket
✓/✗ SLA pausa en Pendiente Cliente
✓/✗ Cierre automático 48h
✓/✗ FRT y TTR calculados correctamente
✓/✗ Dashboard gerencia → solo lectura
✓/✗ Cuenta bloqueada tras 5 intentos
✓/✗ Interfaz responsiva en móvil
Registrar cada prueba con captura de evidencia.
**Verificación:** Todos los criterios marcados ✓. Documento en docs/qa/.

---

### TASK-060 — Release MVP v1.0
**Acción:**
```
git add .
git commit -m "release: DACTA Help Desk IA v1.0 MVP listo para demo"
git tag v1.0.0
git push origin develop
git push origin --tags
```
**Verificación:** Tag v1.0.0 visible en GitLab. Pipeline verde.

---
*CIERRE COMPLETO → FASE 4 Verificación QA → FASE 5 Demo equipo DACTA*
*DACTA S.A.C. — Camilo Ortega FR — 2026-05-31*
