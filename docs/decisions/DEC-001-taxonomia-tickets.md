# DEC-001 — Taxonomía de clasificación de tickets
# Fecha: 2026-05-31
# Aprobado por: Camilo Ortega — Orquestador SDD
# Estado: APROBADO

---

## Contexto

El sistema necesita capturar datos estructurados en cada ticket
para responder preguntas clave de negocio:
- ¿Qué cliente nos demanda más soporte?
- ¿Qué aplicación genera más tickets?
- ¿Qué módulo falla más?
- ¿Qué tipo de problema atendemos más?
- ¿Qué agente atiende más casos?

## Decisión

Cada ticket captura obligatoriamente 4 dimensiones:

---

### DIMENSIÓN 1 — Tipo de problema

| Código | Tipo | Descripción |
|---|---|---|
| BUG | Error del sistema | El software falla, se congela o da error |
| DAT | Problema de datos | Data incorrecta, duplicada o faltante |
| USR | Error del usuario | El usuario opera incorrectamente |
| CON | Consulta de uso | Pregunta sobre cómo usar el sistema |
| CAP | Capacitación | Necesita formación en el sistema |
| PER | Problema de permisos | Accesos, usuarios, perfiles |
| INT | Problema de integración | Fallo entre sistemas |
| INF | Solicitud de información | Reportes, consultas de negocio |

---

### DIMENSIÓN 2 — Aplicación DACTA

| Código | Aplicación |
|---|---|
| ECS | ERP Integrens Cliente-Servidor |
| EWB | ERP Integrens Web |
| MOV | App Mobile |
| IFC | Intelifac — comprobantes electrónicos SUNAT |
| OTR | Otra / No identificada |

---

### DIMENSIÓN 3 — Módulo de Integrens

| Código | Módulo |
|---|---|
| POS | Punto de Venta / Caja |
| ALM | Almacén / Inventario |
| FAC | Facturación electrónica |
| COM | Compras |
| VEN | Ventas |
| LOG | Logística / Distribución |
| FIN | Finanzas / Contabilidad |
| RHH | Recursos Humanos |
| CFG | Configuración / Administración |
| OTR | Otro / No identificado |

---

### DIMENSIÓN 4 — Urgencia

| Nivel | Criterio | Tiempo máximo respuesta |
|---|---|---|
| CRITICA | Operación detenida — todas las tiendas afectadas | 1 hora |
| ALTA | Operación parcialmente afectada | 4 horas |
| MEDIA | Problema con solución alternativa | 24 horas |
| BAJA | Consulta o mejora no urgente | 72 horas |

---

## Reglas de negocio especiales

1. Tickets de Intelifac (IFC) tienen urgencia mínima ALTA
   por defecto — impacta emisión de comprobantes ante SUNAT.

2. Tickets con BUG + todas las tiendas afectadas →
   urgencia automática CRITICA.

3. Al cerrar un ticket el agente debe documentar:
   - Causa raíz del problema
   - Solución aplicada
   - ¿Es evitable con mejor testing?

---

## Impacto en el sistema

- Base de datos: tabla hd_ticket debe incluir columnas
  para las 4 dimensiones
- Claude API: debe clasificar las 4 dimensiones al leer
  cada correo entrante
- Dashboard: reportes agrupados por cada dimensión

---
*Decisión registrada como parte de la FASE 0 del proyecto*
*No modificar sin aprobación del Orquestador*