import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

/* ─── Configuración de colores ─────────────────────── */
const URGENCIA = {
  CRITICA: { bg: '#FEE2E2', color: '#DC2626', label: 'Crítica' },
  ALTA:    { bg: '#FFEDD5', color: '#EA580C', label: 'Alta' },
  MEDIA:   { bg: '#FEF9C3', color: '#CA8A04', label: 'Media' },
  BAJA:    { bg: '#DCFCE7', color: '#16A34A', label: 'Baja' },
}

const ESTADO = {
  NUEVO:               { bg: '#E0F7FB', color: '#0E7FA8', label: 'Nuevo' },
  EN_PROGRESO:         { bg: '#EDE8FB', color: '#5B33D4', label: 'En progreso' },
  PENDIENTE_CLIENTE:   { bg: '#FFEDD5', color: '#EA580C', label: 'Pendiente' },
  RESUELTO:            { bg: '#DCFCE7', color: '#16A34A', label: 'Resuelto' },
  CERRADO:             { bg: '#F1F0F8', color: '#6B6890', label: 'Cerrado' },
  REABIERTO:           { bg: '#FEE2E2', color: '#DC2626', label: 'Reabierto' },
}

const CANAL_ICON = {
  CORREO:        '✉',
  WHATSAPP:      '💬',
  MANUAL:        '📋',
  INTEGRENS_ERP: '🔧',
  TELEFONO:      '📞',
}

function Badge({ cfg, small }) {
  return (
    <span style={{
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 20,
      fontSize: small ? 10 : 11,
      fontWeight: 600,
      background: cfg?.bg ?? '#F1F0F8',
      color: cfg?.color ?? '#6B6890',
      whiteSpace: 'nowrap',
    }}>
      {cfg?.label ?? '—'}
    </span>
  )
}

export default function TicketCard({ ticket }) {
  const navigate = useNavigate()
  const urg   = URGENCIA[ticket.urgencia] ?? URGENCIA.MEDIA
  const est   = ESTADO[ticket.estado]    ?? ESTADO.NUEVO

  const fecha = ticket.dtCreado
    ? formatDistanceToNow(new Date(ticket.dtCreado), { addSuffix: true, locale: es })
    : '—'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      onKeyDown={e => e.key === 'Enter' && navigate(`/tickets/${ticket.id}`)}
      style={{
        background: '#fff',
        border: '1px solid #EEEAFF',
        borderRadius: 12,
        padding: '14px 20px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto auto',
        alignItems: 'center',
        gap: 16,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#5B33D4'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(91,51,212,0.10)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#EEEAFF'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Código + canal */}
      <div style={{ minWidth: 90 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#5B33D4', letterSpacing: '0.01em' }}>
          {ticket.codigo}
        </div>
        <div style={{ fontSize: 11, color: '#8B87A8', marginTop: 2 }}>
          {CANAL_ICON[ticket.canalOrigen] ?? '📋'} {ticket.canalOrigen?.toLowerCase() ?? '—'}
        </div>
      </div>

      {/* Cliente + asunto */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1E1B2E', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ticket.asunto}
        </div>
        <div style={{ fontSize: 12, color: '#8B87A8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ticket.nombreCliente ?? ticket.correoCliente}
          {ticket.nombreModulo && (
            <span style={{ marginLeft: 8, padding: '1px 7px', borderRadius: 10, background: '#F2F0FE', color: '#5B33D4', fontSize: 10, fontWeight: 600 }}>
              {ticket.nombreModulo}
            </span>
          )}
        </div>
      </div>

      {/* Urgencia */}
      <Badge cfg={urg} />

      {/* Estado */}
      <Badge cfg={est} />

      {/* Agente + fecha */}
      <div style={{ textAlign: 'right', minWidth: 110 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#4A4560', whiteSpace: 'nowrap' }}>
          {ticket.nombreAgente ?? (
            <span style={{ color: '#38C1E1', fontStyle: 'italic' }}>Sin asignar</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#8B87A8', marginTop: 2 }}>{fecha}</div>
      </div>

      {/* Badge IA */}
      <div style={{ minWidth: 28 }}>
        {ticket.revisadoIa && (
          <span title="Clasificado por IA" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: '50%',
            background: 'rgba(91,51,212,0.10)',
            fontSize: 11, fontWeight: 700, color: '#5B33D4',
          }}>
            IA
          </span>
        )}
      </div>
    </div>
  )
}
