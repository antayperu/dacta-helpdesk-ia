# SPEC-001 — Historias de Usuario y Criterios de Aceptación
# DACTA Help Desk IA v1.0
# Versión: 1.1 — Agrega HU-018 notificaciones y HU-019 ticket por teléfono
# Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR — QE / SDD
# Estado: APROBADO — FASE 1

---

## DATOS DEL PROYECTO

| Campo | Valor |
|---|---|
| Código | SPEC-001 |
| Versión | 1.1 |
| Fecha | 2026-05-31 |
| Empresa | DACTA S.A.C. — San Isidro, Lima, Perú |
| Orquestador | Camilo Ortega FR — QE / SDD |
| Supervisor técnico | Camilo Ortega FR |
| Gerencia | Sebastian Rafaile |
| Equipo de soporte | Carlos, Antonny, Diego |
| Metodología | SDD — Spec-Driven Development |
| Estado | APROBADO — FASE 1 v1.1 |

---

## ACTORES DEL SISTEMA

| Código | Actor | Persona real | Acceso |
|---|---|---|---|
| A1 | Agente de Soporte | Carlos, Antonny, Diego | Panel tickets asignados + sin asignar |
| A2 | Supervisor / Admin | Camilo Ortega FR | Acceso total + usuarios + configuración |
| A3 | Gerencia | Sebastian Rafaile | Solo dashboard — lectura |
| A4 | Cliente Integrens | Empresas clientes del ERP | Solo correo o WhatsApp (MVP) |
| A5 | Sistema IA | Claude API (Anthropic) | Actor interno — clasifica y crea tickets |
| A6 | Canales de entrada | Gmail + WhatsApp Business | Actores externos de integración |

---

## POLÍTICA OFICIAL DE CANALES DE SOPORTE

| Canal | Uso | Ticket | Seguimiento |
|---|---|---|---|
| Correo | Canal oficial — todos los casos | Automático por IA | Por correo — mismo hilo |
| WhatsApp | Solo urgencias críticas | Automático por IA | Por correo registrado en Integrens |
| Teléfono | Casos críticos — agente crea ticket | Manual por agente | Por correo registrado en Integrens |

**Regla de oro:** Sin importar cómo llegó el caso — el seguimiento siempre vive en el correo.

---

## FLUJO DE ESTADOS DEL TICKET

```
NUEVO → EN PROGRESO ⇄ PENDIENTE CLIENTE → RESUELTO → CERRADO → REABIERTO
```

| Estado | Quién lo activa | SLA | Notificación al cliente |
|---|---|---|---|
| Nuevo | Sistema IA — automáticamente | Activo | Sí — confirmación con #TK |
| En Progreso | Agente — al tomar el ticket | Activo | Sí — nombre del agente asignado |
| Pendiente Cliente | Agente — espera respuesta | PAUSADO | Sí — solicita información adicional |
| Resuelto | Agente — da la solución | Activo | Sí — resuelto, 48h para confirmar |
| Cerrado | Sistema — 48h sin respuesta | No | Sí — caso cerrado |
| Reabierto | Sistema — cliente responde cerrado | Activo | No — el agente gestiona |

**Reglas críticas:**
- El SLA se pausa automáticamente en estado Pendiente Cliente.
- Cierre automático tras 48h en estado Resuelto sin respuesta del cliente.
- Reapertura automática si cliente responde ticket Cerrado o Resuelto.

---

## MÓDULOS INTEGRENS (tabla mantenible por Supervisor — sin redespliegue)

| Código | Módulo | Aplicación |
|---|---|---|
| CMR-POS | Punto de Venta | Integrens |
| CMR-VEN | Ventas | Integrens |
| LOG-ALM | Almacén | Integrens |
| LOG-COM | Compras | Integrens |
| FIN-FAC | Facturación | Integrens |
| FIN-CXC | Cuentas por Cobrar | Integrens |
| RH | Recursos Humanos | Integrens |
| SYS | Sistema / Configuración / Accesos | Integrens |
| IFACE | Facturación Electrónica | Intelifac |
| MOB | Aplicación Móvil | Mobile |

---

## ÉPICA 1 — Recepción automática de canales (6 historias)

### HU-001 — Lectura automática de correos Gmail [ALTA]
Como sistema de mesa de ayuda
Quiero leer automáticamente los correos de soporte@integrens.com cada 5 minutos
Para evitar registro manual y garantizar que ningún correo se pierda.
Criterios:
- Conectar a Gmail API con credenciales configuradas.
- Leer correos nuevos no procesados cada 5 minutos (intervalo configurable).
- Registrar remitente, asunto, cuerpo completo y fecha/hora de recepción.
- Marcar correo como procesado para evitar reprocesamiento.
- Si es respuesta a hilo existente, vincular al ticket original.

---

### HU-002 — Lectura automática de WhatsApp Business [ALTA]
Como sistema de mesa de ayuda
Quiero leer mensajes nuevos de WhatsApp Business API
Para centralizar casos urgentes que llegan por WhatsApp.
Criterios:
- Integración con WhatsApp Business API.
- Registrar número, nombre (si disponible), mensaje y fecha/hora.
- Canal de uso: solo urgencias críticas.
- Marcar como procesado. Vincular si es conversación activa existente.

---

### HU-003 — Creación automática de ticket [ALTA]
Como sistema de mesa de ayuda
Quiero crear un ticket automáticamente desde cada mensaje nuevo
Para garantizar trazabilidad desde el primer segundo.
Criterios:
- Un mensaje = un ticket. Sin duplicados.
- Código único autogenerado (ej: TK-00041).
- Registrar fecha/hora de creación. Guardar contenido original.
- Canal de origen registrado: Correo / WhatsApp / Teléfono.
- Estado inicial: Nuevo.
- Notificar al equipo que hay ticket nuevo disponible.

---

### HU-004 — Detección de duplicados y seguimientos [ALTA]
Como sistema IA
Quiero detectar si un mensaje nuevo es duplicado o seguimiento de ticket existente
Para no crear tickets repetidos del mismo caso.
Criterios:
- Comparar asunto, remitente y contenido con tickets abiertos.
- Similitud >= 80%: marcar como posible duplicado y vincular automáticamente.
- El agente puede confirmar o descartar la vinculación.
- Si cliente responde ticket Resuelto o Cerrado: reapertura automática.

---

### HU-018 — Notificaciones automáticas al cliente [ALTA]
Como sistema de mesa de ayuda
Quiero notificar automáticamente al cliente en cada cambio de estado de su ticket
Para que sepa en todo momento qué pasa con su caso sin necesidad de llamar de nuevo.
Criterios:
- Ticket creado: "Recibimos su caso. Su número es #TK-XXXXX."
  Canal: correo (mismo hilo) si vino por correo / WhatsApp si vino por WhatsApp.
- En Progreso: "Su caso #TK-XXXXX está siendo atendido por [nombre agente]."
  Canal: correo siempre.
- Pendiente Cliente: "Necesitamos información adicional para su caso #TK-XXXXX."
  Canal: correo siempre.
- Resuelto: "Su caso #TK-XXXXX fue resuelto por [nombre agente]. Tiene 48h para confirmar."
  Canal: correo siempre.
- Cerrado: "Su caso #TK-XXXXX fue cerrado. Para nueva ayuda: soporte@integrens.com."
  Canal: correo siempre.
- Si ticket vino por WhatsApp: primera notif por WhatsApp + correo registrado en Integrens.
- Si ticket vino por teléfono: primera notif por correo registrado en Integrens.
- Todo seguimiento posterior siempre por correo — sin excepción.
- Plantillas de notificación configurables por Supervisor/Admin.
- Todas las notificaciones incluyen nombre del agente asignado.

---

### HU-019 — Creación manual de ticket por llamada telefónica [ALTA]
Como agente de soporte (Carlos, Antonny, Diego)
Quiero crear un ticket manualmente desde el panel cuando el cliente llama por teléfono
Para registrar el caso y que el cliente reciba su número de ticket por correo.
Criterios:
- El agente crea ticket manualmente desde el panel en cualquier momento.
- Campos obligatorios: cliente (busca en base Integrens), asunto, descripción, urgencia, módulo.
- Sistema asigna número de ticket automáticamente (ej: TK-00042).
- Canal de origen queda registrado como Teléfono.
- Sistema envía confirmación automática al correo del cliente registrado en Integrens.
- El ticket sigue el mismo flujo que cualquier otro ticket del sistema.
- El agente que crea el ticket queda como responsable inicial.

---

## ÉPICA 2 — Clasificación inteligente con IA (4 historias)

### HU-005 — Clasificación por tipo de incidencia [ALTA]
Como agente de soporte
Quiero que la IA clasifique automáticamente el tipo de problema
Para agilizar la atención sin clasificación manual.
Criterios:
- Tipos: BUG, CONSULTA, CAPACITACION, CONFIGURACION, MEJORA, ACCESO.
- Registrar nivel de confianza de la IA (porcentaje).
- El agente puede corregir la clasificación. Corrección queda en historial.

---

### HU-006 — Identificación de aplicación DACTA afectada [ALTA]
Como agente de soporte
Quiero que la IA identifique qué aplicación DACTA está afectada
Para derivar correctamente el ticket al especialista del producto.
Criterios:
- Aplicaciones: Integrens, Intelifac, Mobile.
- Campo obligatorio. El agente puede editar.

---

### HU-007 — Identificación de módulo del ERP [ALTA]
Como agente de soporte
Quiero que la IA detecte el módulo del ERP relacionado al incidente
Para facilitar soporte especializado por módulo.
Criterios:
- Identificar módulo del catálogo mantenible (ver tabla de módulos arriba).
- Catálogo ampliable por Supervisor sin redespliegue.
- El agente puede modificar. Obligatorio para BUG y CONSULTA.

---

### HU-008 — Clasificación de urgencia [ALTA]
Como agente de soporte
Quiero que la IA determine el nivel de urgencia del ticket
Para priorizar casos críticos automáticamente.
Criterios:
- Niveles: Crítica (rojo), Alta (naranja), Media (amarillo), Baja (verde).
- Considerar palabras clave y contexto del mensaje.
- Urgencia visible con color en el panel.
- Agente/Supervisor pueden cambiar. Cambio queda en historial.
- Tickets Críticos generan notificación inmediata al equipo.

---

## ÉPICA 3 — Gestión de tickets (5 historias)

### HU-009 — Panel de visualización de tickets [ALTA]
Como agente de soporte
Quiero visualizar todos los tickets en un panel web centralizado
Para gestionar incidencias desde un solo lugar sin depender del correo.
Criterios:
- Listado paginado: código, cliente, asunto, estado, urgencia (color), módulo, responsable, fecha.
- Ver cola sin asignar + mis tickets asignados.
- Panel se actualiza en tiempo real sin recargar la página.
- Colores DACTA: #2E4AF6, #6FA3B2, #003366.
- Interfaz responsiva: PC, laptop y celular.

---

### HU-010 — Tomar y asignar tickets [ALTA]
Como agente de soporte / Supervisor (Camilo Ortega FR)
Quiero tomar un ticket o asignarlo a un agente específico
Para distribuir carga y evitar que dos agentes atiendan el mismo caso.
Criterios:
- Agente toma ticket: asignado a su nombre, desaparece de cola de los demás.
- Solo el Supervisor puede reasignar tickets ya tomados.
- Registrar fecha/hora de asignación.
- Mostrar carga actual de cada agente (número de tickets activos).

---

### HU-011 — Cambio de estado del ticket [ALTA]
Como agente de soporte
Quiero actualizar el estado del ticket según el avance de la atención
Para reflejar en tiempo real el progreso de cada caso.
Criterios:
- Flujo: Nuevo → En Progreso ⇄ Pendiente Cliente → Resuelto → Cerrado → Reabierto.
- SLA se pausa en Pendiente Cliente. Se reanuda al pasar a En Progreso.
- Cierre automático tras 48h en Resuelto sin respuesta del cliente.
- Reapertura automática si cliente responde ticket Resuelto o Cerrado.
- Cada cambio registra usuario, fecha y hora en historial.

---

### HU-012 — Detalle completo del ticket [ALTA]
Como agente de soporte
Quiero ver toda la información del ticket en una sola vista
Para entender el problema sin tener que buscar en el correo.
Criterios:
- Mostrar: código, cliente, canal de origen, mensaje original completo.
- Clasificación IA: tipo, aplicación, módulo, urgencia y nivel de confianza.
- Historial completo de cambios de estado con usuario y fecha.
- Comentarios internos del equipo. Archivos adjuntos.
- Responder al cliente directamente desde el sistema.
- Notas internas visibles solo para el equipo DACTA.

---

### HU-013 — Filtros y búsqueda de tickets [ALTA]
Como agente / Supervisor
Quiero filtrar y buscar tickets por múltiples criterios incluyendo rango de fechas
Para encontrar cualquier caso rápidamente.
Criterios:
- Filtros: estado, urgencia, módulo, agente, tipo de ticket, canal de origen.
- Filtros por fecha: hoy, semana, mes, rango personalizado.
- Búsqueda por palabra clave en asunto, cliente o contenido.
- Filtros combinables. Resultado se actualiza en tiempo real.

---

## ÉPICA 4 — Dashboard gerencial (2 historias)

### HU-014 — Dashboard de métricas en tiempo real [ALTA]
Como gerencia (Sebastian Rafaile)
Quiero ver métricas del equipo de soporte en tiempo real
Para monitorear el rendimiento y tomar decisiones con datos.
Criterios:
- Métricas: tickets por estado, urgencia, módulo, agente y canal de origen.
- Tiempo promedio de resolución de tickets.
- Actualización automática sin recargar la página.
- Solo lectura — sin acceso a tickets. Colores DACTA.

---

### HU-015 — Métricas filtradas por período [ALTA]
Como gerencia (Sebastian Rafaile)
Quiero filtrar las métricas del dashboard por rango de fechas
Para analizar tendencias y comparar períodos.
Criterios:
- Filtros: hoy, semana, mes, trimestre, rango personalizado.
- Todos los gráficos se actualizan al cambiar el período.
- Mostrar comparativa vs período anterior.

---

## ÉPICA 5 — Seguridad y administración (2 historias)

### HU-016 — Inicio de sesión seguro [ALTA]
Como usuario interno DACTA (todos los roles)
Quiero iniciar sesión con mis credenciales corporativas
Para acceder al sistema según mi perfil y permisos.
Criterios:
- Login con correo corporativo + contraseña cifrada (bcrypt).
- Sesiones con token JWT. Expiración tras 8h de inactividad.
- Bloqueo automático tras 5 intentos fallidos consecutivos.
- Desbloqueo solo por Supervisor/Admin (Camilo Ortega FR).

---

### HU-017 — Control de roles y permisos [ALTA]
Como Supervisor / Admin (Camilo Ortega FR)
Quiero controlar los permisos de cada usuario según su rol
Para garantizar que cada persona acceda solo a lo que le corresponde.
Criterios:
- Roles: Agente, Supervisor/Admin, Gerencia.
- Agente: tickets sin asignar + sus tickets + responder + cambiar estado.
- Supervisor/Admin: acceso total + gestión de usuarios + configuración del sistema.
- Gerencia: solo lectura en dashboard. Sin acceso a tickets.
- Crear, editar y desactivar usuarios. Desactivado = acceso inmediato revocado.
- Permisos asignados por rol — no por usuario individual.

---

## HISTORIAS TÉCNICAS

| Código | Descripción | Épicas que habilita |
|---|---|---|
| HT-001 | Configuración Gmail API | Épica 1 |
| HT-002 | Configuración WhatsApp Business API | Épica 1 |
| HT-003 | Configuración Claude API (Anthropic) | Épica 2 |
| HT-004 | Base de datos PostgreSQL + modelos de datos | Épicas 1, 2, 3 |
| HT-005 | Estructura base Spring Boot — controllers, services, repositories | Épicas 1-5 |
| HT-006 | Frontend React + Tailwind CSS con colores DACTA | Épicas 3, 4, 5 |
| HT-007 | Autenticación JWT + control de sesiones | Épica 5 |
| HT-008 | Sistema de logs y auditoría del sistema | Épicas 1-5 |
| HT-009 | Pipeline CI/CD GitLab DACTA | Épicas 1-5 |

---

## CRITERIOS QA CLAVE

- Un correo o mensaje = un ticket. Duplicado detectado = vinculado, no nuevo ticket.
- IA clasifica en menos de 30 segundos desde recepción del mensaje.
- Dos agentes no pueden tomar el mismo ticket simultáneamente.
- SLA se pausa en Pendiente Cliente. Se reanuda en En Progreso.
- Cierre automático a las 48h exactas en estado Resuelto.
- Notificación automática al cliente en cada cambio de estado.
- Todo seguimiento al cliente siempre por correo — sin excepción.
- Rol Gerencia no puede modificar tickets — solo lectura.
- Cuenta bloqueada tras 5 intentos fallidos de login.
- Interfaz responsiva verificada en PC y celular.

---

## DEFINITION OF DONE (DoD)

### Por Historia de Usuario
- Código compila sin errores.
- Todos los criterios de aceptación implementados y verificados.
- Casos QA correspondientes pasan correctamente.
- Estándares DACTA respetados: M-O-DES-001, M-O-DES-002, M-O-DES-003.
- Colores DACTA aplicados: #2E4AF6 / #6FA3B2 / #003366.
- Interfaz responsiva verificada en PC y celular.
- Notificaciones al cliente funcionando para la HU correspondiente.
- Aprobado por Orquestador Camilo Ortega FR.

### Por Épica
- Todas las HUs de la épica cerradas y aprobadas.
- Historias técnicas de soporte implementadas.
- Sin regresiones — lo anterior sigue funcionando.
- Mergeado en rama develop en GitLab DACTA.
- Orquestador aprobó demo de la épica completa.

### MVP v1.0 listo
- 5 épicas cerradas. 9 historias técnicas implementadas.
- Carlos, Antonny y Diego probaron el panel en sus equipos.
- Sebastian Rafaile aprobó el dashboard.
- Sistema corriendo en servidor interno DACTA.
- Camilo Ortega FR aprobó la demo completa (FASE 5).

---

## COLORES OFICIALES DACTA

| Nombre | HEX | Uso |
|---|---|---|
| Azul principal | #2E4AF6 | Botones y acciones principales |
| Azul acero | #6FA3B2 | Elementos secundarios e iconos |
| Azul marino | #003366 | Sidebar, cabeceras y menú |

---

## RESTRICCIONES PARA AGENTES IA

- NUNCA generar código sin HU y criterios de aceptación aprobados en este documento.
- SIEMPRE respetar estándares: M-O-DES-001, M-O-DES-002, M-O-DES-003.
- SIEMPRE usar colores DACTA en el frontend.
- SIEMPRE respetar la política de canales — seguimiento siempre por correo.
- SIEMPRE esperar aprobación del Orquestador antes de avanzar a la siguiente tarea.
- El Orquestador es Camilo Ortega FR — QE / SDD — DACTA S.A.C.

---

*DACTA S.A.C. — Documento controlado*
*Acceso: solo red interna DACTA*
*SPEC-001 v1.1 — 2026-05-31 — 19 HUs + 9 HTs*