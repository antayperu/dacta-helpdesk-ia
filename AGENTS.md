---

## 5. IDENTIDAD VISUAL — COLORES OFICIALES INTEGRENS

El producto a desarrollar es para Integrens, por lo tanto toda
interfaz generada debe respetar la identidad visual de Integrens.

| Nombre | Código HEX | Uso |
|---|---|---|
| Púrpura principal | #5B33D4 | Botones, acciones principales, links |
| Púrpura oscuro | #453E72 | Header, navbar, cabeceras |
| Sidebar Integrens | #353C44 | Sidebar, menú principal |
| Cyan acento | #38C1E1 | Badges activos, iconos y acciones especiales |
| Fondo lavanda | #F2F0FE | Fondo general de la aplicación |

Referencia visual: ERP Integrens real, profesional y serio tipo Zendesk.
Tecnología de estilos: React + Tailwind CSS.
Documento visual obligatorio: docs/skills/INTEGRENS-BRAND-SKILL.md.

---

## 6. METODOLOGÍA — SPEC-DRIVEN DEVELOPMENT (SDD)

### Regla de Oro
Ningún agente toca el sistema de archivos sin un plan
previo aprobado por el Orquestador.

### Flujo obligatorio
1. Orquestador define la necesidad
2. Agente propone especificación
3. Orquestador aprueba → Human Gate
4. Agente genera código
5. Orquestador verifica calidad

### Fases del proyecto
- FASE 0 — Configuración del proyecto
- FASE 1 — Especificación (Spec Writer)
- FASE 2 — Planificación de tareas (Task Planner)
- FASE 3 — Implementación controlada (Implementer)
- FASE 4 — Verificación y calidad (Verifier)
- FASE 5 — Demostración al equipo DACTA

---

## 7. ESTÁNDARES DACTA — OBLIGATORIOS

Documentos físicos disponibles en: /docs/standards/

| Código | Documento | Aplica a |
|---|---|---|
| M-O-DES-001 | Estandares de Programacion V3.0 | Todo el código fuente |
| M-O-DES-002 | Estandares de Base de Datos V3.0 | Scripts SQL y modelos |
| M-O-DES-003 | Manual GIT V3.0 | Ramas, commits y flujo |
| P-O-ACS-001 | Aseguramiento de Calidad V4.0 | Pruebas y calidad |
| P-O-DES-090 | Planeamiento de Proyectos V6.0 | Gestión del proyecto |
| P-O-DES-091 | Ejecucion de Proyectos V6.0 | Ejecución del proyecto |
| P-O-DES-092 | Atencion de Soportes Tercer Nivel V5.0 | Lógica de negocio soporte |
| P-O-DES-094 | Desarrollo Seguro V1.0 | Seguridad del código |
| P-O-SPU-001 | Soporte al Usuario V5.0 | Lógica de negocio soporte |
| P-O-SPU-002 | Implementaciones V4.0 | Despliegue |
| I-O-DES-001 | Control de Versiones V2.0 | Versionado |
| L-E-SIG-017 | Arquitectura y Diseño Seguro V1.0 | Arquitectura |

INSTRUCCIÓN AL AGENTE: Antes de generar cualquier código,
consultar el documento correspondiente en /docs/standards/

---

## 8. PROHIBICIONES EXPLÍCITAS

Todo agente que trabaje en este proyecto tiene PROHIBIDO:

- ❌ Generar código sin especificación aprobada
- ❌ Modificar archivos fuera de la carpeta asignada
- ❌ Usar librerías no aprobadas por el Orquestador
- ❌ Saltarse el flujo SDD por ningún motivo
- ❌ Modificar AGENTS.md o CONVENTIONS.md sin aprobación
- ❌ Crear ramas sin seguir el estándar M-O-DES-003
- ❌ Diseñar arquitectura que no contemple escalabilidad futura

---

## 9. MVP v1.0 — ALCANCE ACTUAL

Funcionalidades del producto mínimo viable:

1. Lectura automática de soporte@integrens.com (Gmail)
2. Clasificación automática con IA: tipo, módulo, urgencia
3. Creación automática de tickets sin duplicados
4. Panel para los 3 agentes: Carlos, Antonny y Diego
5. Dashboard con métricas para gerencia

---

## 10. ROADMAP — VISIÓN DE ESCALADO

| Versión | Funcionalidades principales |
|---|---|
| v1.0 MVP | Correo + clasificación IA + tickets + panel + dashboard |
| v2.0 | WhatsApp + asignación automática + SLA + historial cliente |
| v3.0 | Chatbot primer nivel + base de conocimiento + predicción IA |

---

## 11. CONTEXTO DEL NEGOCIO

- ERP Integrens atiende clientes de retail, distribución
  y consumo masivo en Perú
- Los tickets de soporte llegan por correo a
  soporte@integrens.com
- El equipo de soporte tiene 3 agentes: Carlos, Antonny y Diego
- La gerencia necesita métricas de atención
- Acceso a la app: solo red interna DACTA (MVP)

---
*Este archivo es la fuente de verdad del proyecto.*
*Versión 1.1 — se agregaron colores Integrens, visión de escalado y roadmap.*
*Actualizar solo con aprobación del Orquestador.*
