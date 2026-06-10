import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout, getUsuarioActual } from '../../services/authService'

/* ─── Iconos ────────────────────────────────────────── */
const IconTickets = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5v2M15 11v2M15 17v2M5 5h4M5 11h4M5 17h4M3 3h18v18H3z"/>
  </svg>
)
const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconAdmin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
)
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

/* ─── Menú por rol ──────────────────────────────────── */
const MENU_ITEMS = [
  { label: 'Panel de Tickets', to: '/tickets', icon: <IconTickets />, roles: ['AGENTE', 'SUPERVISOR'] },
  { label: 'Dashboard',        to: '/dashboard', icon: <IconDashboard />, roles: ['SUPERVISOR', 'GERENCIA'] },
  { label: 'Administración',   to: '/admin',     icon: <IconAdmin />,    roles: ['SUPERVISOR'] },
]

const ROL_LABEL = { AGENTE: 'Agente', SUPERVISOR: 'Supervisor', GERENCIA: 'Gerencia' }
const ROL_COLOR = { AGENTE: '#38C1E1', SUPERVISOR: '#5B33D4', GERENCIA: '#22C55E' }

export default function Layout() {
  const navigate  = useNavigate()
  const usuario   = getUsuarioActual()
  const rol       = usuario?.rol ?? 'AGENTE'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuFiltrado = MENU_ITEMS.filter(i => i.roles.includes(rol))

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <>
      {/* Header del sidebar — franja púrpura */}
      <div
        style={{
          background: 'linear-gradient(135deg, #453E72 0%, #5B33D4 100%)',
          padding: '20px 20px 24px',
          marginBottom: 8,
        }}
      >
        <img
          src="/assets/images/logo-integrens.png"
          alt="Integrens"
          style={{ width: 160, height: 'auto', display: 'block' }}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <div
          style={{
            display: 'none',
            fontSize: 22, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em',
          }}
        >
          integrens
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 8, letterSpacing: '0.04em' }}>
          Help Desk IA · v1.0
        </p>
      </div>

      {/* Etiqueta sección */}
      <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Navegación
      </div>

      {/* Items de menú */}
      <nav style={{ padding: '0 10px', flex: 1 }}>
        {menuFiltrado.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 10px',
              borderRadius: 8, margin: '2px 0',
              fontSize: 13.5, fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.60)',
              background: isActive ? 'rgba(91,51,212,0.30)' : 'transparent',
              borderLeft: isActive ? '3px solid #38C1E1' : '3px solid transparent',
              paddingLeft: isActive ? 7 : 10,
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Usuario + logout al fondo */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #5B33D4, #38C1E1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}
          >
            {usuario?.nombre?.[0] ?? '?'}{usuario?.apellido?.[0] ?? ''}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario?.nombre} {usuario?.apellido}
            </div>
            <div style={{ fontSize: 11, color: ROL_COLOR[rol] ?? '#38C1E1', fontWeight: 600 }}>
              {ROL_LABEL[rol] ?? rol}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'none' }}
        >
          <IconLogout /> Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ══ SIDEBAR DESKTOP (fijo, 260px) ══ */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 260, minWidth: 260, flexShrink: 0,
          background: '#353C44',
          display: 'flex', flexDirection: 'column',
          height: '100vh', position: 'sticky', top: 0,
          overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>

      {/* ══ SIDEBAR MÓVIL (overlay) ══ */}
      {sidebarOpen && (
        <div
          className="lg:hidden"
          style={{ position: 'fixed', inset: 0, zIndex: 50 }}
        >
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Panel */}
          <aside
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: 260, background: '#353C44',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto', zIndex: 1,
              animation: 'slideInLeft 0.25s ease',
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.10)', border: 'none',
                borderRadius: 6, padding: 4, cursor: 'pointer',
                color: '#fff', display: 'flex', zIndex: 2,
              }}
            >
              <IconX />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ══ CONTENIDO PRINCIPAL ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header 64px */}
        <header
          style={{
            height: 64, background: '#fff',
            borderBottom: '1px solid #DDD9F5',
            padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 40,
            boxShadow: '0 1px 8px rgba(91,51,212,0.06)',
          }}
        >
          {/* Botón hamburguesa (solo móvil) */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, color: '#4A4560', display: 'flex',
            }}
          >
            <IconMenu />
          </button>

          {/* Título de página (desktop) */}
          <div className="hidden lg:block" style={{ fontSize: 15, fontWeight: 600, color: '#1E1B2E' }}>
            DACTA Help Desk IA
          </div>

          {/* Acciones del header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            {/* Badge IA activa */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 20,
                background: 'rgba(91,51,212,0.08)',
                border: '1px solid rgba(91,51,212,0.20)',
                fontSize: 12, fontWeight: 500, color: '#5B33D4',
              }}
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
                  animation: 'pulseDot 2s infinite',
                }}
              />
              IA activa
            </div>

            {/* Notificaciones */}
            <button
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 6, borderRadius: 8, color: '#8B87A8',
                display: 'flex', alignItems: 'center',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#5B33D4'; e.currentTarget.style.background = '#F2F0FE' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8B87A8'; e.currentTarget.style.background = 'none' }}
            >
              <IconBell />
            </button>

            {/* Avatar */}
            <div
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5B33D4, #38C1E1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
                cursor: 'default', flexShrink: 0,
              }}
              title={`${usuario?.nombre} ${usuario?.apellido} — ${ROL_LABEL[rol]}`}
            >
              {usuario?.nombre?.[0] ?? '?'}{usuario?.apellido?.[0] ?? ''}
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main style={{ flex: 1, background: '#F2F0FE', padding: 24, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hidden { display: none !important; }
        @media (min-width: 1024px) {
          .hidden.lg\\:flex { display: flex !important; }
          .hidden.lg\\:block { display: block !important; }
          .lg\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
