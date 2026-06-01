# TASKS — ÉPICA 4: DASHBOARD GERENCIAL
# DACTA Help Desk IA v1.0
# Tareas: TASK-048 a TASK-050
# Orquestador: Camilo Ortega FR
# Referencia: SPEC-001 v1.1 HU-014, HU-015

---

### TASK-048 — Crear MetricasController — endpoint métricas
**Archivo:** `backend/.../controller/MetricasController.java`
**Acción:**
GET /api/metricas (SUPERVISOR o GERENCIA):
Parámetros: fechaDesde, fechaHasta
Retorna:
{
  totalTickets, porEstado, porUrgencia, porModulo, porCanal,
  porAgente: [{ nombre, totalTickets, ticketsActivos,
    frtPromedioMinutos, ttrPromedioHoras, handleTimePromedioHoras }],
  frtEquipoPromedioMinutos,
  ttrEquipoPromedioHoras,
  comparativaPeriodoAnterior: { variacion }
}

Cálculos (descontando minutos_pausado):
- FRT = dt_primer_respuesta − dt_creado
- TTR = dt_resuelto − dt_creado − minutos_pausado
- Handle Time = dt_resuelto − dt_asignado − minutos_pausado
**Verificación:** GET /api/metricas retorna FRT, TTR y Handle Time calculados.

---

### TASK-049 — Crear DashboardPage.jsx
**Archivo:** `frontend/src/pages/DashboardPage.jsx`
**Referencia visual:** docs/ux/UX-007-dashboard-gerencial.html
**Acción:**
Replicar mockup UX-007:
- 4 tarjetas resumen: Total tickets, Críticos,
  FRT promedio equipo, TTR promedio equipo
- Gráfico barras: tickets por módulo (Recharts, #5B33D4)
- Gráfico torta: distribución por urgencia
- Gráfico líneas: evolución tickets por día
- Tabla agentes: Carlos/Antonny/Diego con
  tickets resueltos, FRT, TTR, Handle Time + barras progreso
- Selector período: Hoy, Semana, Mes, Trimestre, Personalizado
- Actualización automática cada 60 segundos
- Solo lectura — sin botones de acción
- Colores Integrens: #5B33D4 principal
**Verificación:** Dashboard carga métricas reales. Filtro período funciona.

---

### TASK-050 — Commit Épica 4
```
git add backend/ frontend/
git commit -m "feat(epica4): dashboard gerencial metricas FRT TTR por agente"
git push origin develop
```

---
*ÉPICA 4 completa → siguiente: TASKS-EPICA-5-seguridad.md*
