import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearTicketManual } from '../../services/ticketService'

const URGENCIAS = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA']
const URGENCIA_LABEL = { CRITICA: 'Crítica', ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja' }

const MODULOS = [
  { value: 'FIN-FAC', label: 'FIN-FAC — Facturación' },
  { value: 'CMR-POS', label: 'CMR-POS — Punto de Venta' },
  { value: 'LOG-ALM', label: 'LOG-ALM — Almacén' },
  { value: 'FIN-CON', label: 'FIN-CON — Contabilidad' },
  { value: 'FIN-TES', label: 'FIN-TES — Tesorería' },
  { value: 'CMR-VEN', label: 'CMR-VEN — Ventas' },
  { value: 'SCM-COM', label: 'SCM-COM — Compras' },
  { value: 'RHH-PLA', label: 'RHH-PLA — Planilla' },
]

const INPUT = {
  width: '100%',
  border: '1.5px solid #DDD9F5',
  borderRadius: 10,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 14,
  color: '#1E1B2E',
  padding: '0 14px',
  height: 48,
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

const LABEL = {
  display: 'block',
  fontSize: 12,
  fontWeight: 800,
  color: '#4A4560',
  marginBottom: 6,
}

function Campo({ label, children }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

export default function CrearTicketManualModal({ onClose, onSuccess }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    correoCliente: '',
    urgencia: 'MEDIA',
    modulo: '',
    asunto: '',
    descripcion: '',
    versionErp: '',
    usuarioErp: '',
    pantallaErp: '',
  })
  const [ticketCreado, setTicketCreado] = useState(null)

  const mutation = useMutation({
    mutationFn: crearTicketManual,
    onSuccess: (data) => {
      setTicketCreado(data.codigo)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      if (onSuccess) onSuccess(data)
    },
  })

  function set(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.correoCliente.trim() || !form.asunto.trim() || !form.descripcion.trim()) return
    mutation.mutate({
      correoCliente: form.correoCliente.trim(),
      urgencia: form.urgencia,
      modulo: form.modulo || null,
      asunto: form.asunto.trim(),
      descripcion: form.descripcion.trim(),
      versionErp: form.versionErp.trim() || null,
      usuarioErp: form.usuarioErp.trim() || null,
      pantallaErp: form.pantallaErp.trim() || null,
    })
  }

  const hayErp = form.versionErp || form.usuarioErp || form.pantallaErp

  return (
    /* Overlay */
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(30,27,46,0.55)', backdropFilter: 'blur(3px)',
        display: 'grid', placeItems: 'center', padding: 16,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Modal */}
      <div style={{
        width: 'min(760px, 100%)',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
        overflow: 'hidden',
        animation: 'slideUp 0.25s ease',
        maxHeight: 'calc(100vh - 48px)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          padding: '22px 24px',
          background: 'linear-gradient(135deg, #453E72, #5B33D4)',
          color: '#fff',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Crear ticket manual por llamada</h2>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
                HU-019 — El agente registra el caso y el cliente recibe su número por correo.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
                color: '#fff', cursor: 'pointer', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, flexShrink: 0, marginLeft: 16,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body (scrollable) */}
        <form onSubmit={submit} style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Cliente — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Campo label="Correo del cliente Integrens">
                  <input
                    type="email"
                    required
                    value={form.correoCliente}
                    onChange={e => set('correoCliente', e.target.value)}
                    placeholder="facturacion@cliente.pe"
                    style={INPUT}
                    onFocus={e => e.target.style.borderColor = '#5B33D4'}
                    onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                  />
                  <div style={{ marginTop: 6, fontSize: 12, color: '#8B87A8' }}>
                    Busca por empresa, RUC o correo registrado en Integrens.
                  </div>
                </Campo>
              </div>

              {/* Urgencia */}
              <Campo label="Urgencia">
                <select
                  value={form.urgencia}
                  onChange={e => set('urgencia', e.target.value)}
                  style={{ ...INPUT, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#5B33D4'}
                  onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                >
                  {URGENCIAS.map(u => (
                    <option key={u} value={u}>{URGENCIA_LABEL[u]}</option>
                  ))}
                </select>
              </Campo>

              {/* Módulo */}
              <Campo label="Módulo">
                <select
                  value={form.modulo}
                  onChange={e => set('modulo', e.target.value)}
                  style={{ ...INPUT, cursor: 'pointer', color: form.modulo ? '#1E1B2E' : '#8B87A8' }}
                  onFocus={e => e.target.style.borderColor = '#5B33D4'}
                  onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                >
                  <option value="">Sin módulo específico</option>
                  {MODULOS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </Campo>

              {/* Asunto — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Campo label="Asunto">
                  <input
                    type="text"
                    required
                    value={form.asunto}
                    onChange={e => set('asunto', e.target.value)}
                    placeholder="Descripción breve del problema"
                    style={INPUT}
                    onFocus={e => e.target.style.borderColor = '#5B33D4'}
                    onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                  />
                </Campo>
              </div>

              {/* Descripción — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Campo label="Descripción del problema">
                  <textarea
                    required
                    value={form.descripcion}
                    onChange={e => set('descripcion', e.target.value)}
                    placeholder="Detalla el problema reportado por el cliente…"
                    rows={5}
                    style={{
                      ...INPUT,
                      height: 'auto',
                      padding: '12px 14px',
                      resize: 'vertical',
                      minHeight: 110,
                    }}
                    onFocus={e => e.target.style.borderColor = '#5B33D4'}
                    onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                  />
                </Campo>
              </div>
            </div>

            {/* ERP context block */}
            <div style={{
              background: '#F8F7FF',
              border: '1px solid #EEEAFF',
              borderRadius: 12,
              padding: 16,
              marginTop: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: '#5B33D4',
                  background: '#EDE8FB', borderRadius: 999, padding: '2px 8px',
                }}>v2.0</span>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#4A4560' }}>
                  Contexto ERP — opcional
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input
                  value={form.versionErp}
                  onChange={e => set('versionErp', e.target.value)}
                  placeholder="Versión ERP (ej. 4.2.1)"
                  style={{ ...INPUT, height: 40, fontSize: 13 }}
                  onFocus={e => e.target.style.borderColor = '#5B33D4'}
                  onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                />
                <input
                  value={form.usuarioErp}
                  onChange={e => set('usuarioErp', e.target.value)}
                  placeholder="Usuario ERP"
                  style={{ ...INPUT, height: 40, fontSize: 13 }}
                  onFocus={e => e.target.style.borderColor = '#5B33D4'}
                  onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                />
                <input
                  value={form.pantallaErp}
                  onChange={e => set('pantallaErp', e.target.value)}
                  placeholder="Pantalla / acción realizada"
                  style={{ ...INPUT, height: 40, fontSize: 13, gridColumn: '1 / -1', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#5B33D4'}
                  onBlur={e => e.target.style.borderColor = '#DDD9F5'}
                />
              </div>
            </div>

            {/* Error */}
            {mutation.isError && (
              <div style={{
                marginTop: 16, padding: '12px 16px',
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 10, fontSize: 13, color: '#DC2626',
              }}>
                {mutation.error?.response?.data?.mensaje ?? 'No se pudo crear el ticket. Verifica el correo del cliente.'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 24px', background: '#F8F7FF',
            borderTop: '1px solid #EEEAFF', flexShrink: 0,
          }}>
            {/* Confirmación post-creación */}
            {ticketCreado ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#16A34A', fontSize: 13, fontWeight: 800 }}>
                <span style={{ background: '#DCFCE7', borderRadius: 999, padding: '5px 12px', fontSize: 14, fontWeight: 800 }}>
                  {ticketCreado}
                </span>
                Ticket creado. El cliente recibirá su código por correo.
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#8B87A8' }}>
                Canal: Llamada telefónica
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              {ticketCreado ? (
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    height: 44, padding: '0 20px', borderRadius: 10,
                    background: '#5B33D4', color: '#fff', border: 'none',
                    fontSize: 14, fontWeight: 800, cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Cerrar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      height: 44, padding: '0 18px', borderRadius: 10,
                      background: '#fff', color: '#4A4560',
                      border: '1.5px solid #DDD9F5', fontSize: 14,
                      fontWeight: 700, cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    style={{
                      height: 44, padding: '0 20px', borderRadius: 10,
                      background: mutation.isPending ? '#8B7EC8' : '#5B33D4',
                      color: '#fff', border: 'none',
                      fontSize: 14, fontWeight: 800, cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      minWidth: 130,
                    }}
                  >
                    {mutation.isPending ? 'Creando…' : '+ Crear ticket'}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
