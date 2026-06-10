import { useState, useEffect, useRef } from 'react'

const ESTADOS_OPTS   = ['NUEVO', 'EN_PROGRESO', 'PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO', 'REABIERTO']
const URGENCIAS_OPTS = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA']
const CANALES_OPTS   = ['CORREO', 'WHATSAPP', 'MANUAL', 'INTEGRENS_ERP', 'TELEFONO']
const TIPOS_OPTS     = ['BUG', 'CONSULTA', 'MEJORA', 'SOLICITUD']
const MODULOS_OPTS   = ['FIN-FAC', 'CMR-POS', 'LOG-ALM', 'FIN-CON', 'FIN-TES', 'CMR-VEN', 'SCM-COM', 'RHH-PLA']
const AGENTES_OPTS   = ['Carlos Saenz', 'Antonny Rafaile', 'Diego Torres']

const ESTADO_LABEL   = { NUEVO: 'Nuevo', EN_PROGRESO: 'En progreso', PENDIENTE_CLIENTE: 'Pendiente', RESUELTO: 'Resuelto', CERRADO: 'Cerrado', REABIERTO: 'Reabierto' }
const URGENCIA_LABEL = { CRITICA: 'Crítica', ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja' }
const CANAL_LABEL    = { CORREO: 'Correo', WHATSAPP: 'WhatsApp', MANUAL: 'Manual', INTEGRENS_ERP: 'ERP', TELEFONO: 'Teléfono' }

const VACIO = { busqueda: '', estado: '', urgencia: '', modulo: '', agente: '', canal: '', tipo: '', fechaDesde: '', fechaHasta: '' }

const SEL = {
  width: '100%',
  height: 44,
  border: '1.5px solid #DDD9F5',
  borderRadius: 10,
  padding: '0 12px',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 13,
  color: '#4A4560',
  background: '#fff',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

const LABEL_ST = { display: 'block', fontSize: 12, fontWeight: 800, color: '#4A4560', marginBottom: 7 }

function buildChips(f) {
  const chips = []
  if (f.estado)     chips.push({ key: 'estado',    label: `Estado: ${ESTADO_LABEL[f.estado] ?? f.estado}` })
  if (f.urgencia)   chips.push({ key: 'urgencia',  label: `Urgencia: ${URGENCIA_LABEL[f.urgencia] ?? f.urgencia}` })
  if (f.modulo)     chips.push({ key: 'modulo',    label: `Módulo: ${f.modulo}` })
  if (f.agente)     chips.push({ key: 'agente',    label: `Agente: ${f.agente}` })
  if (f.canal)      chips.push({ key: 'canal',     label: `Canal: ${CANAL_LABEL[f.canal] ?? f.canal}` })
  if (f.tipo)       chips.push({ key: 'tipo',      label: `Tipo: ${f.tipo}` })
  if (f.fechaDesde) chips.push({ key: 'fechaDesde', label: `Desde: ${f.fechaDesde}` })
  if (f.fechaHasta) chips.push({ key: 'fechaHasta', label: `Hasta: ${f.fechaHasta}` })
  return chips
}

export default function FiltrosTickets({ filtros, totalItems, onChange }) {
  const [local, setLocal] = useState({ ...VACIO, ...filtros })
  const debounceRef = useRef(null)

  function set(campo, valor) {
    const next = { ...local, [campo]: valor }
    setLocal(next)
    if (campo === 'busqueda') {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onChange(next), 500)
    } else {
      clearTimeout(debounceRef.current)
      onChange(next)
    }
  }

  function limpiar() {
    setLocal(VACIO)
    clearTimeout(debounceRef.current)
    onChange(VACIO)
  }

  const chips     = buildChips(local)
  const hayFiltros = chips.length > 0 || local.busqueda

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EEEAFF',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(91,51,212,0.07)',
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid #EEEAFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E1B2E' }}>
            Filtros avanzados
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8B87A8' }}>
            HU-013 — búsqueda combinable con debounce 500ms
          </p>
        </div>
        {hayFiltros && (
          <button
            onClick={limpiar}
            style={{
              height: 38, padding: '0 16px', borderRadius: 10,
              background: '#fff', color: '#4A4560',
              border: '1.5px solid #DDD9F5', fontSize: 13,
              fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD9F5'; e.currentTarget.style.color = '#4A4560' }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid de filtros */}
      <div style={{
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}>
        {/* Búsqueda libre — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL_ST}>Búsqueda libre</label>
          <input
            type="text"
            value={local.busqueda}
            onChange={e => set('busqueda', e.target.value)}
            placeholder="Buscar por asunto, cliente, código, módulo…"
            style={{
              ...SEL,
              height: 44,
              padding: '0 14px',
              color: '#1E1B2E',
            }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          />
        </div>

        {/* Estado */}
        <div>
          <label style={LABEL_ST}>Estado</label>
          <select
            value={local.estado}
            onChange={e => set('estado', e.target.value)}
            style={{ ...SEL, color: local.estado ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          >
            <option value="">Todos los estados</option>
            {ESTADOS_OPTS.map(o => <option key={o} value={o}>{ESTADO_LABEL[o]}</option>)}
          </select>
        </div>

        {/* Urgencia */}
        <div>
          <label style={LABEL_ST}>Urgencia</label>
          <select
            value={local.urgencia}
            onChange={e => set('urgencia', e.target.value)}
            style={{ ...SEL, color: local.urgencia ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          >
            <option value="">Toda urgencia</option>
            {URGENCIAS_OPTS.map(o => <option key={o} value={o}>{URGENCIA_LABEL[o]}</option>)}
          </select>
        </div>

        {/* Módulo */}
        <div>
          <label style={LABEL_ST}>Módulo</label>
          <select
            value={local.modulo}
            onChange={e => set('modulo', e.target.value)}
            style={{ ...SEL, color: local.modulo ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          >
            <option value="">Todos los módulos</option>
            {MODULOS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Agente */}
        <div>
          <label style={LABEL_ST}>Agente</label>
          <select
            value={local.agente}
            onChange={e => set('agente', e.target.value)}
            style={{ ...SEL, color: local.agente ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          >
            <option value="">Todos los agentes</option>
            {AGENTES_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Canal */}
        <div>
          <label style={LABEL_ST}>Canal</label>
          <select
            value={local.canal}
            onChange={e => set('canal', e.target.value)}
            style={{ ...SEL, color: local.canal ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          >
            <option value="">Todos los canales</option>
            {CANALES_OPTS.map(o => <option key={o} value={o}>{CANAL_LABEL[o]}</option>)}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label style={LABEL_ST}>Tipo</label>
          <select
            value={local.tipo}
            onChange={e => set('tipo', e.target.value)}
            style={{ ...SEL, color: local.tipo ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          >
            <option value="">Todos los tipos</option>
            {TIPOS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Fecha desde */}
        <div>
          <label style={LABEL_ST}>Fecha desde</label>
          <input
            type="date"
            value={local.fechaDesde}
            onChange={e => set('fechaDesde', e.target.value)}
            style={{ ...SEL, color: local.fechaDesde ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label style={LABEL_ST}>Fecha hasta</label>
          <input
            type="date"
            value={local.fechaHasta}
            onChange={e => set('fechaHasta', e.target.value)}
            style={{ ...SEL, color: local.fechaHasta ? '#1E1B2E' : '#8B87A8' }}
            onFocus={e => e.target.style.borderColor = '#5B33D4'}
            onBlur={e => e.target.style.borderColor = '#DDD9F5'}
          />
        </div>
      </div>

      {/* Chips de filtros activos */}
      {chips.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '0 24px 16px' }}>
          {chips.map(c => (
            <span key={c.key} style={{
              background: '#EDE8FB', color: '#5B33D4',
              borderRadius: 999, padding: '5px 10px',
              fontSize: 12, fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {c.label}
              <button
                onClick={() => set(c.key, '')}
                style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0, lineHeight: 1,
                  color: '#5B33D4', fontSize: 13, fontWeight: 800,
                }}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Footer con resultado */}
      <div style={{
        borderTop: '1px solid #EEEAFF',
        padding: '14px 24px',
        background: '#F8F7FF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 13,
      }}>
        <strong style={{ color: '#1E1B2E' }}>
          {totalItems != null ? `${totalItems} ticket${totalItems !== 1 ? 's' : ''} encontrados` : 'Cargando…'}
        </strong>
        <span style={{ color: '#8B87A8' }}>
          Resultados en tiempo real sin recargar la página.
        </span>
      </div>
    </div>
  )
}
