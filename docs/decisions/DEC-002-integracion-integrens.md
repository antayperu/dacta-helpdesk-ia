# DEC-002 — Integración futura con ERP Integrens
# DACTA Help Desk IA v1.0
# Fecha: 2026-05-31
# Orquestador: Camilo Ortega FR — QE / SDD
# Estado: APROBADO — Documentado para v2.0

---

## Contexto

El ERP Integrens es el producto principal de DACTA S.A.C.
Los usuarios del ERP (clientes de DACTA) son quienes generan la mayoría
de tickets de soporte. Actualmente reportan sus incidentes por correo
o WhatsApp — sin contexto técnico del sistema.

## Decisión

Diseñar el endpoint de creación de tickets para aceptar
datos opcionales de contexto del ERP Integrens desde v1.0,
de modo que cuando se implemente el botón "Reportar incidente"
en el ERP (v2.0), el Help Desk ya esté listo sin modificaciones.

## Implementación v1.0 — Preparación silenciosa

El endpoint POST /api/tickets/manual acepta campos opcionales:

```json
{
  "correoCliente": "usuario@empresa.com",
  "asunto": "Error al generar factura",
  "descripcion": "El sistema no genera el PDF",
  "urgencia": "ALTA",
  "idModulo": 5,

  // Campos opcionales — integración Integrens (v2.0)
  "origenSistema": "INTEGRENS_ERP",
  "moduloErp": "FIN-FAC",
  "versionErp": "5.2.1",
  "usuarioErp": "vendedor@cliente.com",
  "empresaCliente": "Distribuidora Lima SAC",
  "accionRealizada": "Generando factura electrónica",
  "urlPantalla": "/facturacion/emitir",
  "screenshotBase64": "data:image/png;base64,..."
}
```

Si los campos opcionales vienen → ticket creado con contexto completo del ERP.
Si no vienen → funciona igual que hoy (ticket manual normal).

## Flujo futuro v2.0 — Botón en Integrens

```
Usuario en Integrens encuentra un error
        ↓
Hace clic en "Reportar incidente" (botón en el ERP)
        ↓
Sistema captura automáticamente:
  - Módulo activo (POS, Almacén, Facturación...)
  - Usuario logueado en Integrens
  - Versión del ERP
  - URL de la pantalla actual
  - Captura de pantalla automática
        ↓
Se abre formulario pre-llenado — usuario solo describe el problema
        ↓
Click Enviar → POST a /api/tickets/manual con contexto completo
        ↓
Ticket creado en Help Desk con TODO el contexto
Agente recibe: módulo, pantalla, usuario, versión — sin preguntar nada
```

## Roadmap de integración

| Versión | Funcionalidad | Estado |
|---|---|---|
| v1.0 MVP | Endpoint preparado para recibir contexto ERP | Implementado (campos opcionales) |
| v2.0 | Botón "Reportar incidente" en Integrens web | Planificado |
| v2.0 | Captura automática de pantalla desde el ERP | Planificado |
| v3.0 | Integración bidireccional — Help Desk actualiza estado en Integrens | Visión futura |
| v3.0 | Dashboard de incidentes por cliente dentro del ERP | Visión futura |

## Impacto en el equipo de desarrollo

- **Help Desk IA:** Agregar campos opcionales al DTO de creación manual (TASK-018).
  Sin cambios en la lógica de negocio — los campos son opcionales.
- **Equipo Integrens:** En v2.0 agregar botón que llame al endpoint con el contexto.
  No requiere cambios en el Help Desk cuando se implemente.

## Beneficio para DACTA

| Antes (v1.0) | Después (v2.0) |
|---|---|
| Cliente escribe correo describiendo el error | Cliente hace clic en "Reportar" dentro del ERP |
| Agente pregunta: ¿en qué módulo? ¿qué versión? | Agente recibe: módulo, pantalla, versión, captura |
| Tiempo de diagnóstico: 15-30 minutos | Tiempo de diagnóstico: 2-5 minutos |
| Cliente frustrante describiendo pasos | Evidencia visual automática |

---

*DACTA S.A.C. — Documento controlado*
*DEC-002 v1.0 — 2026-05-31 — Orquestador: Camilo Ortega FR*
