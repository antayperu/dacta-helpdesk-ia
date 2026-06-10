import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { obtenerTicketDetalle, reabrirTicket, cambiarEstado } from '../services/ticketService'
import { getRol, getUsuarioActual } from '../services/authService'

/* ─── Configuraciones visuales ─────────────────────── */
const URGENCIA = {
  CRITICA: { bg: '#FEE2E2', color: '#DC2626', label: 'Crítica' },
  ALTA:    { bg: '#FFEDD5', color: '#EA580C', label: 'Alta' },
  MEDIA:   { bg: '#FEF9C3', color: '#CA8A04', label: 'Media' },
  BAJA:    { bg: '#DCFCE7', color: '#16A34A', label: 'Baja' },
}
const ESTADO = {
  NUEVO:             { bg: '#E0F7FB', color: '#0E7FA8', label: 'Nuevo' },
  EN_PROGRESO:       { bg: '#EDE8FB', color: '#5B33D4', label: 'En progreso' },
  PENDIENTE_CLIENTE: { bg: '#FFEDD5', color: '#EA580C', label: 'Pendiente cliente' },
  RESUELTO:          { bg: '#DCFCE7', color: '#16A34A', label: 'Resuelto' },
  CERRADO:           { bg: '#F1F0F8', color: '#6B6890', label: 'Cerrado' },
  REABIERTO:         { bg: '#FEE2E2', color: '#DC2626', label: 'Reabierto' },
}
const CANAL_ICON  = { CORREO: '✉', WHATSAPP: '💬', MANUAL: '📋', INTEGRENS_ERP: '🔧', TELEFONO: '📞' }
const ESTADOS_CAMBIO = ['NUEVO', 'EN_PROGRESO', 'PENDIENTE_CLIENTE', 'RESUELTO']

/* ─── Componentes pequeños ─────────────────────────── */
function Badge({ cfg }) {
  return (
    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg?.bg ?? '#F1F0F8', color: cfg?.color ?? '#6B6890' }}>
      {cfg?.label ?? '—'}
    </span>
  )
}
function Card({ title, icon, children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EEEAFF', borderRadius: 12, overflow: 'hidden', ...style }}>
      {title && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #EEEAFF', display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B2E' }}>{title}</span>
        </div>
      )}
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}
function Campo({ label, valor, mono }) {
  if (!valor) return null
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#8B87A8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#1E1B2E', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-word' }}>{valor}</div>
    </div>
  )
}

/* ─── Barra de confianza IA ────────────────────────── */
function BarraConfianza({ valor }) {
  const pct = Math.round((valor ?? 0) * 100)
  const color = pct >= 80 ? '#22C55E' : pct >= 50 ? '#EAB308' : '#EF4444'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#8B87A8' }}>Confianza</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: '#F2F0FE', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

/* ─── Timeline de estados ──────────────────────────── */
function TimelineItem({ estadoNuevo, estadoAnterior, comentario, dtCambio, usuario, isLast }) {
  const est = ESTADO[estadoNuevo]
  const fecha = dtCambio ? format(new Date(dtCambio), "d MMM yyyy 'a las' HH:mm", { locale: es }) : '—'
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 20, position: 'relative' }}>
      {!isLast && <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, background: '#EEEAFF' }} />}
      <div style={{ width: 24, height: 24, borderRadius: '50%', background: est?.bg ?? '#F2F0FE', border: `2px solid ${est?.color ?? '#DDD9F5'}`, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
          <Badge cfg={est} />
          {estadoAnterior && <span style={{ fontSize: 11, color: '#8B87A8' }}>← {ESTADO[estadoAnterior]?.label ?? estadoAnterior}</span>}
        </div>
        {comentario && <p style={{ fontSize: 12, color: '#4A4560', margin: '4px 0' }}>{comentario}</p>}
        <div style={{ fontSize: 11, color: '#8B87A8' }}>
          {fecha}{usuario && ` · ${usuario}`}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════ */
export default function TicketDetallePage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const rol          = getRol()
  const usuario      = getUsuarioActual()

  const [nuevoEstado,  setNuevoEstado]  = useState('')
  const [comentCambio, setComentCambio] = useState('')
  const [motivoReabrir, setMotivoReabrir] = useState('')
  const [mostrarReabrir, setMostrarReabrir] = useState(false)

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => obtenerTicketDetalle(id),
  })

  const mutCambioEstado = useMutation({
    mutationFn: () => cambiarEstado(id, nuevoEstado, comentCambio),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id])
      queryClient.invalidateQueries(['tickets'])
      setNuevoEstado(''); setComentCambio('')
    },
  })

  const mutReabrir = useMutation({
    mutationFn: () => reabrirTicket(id, motivoReabrir),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id])
      queryClient.invalidateQueries(['tickets'])
      setMostrarReabrir(false); setMotivoReabrir('')
    },
  })

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ height: 24, width: 200, borderRadius: 8, background: '#F2F0FE', marginBottom: 24, animation: 'shimmer 1.5s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {[300, 200, 400].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 12, background: '#F2F0FE', animation: 'shimmer 1.5s infinite', animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !ticket) {
    return (
      <div style={{ textAlign: 'center', padding: 64 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E1B2E', marginBottom: 8 }}>Ticket no encontrado</h2>
        <button onClick={() => navigate('/tickets')} style={{ padding: '8px 20px', borderRadius: 8, background: '#5B33D4', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Volver al panel
        </button>
      </div>
    )
  }

  const urg = URGENCIA[ticket.urgencia] ?? URGENCIA.MEDIA
  const est = ESTADO[ticket.estado]    ?? ESTADO.NUEVO
  const puedeReabrir = ticket.estado === 'RESUELTO' || ticket.estado === 'CERRADO'
  const puedeModificar = rol === 'SUPERVISOR' || (ticket.agente && ticket.agente.correo === usuario?.correo)
  const historial = ticket.historial ?? []
  const comentarios = ticket.comentarios ?? []

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif", animation: 'fadeIn 0.4s ease' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#8B87A8' }}>
        <button onClick={() => navigate('/tickets')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5B33D4', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>
          ← Panel de Tickets
        </button>
        <span>/</span>
        <span style={{ color: '#1E1B2E', fontWeight: 600 }}>{ticket.codigo}</span>
      </div>

      {/* ── Cabecera del ticket ── */}
      <div style={{ background: '#fff', border: '1px solid #EEEAFF', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#5B33D4', letterSpacing: '0.02em' }}>{ticket.codigo}</span>
              <Badge cfg={est} />
              <Badge cfg={urg} />
              <span style={{ fontSize: 12, color: '#8B87A8', display: 'flex', alignItems: 'center', gap: 4 }}>
                {CANAL_ICON[ticket.canalOrigen] ?? '📋'} {ticket.canalOrigen}
              </span>
              {ticket.revisadoIa && (
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(91,51,212,0.08)', color: '#5B33D4', border: '1px solid rgba(91,51,212,0.15)' }}>🤖 IA</span>
              )}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1E1B2E', marginBottom: 6, lineHeight: 1.3 }}>{ticket.asunto}</h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#8B87A8' }}>
              {ticket.dtCreado && <span>Creado: {format(new Date(ticket.dtCreado), "d MMM yyyy, HH:mm", { locale: es })}</span>}
              {ticket.dtAsignado && <span>· Asignado: {format(new Date(ticket.dtAsignado), "d MMM yyyy", { locale: es })}</span>}
              {ticket.dtResuelto && <span>· Resuelto: {format(new Date(ticket.dtResuelto), "d MMM yyyy", { locale: es })}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout dos columnas ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* ═══ COLUMNA IZQUIERDA ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Datos del cliente */}
          <Card title="Cliente" icon="👤">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <Campo label="Nombre" valor={ticket.nombreCliente} />
              <Campo label="Correo" valor={ticket.correoCliente} />
              {ticket.modulo && <Campo label="Módulo" valor={ticket.modulo.nombre ?? ticket.modulo} />}
            </div>
          </Card>

          {/* Contexto ERP (solo si aplica) */}
          {ticket.canalOrigen === 'INTEGRENS_ERP' && (
            <Card title="Contexto ERP Integrens" icon="🔧" style={{ borderLeft: '3px solid #5B33D4' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Campo label="Sistema origen"   valor={ticket.origenSistema} />
                <Campo label="Módulo ERP"       valor={ticket.moduloErp} />
                <Campo label="Versión"          valor={ticket.versionErp} />
                <Campo label="Usuario ERP"      valor={ticket.usuarioErp} />
                <Campo label="Empresa cliente"  valor={ticket.empresaCliente} />
                <Campo label="Acción realizada" valor={ticket.accionRealizada} />
                {ticket.urlPantalla && <Campo label="URL pantalla" valor={ticket.urlPantalla} />}
              </div>
              {ticket.screenshotBase64 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#8B87A8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Captura de pantalla</div>
                  <img src={`data:image/png;base64,${ticket.screenshotBase64}`} alt="Captura" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #EEEAFF' }} />
                </div>
              )}
            </Card>
          )}

          {/* Descripción original */}
          <Card title="Descripción del problema" icon="📝">
            <p style={{ fontSize: 14, color: '#1E1B2E', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
              {ticket.descripcion}
            </p>
          </Card>

          {/* Timeline de estados */}
          <Card title="Historial de estados" icon="🕐">
            {historial.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8B87A8', textAlign: 'center', padding: '12px 0' }}>
                El historial detallado estará disponible en la próxima iteración del backend.
              </p>
            ) : (
              historial.map((h, i) => (
                <TimelineItem
                  key={h.id}
                  estadoNuevo={h.estadoNuevo}
                  estadoAnterior={h.estadoAnterior}
                  comentario={h.comentario}
                  dtCambio={h.dtCambio}
                  usuario={h.usuario?.nombre}
                  isLast={i === historial.length - 1}
                />
              ))
            )}
          </Card>

          {/* Comentarios */}
          <Card title="Conversación" icon="💬">
            {comentarios.length === 0 && (
              <p style={{ fontSize: 13, color: '#8B87A8', margin: '0 0 16px' }}>Aún no hay comentarios en este ticket.</p>
            )}
            {comentarios.map(c => (
              <div key={c.id} style={{
                marginBottom: 12, padding: '12px 16px', borderRadius: 10,
                background: c.esInterno ? 'rgba(91,51,212,0.04)' : '#F9F9FC',
                border: `1px solid ${c.esInterno ? 'rgba(91,51,212,0.12)' : '#EEEAFF'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: '#8B87A8' }}>
                  <span style={{ fontWeight: 600, color: c.esInterno ? '#5B33D4' : '#4A4560' }}>
                    {c.esInterno ? '🔒 Nota interna' : '💬 Respuesta al cliente'}
                  </span>
                  <span>{c.dtCreado ? format(new Date(c.dtCreado), "d MMM, HH:mm", { locale: es }) : ''}</span>
                </div>
                <p style={{ fontSize: 13, color: '#1E1B2E', margin: 0, lineHeight: 1.6 }}>{c.contenido}</p>
              </div>
            ))}

            {/* Formulario de respuesta */}
            {puedeModificar && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #EEEAFF' }}>
                <textarea
                  placeholder="Escribe una respuesta al cliente o nota interna…"
                  rows={3}
                  style={{
                    width: '100%', padding: 12, borderRadius: 8,
                    border: '1.5px solid #DDD9F5', fontSize: 13,
                    fontFamily: 'inherit', color: '#1E1B2E', resize: 'vertical',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#5B33D4'}
                  onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                  <button style={{ height: 36, padding: '0 16px', borderRadius: 8, border: '1.5px solid #DDD9F5', background: '#fff', fontSize: 12, fontWeight: 600, color: '#4A4560', cursor: 'pointer', fontFamily: 'inherit' }}>
                    🔒 Nota interna
                  </button>
                  <button style={{ height: 36, padding: '0 16px', borderRadius: 8, border: 'none', background: '#5B33D4', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Enviar respuesta
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ═══ COLUMNA DERECHA ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Acciones */}
          <Card title="Acciones" icon="⚡">
            {/* Cambiar estado */}
            {puedeModificar && ticket.estado !== 'CERRADO' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#8B87A8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Cambiar estado</div>
                <select
                  value={nuevoEstado}
                  onChange={e => setNuevoEstado(e.target.value)}
                  style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1.5px solid #DDD9F5', fontSize: 13, fontFamily: 'inherit', color: nuevoEstado ? '#1E1B2E' : '#8B87A8', background: '#fff', marginBottom: 8 }}
                >
                  <option value="">Seleccionar estado…</option>
                  {ESTADOS_CAMBIO.filter(e => e !== ticket.estado).map(e => (
                    <option key={e} value={e}>{ESTADO[e]?.label ?? e}</option>
                  ))}
                </select>
                {nuevoEstado && (
                  <textarea
                    value={comentCambio}
                    onChange={e => setComentCambio(e.target.value)}
                    placeholder="Comentario (opcional)…"
                    rows={2}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #DDD9F5', fontSize: 12, fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 8 }}
                  />
                )}
                <button
                  disabled={!nuevoEstado || mutCambioEstado.isPending}
                  onClick={() => mutCambioEstado.mutate()}
                  style={{
                    width: '100%', height: 38, borderRadius: 8,
                    background: nuevoEstado ? '#5B33D4' : '#F2F0FE',
                    color: nuevoEstado ? '#fff' : '#8B87A8',
                    border: 'none', fontSize: 13, fontWeight: 600,
                    cursor: nuevoEstado ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  {mutCambioEstado.isPending ? 'Guardando…' : 'Confirmar cambio'}
                </button>
                {mutCambioEstado.isError && (
                  <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>Error al cambiar estado (Épica 2 pendiente)</p>
                )}
              </div>
            )}

            {/* Reabrir */}
            {puedeReabrir && (
              <div>
                {!mostrarReabrir ? (
                  <button
                    onClick={() => setMostrarReabrir(true)}
                    style={{ width: '100%', height: 38, borderRadius: 8, border: '1.5px solid #EF4444', background: '#fff', fontSize: 13, fontWeight: 600, color: '#EF4444', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                  >
                    🔁 Reabrir ticket
                  </button>
                ) : (
                  <div>
                    <textarea
                      value={motivoReabrir}
                      onChange={e => setMotivoReabrir(e.target.value)}
                      placeholder="Motivo de la reapertura…"
                      rows={2}
                      style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #EF4444', fontSize: 12, fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 8 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setMostrarReabrir(false)} style={{ flex: 1, height: 36, borderRadius: 8, border: '1.5px solid #DDD9F5', background: '#fff', fontSize: 12, fontWeight: 600, color: '#4A4560', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancelar
                      </button>
                      <button
                        onClick={() => mutReabrir.mutate()}
                        disabled={mutReabrir.isPending}
                        style={{ flex: 1, height: 36, borderRadius: 8, border: 'none', background: '#EF4444', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {mutReabrir.isPending ? 'Reabriendo…' : 'Confirmar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!puedeModificar && !puedeReabrir && (
              <p style={{ fontSize: 12, color: '#8B87A8', textAlign: 'center', padding: '8px 0' }}>Sin acciones disponibles para este ticket.</p>
            )}
          </Card>

          {/* Asignación */}
          <Card title="Asignación" icon="👷">
            {ticket.agente ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#5B33D4,#38C1E1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {(ticket.agente.nombre ?? '?')[0]}{(ticket.agente.apellido ?? '')[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E1B2E' }}>{ticket.agente.nombre} {ticket.agente.apellido}</div>
                  <div style={{ fontSize: 11, color: '#38C1E1', fontWeight: 600 }}>{ticket.agente.rol}</div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: '#38C1E1', fontStyle: 'italic', fontWeight: 500, margin: 0 }}>Sin asignar</p>
            )}
          </Card>

          {/* Clasificación IA */}
          {(ticket.tipo || ticket.aplicacion || ticket.confianzaIa != null) && (
            <Card title="Clasificación IA" icon="🤖" style={{ borderTop: '3px solid #5B33D4' }}>
              <div style={{ marginBottom: 12 }}>
                <BarraConfianza valor={ticket.confianzaIa} />
              </div>
              <Campo label="Tipo"        valor={ticket.tipo} />
              <Campo label="Aplicación"  valor={ticket.aplicacion} />
              <Campo label="Estado rev." valor={ticket.revisadoIa ? 'Revisado por IA' : 'Pendiente'} />
            </Card>
          )}

          {/* Metadata */}
          <Card title="Información" icon="ℹ️">
            <Campo label="ID interno" valor={`#${ticket.id}`} mono />
            <Campo label="Código"     valor={ticket.codigo} mono />
            <Campo label="Canal"      valor={`${CANAL_ICON[ticket.canalOrigen] ?? ''} ${ticket.canalOrigen}`} />
            {ticket.dtCreado   && <Campo label="Creado"   valor={format(new Date(ticket.dtCreado), "d MMM yyyy, HH:mm", { locale: es })} />}
            {ticket.dtResuelto && <Campo label="Resuelto" valor={format(new Date(ticket.dtResuelto), "d MMM yyyy, HH:mm", { locale: es })} />}
            {ticket.dtCerrado  && <Campo label="Cerrado"  valor={format(new Date(ticket.dtCerrado), "d MMM yyyy, HH:mm", { locale: es })} />}
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{background-color:#F2F0FE} 50%{background-color:#E9E7FF} }
        @media (max-width: 768px) {
          .ticket-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
