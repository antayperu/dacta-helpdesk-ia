# DACTA Help Desk IA v1.0

Sistema interno de mesa de ayuda con inteligencia artificial
para la gestión de tickets de soporte del ERP Integrens.

**Empresa:** DACTA S.A.C. — San Isidro, Lima, Perú
**Orquestador:** Camilo Ortega — QE / SDD
**Inicio del proyecto:** 2026-05-31

---

## ¿Qué problema resuelve?

Los tickets de soporte del ERP Integrens llegan por correo a
soporte@integrens.com. Hoy el equipo los clasifica manualmente,
lo que genera demoras, cruces entre agentes y falta de métricas.

Este sistema automatiza la recepción, clasificación y gestión
de tickets usando inteligencia artificial.

---

## ¿Cómo funciona?

1. Llega un correo a soporte@integrens.com
2. La IA lee y clasifica automáticamente:
   - Tipo de problema (Bug, Consulta, Capacitación, etc.)
   - Aplicación DACTA afectada (Integrens, Intelifac, Mobile)
   - Módulo específico (POS, Almacén, Facturación, etc.)
   - Urgencia (Crítica, Alta, Media, Baja)
3. Se crea el ticket automáticamente
4. Carlos, Antonny y Diego atienden desde el panel web
5. Gerencia ve métricas en tiempo real

---

## MVP v1.0 — Alcance actual

- Lectura automática de correos Gmail
- Clasificación con IA en 4 dimensiones
- Creación automática de tickets sin duplicados
- Panel para los 3 agentes de soporte
- Dashboard con métricas para gerencia

---

## Roadmap

| Versión | Funcionalidades |
|---|---|
| v1.0 MVP | Correo + IA + tickets + panel + dashboard |
| v2.0 | WhatsApp + asignación automática + SLA + historial |
| v3.0 | Chatbot + base de conocimiento + predicción IA |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 25 + Spring Boot |
| Frontend | React + Tailwind CSS |
| Base de datos | PostgreSQL |
| IA | Claude API (Anthropic) |
| Correo | Gmail API |
| Control de versiones | GitLab DACTA |

---

## Estructura del repositorio
dacta-helpdesk-ia/
├── docs/
│   ├── specs/        ← Especificaciones SDD aprobadas
│   ├── decisions/    ← Decisiones técnicas del proyecto
│   └── standards/    ← Documentos oficiales DACTA
├── backend/          ← Java 25 + Spring Boot
├── frontend/         ← React + Tailwind CSS
├── database/         ← Scripts SQL PostgreSQL
├── AGENTS.md         ← Contexto para agentes IA
└── CONVENTIONS.md    ← Reglas de código DACTA

---

## Documentos clave

- `AGENTS.md` — Instrucciones para agentes IA
- `CONVENTIONS.md` — Reglas de código y nomenclatura
- `docs/decisions/DEC-001` — Taxonomía de clasificación
- `docs/standards/` — Estándares oficiales DACTA

---

## Metodología

Este proyecto se desarrolla bajo **SDD (Spec-Driven Development)**.
Ningún agente genera código sin especificación aprobada
por el Orquestador.

---
*DACTA S.A.C. — Documento controlado*
*Acceso: solo red interna DACTA*
