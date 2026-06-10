import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerTickets } from '../services/ticketService'
import { getRol } from '../services/authService'
import TicketCard from '../components/tickets/TicketCard'
import CrearTicketManualModal from '../components/tickets/CrearTicketManualModal'
import FiltrosTickets from '../components/tickets/FiltrosTickets'
import CargaAgentesPanel from '../components/tickets/CargaAgentesPanel'

/* ─── KPI Card ──────────────────────────────────────── */
function KpiCard({ label, valor, sublabel, color, loading }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EEEAFF',
      borderRadius: 12,
      padding: '20px 24px',
      flex: 1,
      borderTop: `3px solid ${color}`,
      boxShadow: '0 1px 3px rgba(91,51,212,0.06)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#8B87A8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      {loading ? (
        <div style={{ height: 32, width: 60, borderRadius: 8, background: '#F2F0FE', animation: 'shimmer 1.5s infinite' }} />
      ) : (
        <div style={{ fontSize: 32, fontWeight: 800, color: '#1E1B2E', lineHeight: 1 }}>{valor}</div>
      )}
      {sublabel && <div style={{ fontSize: 12, color: '#8B87A8', marginTop: 6 }}>{sublabel}</div>}
    </div>
  )
}

/* ─── Skeleton de una fila ──────────────────────────── */
function TicketSkeleton() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #EEEAFF', borderRadius: 12,
      padding: '14px 20px', display: 'flex', gap: 16, alignItems: 'center',
    }}>
      {[90, 300, 70, 80, 110].map((w, i) => (
        <div key={i} style={{ height: 16, width: w, borderRadius: 8, background: '#F2F0FE', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}

export default function PanelTicketsPage() {
  const rol = getRol()
  const [pagina, setPagina]   = useState(0)
  const [filtros, setFiltros] = useState({ estado: '', urgencia: '', busqueda: '', modulo: '', agente: '', canal: '', tipo: '', fechaDesde: '', fechaHasta: '' })
  const [mostrarModal, setMostrarModal] = useState(false)

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['tickets', filtros, pagina],
    queryFn: () => obtenerTickets(filtros, pagina),
    refetchInterval: 30_000,
    keepPreviousData: true,
  })

  const tickets      = data?.content ?? []
  const totalItems   = data?.totalElements ?? 0
  const totalPaginas = data?.totalPages ?? 1
  const criticos     = tickets.filter(t => t.urgencia === 'CRITICA' && t.estado !== 'CERRADO').length
  const sinAsignar   = tickets.filter(t => !t.nombreAgente).length

  function actualizarFiltros(nuevosFiltros) {
    setFiltros(nuevosFiltros)
    setPagina(0)
  }

  const hayFiltros = Object.values(filtros).some(Boolean)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>

      {/* ── Cabecera ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1E1B2E', marginBottom: 4 }}>
            Panel de Tickets
          </h1>
          <p style={{ fontSize: 13, color: '#8B87A8' }}>
            {totalItems > 0 ? `${totalItems} ticket${totalItems !== 1 ? 's' : ''} en total` : 'Cargando…'}
            {isFetching && !isLoading && (
              <span style={{ marginLeft: 8, fontSize: 11, color: '#5B33D4' }}>↻ actualizando</span>
            )}
          </p>
        </div>
        {(rol === 'AGENTE' || rol === 'SUPERVISOR') && (
          <button
            onClick={() => setMostrarModal(true)}
            style={{
              height: 44, padding: '0 20px',
              background: '#5B33D4', color: '#fff',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#3B2A8F'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#5B33D4'; e.currentTarget.style.transform = 'none' }}
          >
            + Crear ticket
          </button>
        )}
      </div>

      {/* ── Carga de agentes (solo Supervisor) ── */}
      {rol === 'SUPERVISOR' && <CargaAgentesPanel />}

      {/* ── KPIs ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KpiCard
          label="Total tickets"
          valor={totalItems}
          sublabel={`Página ${pagina + 1} de ${totalPaginas}`}
          color="#5B33D4"
          loading={isLoading}
        />
        <KpiCard
          label={rol === 'AGENTE' ? 'Críticos (pág.)' : 'Críticos activos'}
          valor={criticos}
          sublabel="urgencia CRÍTICA sin cerrar"
          color="#EF4444"
          loading={isLoading}
        />
        <KpiCard
          label="Sin asignar"
          valor={sinAsignar}
          sublabel="en esta página"
          color="#38C1E1"
          loading={isLoading}
        />
      </div>

      {/* ── Filtros ── */}
      <FiltrosTickets
        filtros={filtros}
        totalItems={totalItems}
        onChange={actualizarFiltros}
      />

      {/* ── Lista de tickets ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isLoading && Array.from({ length: 5 }).map((_, i) => <TicketSkeleton key={i} />)}

        {isError && (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: '#fff', borderRadius: 12, border: '1px solid #FECACA',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <p style={{ fontSize: 14, color: '#DC2626', fontWeight: 600 }}>No se pudo cargar los tickets</p>
            <p style={{ fontSize: 13, color: '#8B87A8', marginTop: 4 }}>Verifica que el backend esté activo en localhost:8080</p>
          </div>
        )}

        {!isLoading && !isError && tickets.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            background: '#fff', borderRadius: 12, border: '1px solid #EEEAFF',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B2E', marginBottom: 8 }}>
              {hayFiltros ? 'Sin resultados para este filtro' : 'No hay tickets aún'}
            </h3>
            <p style={{ fontSize: 13, color: '#8B87A8' }}>
              {hayFiltros ? 'Prueba con otros filtros o limpia la búsqueda.' : 'Los tickets aparecerán aquí cuando lleguen por los canales configurados.'}
            </p>
            {hayFiltros && (
              <button
                onClick={() => actualizarFiltros({ estado: '', urgencia: '', busqueda: '', modulo: '', agente: '', canal: '', tipo: '', fechaDesde: '', fechaHasta: '' })}
                style={{
                  marginTop: 16, padding: '8px 20px', borderRadius: 8,
                  background: '#5B33D4', color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!isLoading && tickets.map(t => <TicketCard key={t.id} ticket={t} />)}
      </div>

      {/* ── Paginación ── */}
      {totalPaginas > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginTop: 24,
        }}>
          <button
            onClick={() => setPagina(p => Math.max(0, p - 1))}
            disabled={pagina === 0}
            style={{
              height: 36, padding: '0 16px', borderRadius: 8,
              border: '1.5px solid #DDD9F5', background: '#fff',
              fontSize: 13, fontWeight: 500, cursor: pagina === 0 ? 'not-allowed' : 'pointer',
              color: pagina === 0 ? '#8B87A8' : '#4A4560',
              fontFamily: 'inherit', opacity: pagina === 0 ? 0.5 : 1,
            }}
          >
            ← Anterior
          </button>

          {Array.from({ length: Math.min(totalPaginas, 7) }, (_, i) => {
            const p = totalPaginas <= 7 ? i : i === 0 ? 0 : i === 6 ? totalPaginas - 1 : pagina - 2 + i
            if (p < 0 || p >= totalPaginas) return null
            return (
              <button
                key={p}
                onClick={() => setPagina(p)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: `1.5px solid ${p === pagina ? '#5B33D4' : '#DDD9F5'}`,
                  background: p === pagina ? '#5B33D4' : '#fff',
                  fontSize: 13, fontWeight: p === pagina ? 700 : 500,
                  color: p === pagina ? '#fff' : '#4A4560',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {p + 1}
              </button>
            )
          })}

          <button
            onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))}
            disabled={pagina >= totalPaginas - 1}
            style={{
              height: 36, padding: '0 16px', borderRadius: 8,
              border: '1.5px solid #DDD9F5', background: '#fff',
              fontSize: 13, fontWeight: 500,
              cursor: pagina >= totalPaginas - 1 ? 'not-allowed' : 'pointer',
              color: pagina >= totalPaginas - 1 ? '#8B87A8' : '#4A4560',
              fontFamily: 'inherit', opacity: pagina >= totalPaginas - 1 ? 0.5 : 1,
            }}
          >
            Siguiente →
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer {
          0%   { background-color: #F2F0FE; }
          50%  { background-color: #E9E7FF; }
          100% { background-color: #F2F0FE; }
        }
      `}</style>

      {mostrarModal && (
        <CrearTicketManualModal
          onClose={() => setMostrarModal(false)}
          onSuccess={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}
