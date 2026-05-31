# SPEC-001 — Historias de Usuario y Criterios de Aceptación
# DACTA Help Desk IA v1.0
# Versión: 1.0 | Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR
# Estado: APROBADO — FASE 1

---

## ACTORES
- A1: Agentes de soporte — Carlos, Antonny, Diego
- A2: Supervisor/Admin — Camilo Ortega FR
- A3: Gerencia — Sebastian Rafaile
- A4: Cliente Integrens — solo correo y WhatsApp
- A5: Sistema IA — Claude API (Anthropic)
- A6: Canales — Gmail + WhatsApp Business

---

## FLUJO DE ESTADOS
Nuevo → En Progreso ⇄ Pendiente Cliente → Resuelto → Cerrado → Reabierto

REGLA: El SLA se pausa automáticamente en estado "Pendiente Cliente".
REGLA: Cierre automático tras 48h en estado "Resuelto" sin respuesta del cliente.
REGLA: Reapertura automática si cliente responde ticket Cerrado o Resuelto.

---

## MÓDULOS INTEGRENS (tabla mantenible por Supervisor)
- CMR-POS: Punto de Venta — Integrens
- CMR-VEN: Ventas — Integrens
- LOG-ALM: Almacén — Integrens
- LOG-COM: Compras — Integrens
- FIN-FAC: Facturación — Integrens
- FIN-CXC: Cuentas por Cobrar — Integrens
- RH: Recursos Humanos — Integrens
- SYS: Sistema / Configuración / Accesos — Integrens
- IFACE: Facturación Electrónica — Intelifac
- MOB: Aplicación Móvil — Mobile

---

## ÉPICA 1 — Recepción automática de canales

### HU-001 — Lectura automática de correos Gmail [ALTA]
Como sistema, quiero leer soporte@integrens.com automáticamente
Para evitar registro manual de tickets.
Criterios:
- Conectar a Gmail API cada 5 minutos (configurable).
- Registrar remitente, asunto, cuerpo y fecha.
- Marcar correo como procesado. Evitar reprocesamiento.
- Si es respuesta a hilo existente, vincular al ticket original.

### HU-002 — Lectura automática de WhatsApp Business [ALTA]
Como sistema, quiero leer mensajes nuevos de WhatsApp Business API
Para centralizar todos los casos en un solo sistema.
Criterios:
- Integración con WhatsApp Business API.
- Registrar número, nombre (si disponible), mensaje y fecha.
- Marcar como procesado. Vincular si es conversación activa.

### HU-003 — Creación automática de ticket [ALTA]
Como sistema, quiero crear un ticket por cada mensaje nuevo
Para garantizar trazabilidad desde el primer segundo.
Criterios:
- Un mensaje = un ticket (sin duplicados).
- Código único autogenerado (ej: TK-00041).
- Registrar fecha/hora de creación.
- Guardar contenido original. Estado inicial: Nuevo.
- Notificar al equipo que hay ticket nuevo disponible.

### HU-004 — Detección de duplicados y seguimientos [ALTA]
Como sistema IA, quiero detectar duplicados y seguimientos
Para no crear tickets repetidos del mismo caso.
Criterios:
- Comparar asunto, remitente y contenido con tickets abiertos.
- Similitud >= 80%: marcar como posible duplicado y vincular.
- El agente puede confirmar o descartar la vinculación.
- Si cliente responde ticket Resuelto/Cerrado: reapertura automática.

---

## ÉPICA 2 — Clasificación inteligente con IA

### HU-005 — Clasificación por tipo de incidencia [ALTA]
Como agente, quiero que la IA clasifique el tipo de problema
Para agilizar la atención sin clasificación manual.
Criterios:
- Tipos: BUG, CONSULTA, CAPACITACION, CONFIGURACION, MEJORA, ACCESO.
- Registrar nivel de confianza de la IA (porcentaje).
- El agente puede corregir. Corrección queda en historial.

### HU-006 — Identificación de aplicación DACTA [ALTA]
Como agente, quiero que la IA identifique la aplicación afectada
Para derivar correctamente el ticket.
Criterios:
- Aplicaciones: Integrens, Intelifac, Mobile.
- Campo obligatorio. El agente puede editar.

### HU-007 — Identificación de módulo del ERP [ALTA]
Como agente, quiero que la IA detecte el módulo del ERP afectado
Para facilitar soporte especializado.
Criterios:
- Identificar módulo del catálogo mantenible (ver tabla de módulos).
- Catálogo ampliable por Supervisor sin redespliegue.
- El agente puede modificar. Obligatorio para BUG y CONSULTA.

### HU-008 — Clasificación de urgencia [ALTA]
Como agente, quiero que la IA determine la urgencia del ticket
Para priorizar casos críticos automáticamente.
Criterios:
- Niveles: Crítica (rojo), Alta (naranja), Media (amarillo), Baja (verde).
- Considerar palabras clave y contexto del mensaje.
- Urgencia visible con color en el panel.
- Agente/Supervisor pueden cambiar. Cambio queda en historial.
- Tickets Críticos generan notificación inmediata al equipo.

---

## ÉPICA 3 — Gestión de tickets

### HU-009 — Panel de visualización de tickets [ALTA]
Como agente, quiero ver todos los tickets en un panel web
Para gestionar incidencias centralizadamente.
Criterios:
- Listado paginado con: código, cliente, asunto, estado, urgencia,
  módulo, responsable, fecha.
- Ver cola sin asignar + mis tickets asignados.
- Panel se actualiza en tiempo real (sin recargar).
- Colores DACTA: #2E4AF6, #6FA3B2, #003366.
- Interfaz responsiva: PC, laptop y celular.

### HU-010 — Tomar y asignar tickets [ALTA]
Como agente/supervisor, quiero tomar o asignar tickets
Para distribuir carga y evitar que dos agentes atiendan el mismo caso.
Criterios:
- Agente toma ticket: queda asignado a su nombre, desaparece de cola.
- Solo el supervisor puede reasignar tickets ya tomados.
- Registrar fecha/hora de asignación.
- Mostrar carga actual de cada agente (número de tickets activos).

### HU-011 — Cambio de estado del ticket [ALTA]
Como agente, quiero actualizar el estado del ticket
Para reflejar el avance de cada caso en tiempo real.
Criterios:
- Flujo: Nuevo→En Progreso⇄Pendiente Cliente→Resuelto→Cerrado.
- SLA se pausa en Pendiente Cliente. Se reanuda en En Progreso.
- Cierre automático tras 48h en Resuelto sin respuesta del cliente.
- Reapertura automática si cliente responde Resuelto/Cerrado.
- Cada cambio registra usuario, fecha y hora en historial.

### HU-012 — Detalle completo del ticket [ALTA]
Como agente, quiero ver toda la información del ticket en una vista
Para entender el problema sin buscar en el correo.
Criterios:
- Mostrar: código, cliente, canal de origen, mensaje original completo.
- Clasificación IA: tipo, aplicación, módulo, urgencia, confianza.
- Historial completo de cambios de estado con usuario y fecha.
- Comentarios internos del equipo. Archivos adjuntos.
- Responder al cliente directamente desde el sistema.
- Agregar notas internas visibles solo para equipo DACTA.

### HU-013 — Filtros y búsqueda de tickets [ALTA]
Como agente/supervisor, quiero filtrar y buscar tickets
Para encontrar cualquier caso rápidamente.
Criterios:
- Filtros: estado, urgencia, módulo, agente, tipo, canal de origen.
- Filtros por fecha: hoy, semana, mes, rango personalizado.
- Búsqueda por palabra clave en asunto, cliente o contenido.
- Filtros combinables. Resultado en tiempo real.

---

## ÉPICA 4 — Dashboard gerencial

### HU-014 — Dashboard de métricas en tiempo real [ALTA]
Como gerencia (Sebastian Rafaile), quiero ver métricas en tiempo real
Para monitorear el rendimiento del equipo de soporte.
Criterios:
- Métricas: tickets por estado, urgencia, módulo, agente y canal.
- Tiempo promedio de resolución.
- Actualización automática sin recargar.
- Solo lectura. Colores DACTA.

### HU-015 — Métricas filtradas por período [ALTA]
Como gerencia, quiero filtrar métricas por rango de fechas
Para analizar tendencias y comparar períodos.
Criterios:
- Filtros: hoy, semana, mes, trimestre, rango personalizado.
- Todos los gráficos se actualizan al cambiar el período.
- Mostrar comparativa vs período anterior.

---

## ÉPICA 5 — Seguridad y administración

### HU-016 — Inicio de sesión seguro [ALTA]
Como usuario DACTA, quiero iniciar sesión con mis credenciales
Para acceder según mi perfil y permisos.
Criterios:
- Login con correo corporativo + contraseña cifrada (bcrypt).
- Sesiones con token JWT. Expiración tras 8h de inactividad.
- Bloqueo automático tras 5 intentos fallidos.
- Desbloqueo solo por Supervisor/Admin.

### HU-017 — Control de roles y permisos [ALTA]
Como Supervisor/Admin (Camilo Ortega FR), quiero controlar permisos
Para que cada persona acceda solo a lo que le corresponde.
Criterios:
- Roles: Agente, Supervisor/Admin, Gerencia.
- Agente: tickets sin asignar + sus tickets + responder + cambiar estado.
- Supervisor/Admin: acceso total + gestión de usuarios + configuración.
- Gerencia: solo lectura en dashboard. Sin acceso a tickets.
- Crear, editar y desactivar usuarios. Desactivado = acceso inmediato revocado.

---

## HISTORIAS TÉCNICAS

- HT-001: Configuración Gmail API — habilita Épica 1
- HT-002: Configuración WhatsApp Business API — habilita Épica 1
- HT-003: Configuración Claude API (Anthropic) — habilita Épica 2
- HT-004: Base de datos PostgreSQL + modelos de datos — habilita Épicas 1,2,3
- HT-005: Estructura base Spring Boot — habilita Épicas 1-5
- HT-006: Frontend React + Tailwind con colores DACTA — habilita Épicas 3,4,5
- HT-007: Autenticación JWT + control de sesiones — habilita Épica 5
- HT-008: Sistema de logs y auditoría — habilita Épicas 1-5
- HT-009: Pipeline CI/CD GitLab DACTA — habilita Épicas 1-5

---

## CRITERIOS QA CLAVE

- Un correo = un ticket. Duplicado detectado = vinculado, no nuevo ticket.
- IA clasifica en menos de 30 segundos desde recepción del correo.
- Dos agentes no pueden tomar el mismo ticket simultáneamente.
- SLA se pausa en Pendiente Cliente. Se reanuda en En Progreso.
- Cierre automático a las 48h exactas en estado Resuelto.
- Rol Gerencia no puede modificar tickets — solo lectura.
- Cuenta bloqueada tras 5 intentos fallidos de login.

---

## DEFINITION OF DONE

### Por Historia de Usuario:
- Código compila sin errores.
- Todos los criterios de aceptación implementados.
- Casos QA correspondientes pasan.
- Estándares DACTA respetados (M-O-DES-001, M-O-DES-002, M-O-DES-003).
- Colores DACTA aplicados (#2E4AF6 / #6FA3B2 / #003366).
- Interfaz responsiva (PC + celular).
- Aprobado por Orquestador Camilo Ortega FR.

### Por Épica:
- Todas las HUs de la épica cerradas.
- HTs de soporte implementadas.
- Sin regresiones en lo anterior.
- Mergeado en rama develop en GitLab.
- Orquestador aprobó demo de la épica.

### MVP v1.0 listo:
- 5 épicas cerradas. 9 HTs implementadas.
- Carlos, Antonny y Diego probaron el panel.
- Sebastian Rafaile aprobó el dashboard.
- Sistema corriendo en servidor interno DACTA.
- Camilo aprobó la demo completa (FASE 5).

---

## COLORES OFICIALES DACTA
- Azul principal: #2E4AF6 — botones y acciones principales
- Azul acero: #6FA3B2 — elementos secundarios e iconos
- Azul marino: #003366 — sidebar, cabeceras y menú

---

## RESTRICCIONES PARA AGENTES IA
- NUNCA generar código sin HU y criterios aprobados en este documento.
- SIEMPRE respetar estándares M-O-DES-001, M-O-DES-002, M-O-DES-003.
- SIEMPRE usar colores DACTA en el frontend.
- SIEMPRE esperar aprobación del Orquestador antes de avanzar.
- El Orquestador es Camilo Ortega FR — QE / SDD.

---
*DACTA S.A.C. — Documento controlado*
*Acceso: solo red interna DACTA*
*SPEC-001 v1.0 — 2026-05-31*