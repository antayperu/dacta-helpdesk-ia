import { useQuery } from '@tanstack/react-query'
import { obtenerTickets } from '../../services/ticketService'

const AGENTES = ['Carlos Saenz', 'Antonny Rafaile', 'Diego Torres']

const URGENCIA_COLOR = { CRITICA: '#EF4444', ALTA: '#EA580C', MEDIA: '#CA8A04', BAJA: '#16A34A' }
const ESTADO_ACTIVO  = new Set(['NUEVO', 'EN_PROGRESO', 'PENDIENTE_CLIENTE', 'REABIERTO'])

function Avatar({ nombre }) {
  const iniciales = nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'linear-gradient(135deg, #453E72, #5B33D4)',
      color: '#fff', fontSize: 13, fontWeight: 800,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {iniciales}
    </div>
  )
}

function BarraCarga({ porcentaje }) {
  const color = porcentaje > 80 ? '#EF4444' : porcentaje > 50 ? '#EA580C' : '#5B33D4'
  return (
    <div style={{ height: 6, background: '#F2F0FE', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(100, porcentaje)}%`,
        background: color, borderRadius: 999,
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

function FilaAgente({ nombre, tickets, maxTickets }) {
  const activos     = tickets.filter(t => ESTADO_ACTIVO.has(t.estado))
  const criticos    = activos.filter(t => t.urgencia === 'CRITICA')
  const porcentaje  = maxTickets > 0 ? Math.round((activos.length / maxTickets) * 100) : 0

  const estadoLabel = activos.length === 0 ? 'Libre'
    : criticos.length > 0 ? 'Crítico'
    : activos.length > 5  ? 'Cargado'
    : 'Normal'

  const estadoColor = activos.length === 0 ? '#16A34A'
    : criticos.length > 0 ? '#DC2626'
    : activos.length > 5  ? '#EA580C'
    : '#5B33D4'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr auto',
      alignItems: 'center',
      gap: 12,
      padding: '14px 0',
      borderBottom: '1px solid #F2F0FE',
    }}>
      <Avatar nombre={nombre} />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B2E' }}>{nombre}</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: estadoColor,
            background: `${estadoColor}18`, borderRadius: 999, padding: '2px 8px',
          }}>
            {estadoLabel}
          </span>
        </div>
        <BarraCarga porcentaje={porcentaje} />
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: '#8B87A8' }}>
          <span><strong style={{ color: '#1E1B2E' }}>{activos.length}</strong> activos</span>
          {criticos.length > 0 && (
            <span style={{ color: '#DC2626', fontWeight: 700 }}>
              ⚠ {criticos.length} crítico{criticos.length !== 1 ? 's' : ''}
            </span>
          )}
          <span><strong style={{ color: '#1E1B2E' }}>{tickets.filter(t => t.estado === 'RESUELTO').length}</strong> resueltos</span>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#5B33D4', lineHeight: 1 }}>
          {activos.length}
        </div>
        <div style={{ fontSize: 10, color: '#8B87A8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          tickets
        </div>
      </div>
    </div>
  )
}

export default function CargaAgentesPanel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', {}, 0],
    queryFn: () => obtenerTickets({}, 0, 100),
    staleTime: 30_000,
  })

  const tickets = data?.content ?? []

  const porAgente = AGENTES.map(nombre => ({
    nombre,
    tickets: tickets.filter(t => t.nombreAgente === nombre),
  }))

  const maxTickets = Math.max(...porAgente.map(a => a.tickets.filter(t => ESTADO_ACTIVO.has(t.estado)).length), 1)

  if (isLoading) {
    return (
      <div style={{
        background: '#fff', border: '1px solid #EEEAFF', borderRadius: 16,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ height: 20, width: 180, borderRadius: 8, background: '#F2F0FE', marginBottom: 16, animation: 'shimmer 1.5s infinite' }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 72, borderRadius: 10, background: '#F2F0FE', marginBottom: 12, animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    )
  }

  if (isError) return null

  const totalActivos = porAgente.reduce((s, a) => s + a.tickets.filter(t => ESTADO_ACTIVO.has(t.estado)).length, 0)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EEEAFF',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(91,51,212,0.06)',
      overflow: 'hidden',
      marginBottom: 24,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #EEEAFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E1B2E' }}>
            Carga del equipo
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#8B87A8' }}>
            {totalActivos} ticket{totalActivos !== 1 ? 's' : ''} activos en total
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 700, color: '#5B33D4',
          background: '#EDE8FB', borderRadius: 999, padding: '4px 10px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B33D4', display: 'inline-block' }} />
          {AGENTES.length} agentes
        </div>
      </div>

      {/* Filas */}
      <div style={{ padding: '0 24px' }}>
        {porAgente.map((a, i) => (
          <FilaAgente
            key={a.nombre}
            nombre={a.nombre}
            tickets={a.tickets}
            maxTickets={maxTickets}
          />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-color: #F2F0FE; }
          50%  { background-color: #E9E7FF; }
          100% { background-color: #F2F0FE; }
        }
      `}</style>
    </div>
  )
}
