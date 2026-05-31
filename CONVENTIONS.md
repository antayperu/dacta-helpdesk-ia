# CONVENTIONS.md — DACTA Help Desk IA v1.0
# Reglas de código basadas en estándares oficiales DACTA
# Versión: 1.0 | Fecha: 2026-05-31
# Fuente: M-O-DES-001, M-O-DES-002, M-O-DES-003

---

## 1. CÓDIGO JAVA — BACKEND

### 1.1 Nombres de clases
Formato: [prefijo]_[nombre_descriptivo].java

| Prefijo | Tipo | Ejemplo |
|---|---|---|
| cl_ | Clase de modelo | cl_ticket.java |
| sv_ | Servicio / lógica de negocio | sv_ticket_service.java |
| rp_ | Repositorio / base de datos | rp_ticket_repository.java |
| ct_ | Controlador / endpoints API | ct_ticket_controller.java |

### 1.2 Variables — prefijo según alcance
| Prefijo | Alcance | Ejemplo |
|---|---|---|
| g | Global | gs_nom_usuario |
| l | Local — dentro del método | ls_asunto_correo |
| i | Instancia — nivel de objeto | is_estado_ticket |
| a | Argumento — parámetro del método | as_correo_origen |

### 1.3 Métodos — iniciar siempre con verbo
- uf_get_ticket_by_id()
- uf_set_estado_ticket()
- uf_create_ticket_from_email()
- uf_classify_ticket_ia()

### 1.4 Comentario de cabecera — obligatorio en todo archivo
// Autor: [nombre]
// Fecha: yyyy-mm-dd
// Descripción: [qué hace este archivo]

---

## 2. BASE DE DATOS — POSTGRESQL

### 2.1 Reglas generales — sin excepción
- Todo en MINÚSCULAS
- Palabras separadas por guion bajo (_)
- Nombres en SINGULAR
- Sin tildes → (á=a, é=e, í=i, ó=o, ú=u)
- Sin eñe → (ñ=n)
- Solo letras y guion bajo — sin números ni símbolos
- Nombres abreviados

### 2.2 Tablas — prefijo hd_ (helpdesk)
| Tabla | Descripción |
|---|---|
| hd_ticket | Cabecera del ticket |
| hd_ticket_det | Detalle y comentarios del ticket |
| hd_correo | Correos recibidos de Gmail |
| hd_agente | Agentes de soporte |
| hd_clasificacion | Clasificaciones realizadas por la IA |
| hd_cliente | Clientes / empresas que generan tickets |

### 2.3 Columnas — nombres abreviados
| Columna | Descripción |
|---|---|
| codtic | Código del ticket |
| fecrea | Fecha de creación |
| esttic | Estado del ticket |
| urgtic | Urgencia: CRITICA / ALTA / MEDIA / BAJA |
| tiptic | Tipo: BUG / DAT / USR / CON / CAP / PER / INT / INF |
| codapp | Aplicación: ECS / EWB / MOV / IFC / OTR |
| codmod | Módulo: POS / ALM / FAC / COM / VEN / LOG / FIN / RHH / CFG / OTR |
| codage | Código del agente asignado |
| codcli | Código del cliente / empresa |
| cautic | Causa raíz del problema |
| soltic | Solución aplicada |
| evitic | ¿Es evitable con mejor testing? (S/N) |

### 2.4 Objetos de base de datos
| Objeto | Prefijo | Ejemplo |
|---|---|---|
| Primary Key | PK_ | PK_hd_ticket |
| Foreign Key | FK_ | FK_hd_ticket_agente |
| Índice | IX_ | IX_hd_ticket_fecrea |
| Procedimiento | sp_ | sp_hd_get_ticket |
| Función | fn_ | fn_hd_calcular_urgencia |

---

## 3. GIT — RAMAS Y COMMITS

### 3.1 Estructura de ramas DACTA — obligatoria
master → beta → testing → dev → req_[nombre]

### 3.2 Nombres de ramas de requerimiento
- req_lectura_correo
- req_clasificacion_ia
- req_creacion_tickets
- req_panel_agente
- req_dashboard_gerencia

### 3.3 Mensajes de commit
Formato: [tipo]: [descripción corta en español]

| Tipo | Cuándo usarlo | Ejemplo |
|---|---|---|
| feat | Nueva funcionalidad | feat: agrega lectura automática de correos |
| fix | Corrección de error | fix: corrige clasificación urgencia alta |
| docs | Documentación | docs: actualiza AGENTS.md |
| test | Pruebas | test: agrega prueba clasificador IA |

### 3.4 Reglas de commits
- Mínimo 1 commit por día de trabajo
- Guardar cambios cada 30 minutos
- Nunca trabajar directo en master

---

## 4. REACT — FRONTEND

### 4.1 Componentes — PascalCase
- TicketPanel.jsx
- DashboardGerencia.jsx
- TicketCard.jsx
- AgenteSidebar.jsx
- TicketDetalle.jsx

### 4.2 Servicios — camelCase con sufijo Service
- ticketService.js
- correoService.js
- agenteService.js
- clasificacionService.js

### 4.3 Colores oficiales Integrens — siempre respetar
| Nombre | Código HEX | Uso |
|---|---|---|
| Púrpura principal | #5B33D4 | Botones, acciones principales |
| Púrpura oscuro | #453E72 | Header, navbar, cabeceras |
| Sidebar Integrens | #353C44 | Sidebar, menú principal |
| Cyan acento | #38C1E1 | Badges activos, iconos y acciones especiales |
| Fondo lavanda | #F2F0FE | Fondo general de la aplicación |

El frontend debe seguir `docs/skills/INTEGRENS-BRAND-SKILL.md`.

---
*Basado en M-O-DES-001 V3.0, M-O-DES-002 V3.0, M-O-DES-003 V3.0*
*Actualizar solo con aprobación del Orquestador — Camilo Ortega*
