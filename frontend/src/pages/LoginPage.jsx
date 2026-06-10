import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

/* ─── Iconos inline (sin dependencia extra) ─────────── */
const IconEyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconSpinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
)

/* ─── Features del panel izquierdo ──────────────────── */
const FEATURES = [
  {
    icon: '🤖',
    title: 'Clasificación con IA',
    desc: 'Claude clasifica tipo, urgencia y módulo automáticamente en segundos.',
  },
  {
    icon: '📬',
    title: 'Recepción multicanal',
    desc: 'Correo, WhatsApp e Integrens ERP en una sola bandeja unificada.',
  },
  {
    icon: '📊',
    title: 'Dashboard gerencial',
    desc: 'FRT, TTR y métricas del equipo para Sebastián Rafaile en tiempo real.',
  },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarPass, setMostrarPass] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!correo || !contrasena) return
    setError(null)
    setCargando(true)
    try {
      await login(correo, contrasena)
      navigate('/tickets', { replace: true })
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        setError('Correo o contraseña incorrectos. Verifica tus datos e intenta nuevamente.')
      } else if (status === 423) {
        setError('Tu cuenta ha sido bloqueada por múltiples intentos fallidos. Contacta al administrador.')
      } else {
        setError('Error de conexión. Verifica que el servicio esté disponible.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(340px, 45%, 600px) 1fr',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        opacity: 0,
        animation: 'fadeIn 0.6s ease 0.05s forwards',
      }}
    >
      {/* ══════════════ PANEL IZQUIERDO ══════════════ */}
      <aside
        className="relative hidden md:flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #453E72 0%, #4F38A2 50%, #353C44 100%)',
          padding: '64px 56px',
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Ccircle cx='28' cy='28' r='1' fill='%2338C1E1' opacity='.18'/%3E%3Ccircle cx='0' cy='0' r='1' fill='%2338C1E1' opacity='.10'/%3E%3Ccircle cx='56' cy='0' r='1' fill='%2338C1E1' opacity='.10'/%3E%3Ccircle cx='0' cy='56' r='1' fill='%2338C1E1' opacity='.10'/%3E%3Ccircle cx='56' cy='56' r='1' fill='%2338C1E1' opacity='.10'/%3E%3C/svg%3E")`,
            opacity: 0.6,
          }}
        />
        {/* Rings decorativos */}
        {[
          { w: 500, h: 500, bottom: -200, right: -200, border: 'rgba(56,193,225,0.12)' },
          { w: 320, h: 320, bottom: -100, right: -100, border: 'rgba(56,193,225,0.08)' },
          { w: 240, h: 240, top: -100, left: -100, border: 'rgba(255,255,255,0.06)' },
        ].map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: r.w, height: r.h,
              bottom: r.bottom, right: r.right,
              top: r.top, left: r.left,
              border: `1px solid ${r.border}`,
            }}
          />
        ))}
        {/* Glow cyan */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 200, height: 200, bottom: 60, right: -80,
            background: 'radial-gradient(circle, rgba(56,193,225,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Contenido */}
        <div
          className="relative z-10"
          style={{ animation: 'fadeSlideUp 0.7s ease 0.3s both' }}
        >
          {/* Logo */}
          <img
            src="/assets/images/logo-integrens.png"
            alt="Integrens"
            style={{ width: 280, height: 'auto', marginBottom: 48, display: 'block' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div
            style={{
              display: 'none', marginBottom: 48,
              fontSize: 36, fontWeight: 800, color: '#fff',
              letterSpacing: '-0.03em',
            }}
          >
            integrens
          </div>

          {/* Título */}
          <h1
            style={{
              fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800,
              color: '#fff', lineHeight: 1.15,
              letterSpacing: '-0.025em', marginBottom: 12,
            }}
          >
            Recepción<br />
            <span style={{ color: '#38C1E1' }}>Inteligente</span>
          </h1>
          <p
            style={{
              fontSize: 14, fontStyle: 'italic', fontWeight: 300,
              color: 'rgba(255,255,255,0.50)', lineHeight: 1.65,
              maxWidth: 300, marginBottom: 48,
            }}
          >
            Plataforma de soporte técnico con IA para el equipo Integrens de DACTA S.A.C.
          </p>

          {/* Features */}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <li
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  animation: `fadeSlideUp 0.6s ease ${0.5 + i * 0.15}s both`,
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 6,
                    background: 'rgba(56,193,225,0.12)',
                    border: '1px solid rgba(56,193,225,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, marginTop: 1,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.90)', marginBottom: 3 }}>
                    {f.title}
                  </strong>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
                    {f.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Version badge */}
        <div
          className="absolute"
          style={{
            bottom: 32, left: 56,
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.22)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}
        >
          DACTA Help Desk IA v1.0 — 2026
        </div>
      </aside>

      {/* ══════════════ PANEL DERECHO (FORMULARIO) ══════════════ */}
      <main
        className="relative flex flex-col items-center justify-center"
        style={{ background: '#fff', padding: '48px 40px' }}
      >
        {/* Borde superior degradado */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 3,
            background: 'linear-gradient(90deg, #453E72 0%, #5B33D4 50%, #38C1E1 100%)',
          }}
        />

        <div
          style={{
            width: '100%', maxWidth: 400,
            animation: 'fadeSlideUp 0.7s ease 0.4s both',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, fontWeight: 600,
              color: '#38C1E1', letterSpacing: '0.10em',
              textTransform: 'uppercase', marginBottom: 12,
            }}
          >
            <span style={{ display: 'block', width: 20, height: 2, background: '#38C1E1', borderRadius: 2 }} />
            Acceso Seguro
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1E1B2E', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 8 }}>
            Bienvenido
          </h2>
          <p style={{ fontSize: 13.5, color: '#4A4560', lineHeight: 1.60, marginBottom: 40 }}>
            Ingresa tus credenciales para acceder a la plataforma de gestión de soporte técnico.
          </p>

          {/* Alert de error */}
          {error && (
            <div
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '12px 16px', borderRadius: 10, marginBottom: 24,
                background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                fontSize: 13, fontWeight: 500, lineHeight: 1.5,
                animation: 'alertSlideIn 0.25s ease both',
              }}
            >
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Campo correo */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="correo"
                style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#1E1B2E', marginBottom: 6 }}
              >
                Correo corporativo
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: '#8B87A8', pointerEvents: 'none',
                  }}
                >
                  <IconMail />
                </span>
                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="tu.correo@integrens.com"
                  required
                  disabled={cargando}
                  style={{
                    width: '100%', height: 52,
                    padding: '0 16px 0 44px',
                    fontFamily: 'inherit', fontSize: 14, color: '#1E1B2E',
                    background: '#fff', border: '1.5px solid #DDD9F5',
                    borderRadius: 10, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5B33D4'
                    e.target.style.boxShadow = '0 0 0 3px rgba(91,51,212,0.12)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#DDD9F5'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Campo contraseña */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="contrasena"
                style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#1E1B2E', marginBottom: 6 }}
              >
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: '#8B87A8', pointerEvents: 'none',
                  }}
                >
                  <IconLock />
                </span>
                <input
                  id="contrasena"
                  type={mostrarPass ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={cargando}
                  style={{
                    width: '100%', height: 52,
                    padding: '0 48px 0 44px',
                    fontFamily: 'inherit', fontSize: 14, color: '#1E1B2E',
                    background: '#fff', border: '1.5px solid #DDD9F5',
                    borderRadius: 10, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5B33D4'
                    e.target.style.boxShadow = '0 0 0 3px rgba(91,51,212,0.12)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#DDD9F5'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 4, color: '#8B87A8',
                    display: 'flex', alignItems: 'center',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#5B33D4'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8B87A8'}
                >
                  {mostrarPass ? <IconEyeOff /> : <IconEyeOpen />}
                </button>
              </div>
            </div>

            {/* Recordarme + olvidé contraseña */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  style={{
                    appearance: 'none', WebkitAppearance: 'none',
                    width: 18, height: 18, flexShrink: 0,
                    border: `1.5px solid ${recordarme ? '#5B33D4' : '#DDD9F5'}`,
                    borderRadius: 5, background: recordarme ? '#5B33D4' : '#fff',
                    cursor: 'pointer', position: 'relative',
                    transition: 'all 0.18s',
                  }}
                />
                <span style={{ fontSize: 13, color: '#4A4560' }}>Recordarme</span>
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: 12.5, fontWeight: 500, color: '#5B33D4', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#3B2A8F'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#5B33D4'}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={cargando || !correo || !contrasena}
              style={{
                width: '100%', height: 52,
                background: cargando ? '#7B5CE6' : '#5B33D4',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
                cursor: cargando || !correo || !contrasena ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s ease',
                opacity: !correo || !contrasena ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!cargando && correo && contrasena) {
                  e.currentTarget.style.background = '#3B2A8F'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(91,51,212,0.35)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = cargando ? '#7B5CE6' : '#5B33D4'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {cargando ? (
                <>
                  <span style={{ animation: 'spin 0.8s linear infinite', display: 'flex' }}>
                    <IconSpinner />
                  </span>
                  Verificando…
                </>
              ) : (
                'Ingresar al sistema'
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              margin: '28px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#EEEAFF' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8B87A8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Acceso restringido
            </span>
            <div style={{ flex: 1, height: 1, background: '#EEEAFF' }} />
          </div>

          {/* Badges de seguridad */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            {['SSL 256-bit', '2FA Disponible', 'Logs de auditoría'].map((badge) => (
              <div
                key={badge}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 20,
                  background: 'rgba(91,51,212,0.06)',
                  border: '1px solid rgba(91,51,212,0.12)',
                  fontSize: 11, fontWeight: 600, color: '#5B33D4',
                }}
              >
                <IconShield />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes alertSlideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 767px) {
          main { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  )
}
