import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('../services/ticketService', () => ({
  obtenerTicketDetalle: vi.fn(),
  cambiarEstado: vi.fn(),
  reabrirTicket: vi.fn(),
  asignarTicket: vi.fn(),
  agregarComentario: vi.fn(),
  corregirClasificacion: vi.fn(),
}))
vi.mock('../services/authService', () => ({
  getRol: vi.fn(() => 'AGENTE'),
  getUsuarioActual: vi.fn(() => ({ nombre: 'Carlos', apellido: 'Saenz', correo: 'carlos@test.pe' })),
}))

import { obtenerTicketDetalle } from '../services/ticketService'
import TicketDetallePage from '../pages/TicketDetallePage'

const DETALLE_MOCK = {
  id: 42,
  codigo: 'TK-00042',
  asunto: 'No genera PDF de factura electrónica',
  descripcion: 'Cliente no puede generar PDF.',
  urgencia: 'CRITICA',
  estado: 'EN_PROGRESO',
  canalOrigen: 'CORREO',
  correoCliente: 'facturacion@cliente.pe',
  nombreCliente: 'Distribuidora Lima SAC',
  nombreAgente: 'Carlos Saenz',
  agente: { nombre: 'Carlos', apellido: 'Saenz', correo: 'carlos@test.pe', rol: 'AGENTE' },
  revisadoIa: true,
  tipoTicketIa: 'BUG',
  confianzaIa: 0.92,
  nombreModulo: 'FIN-FAC',
  dtCreado: new Date().toISOString(),
  dtResolucion: null,
  historial: [],
  comentarios: [],
}

function Wrapper({ children }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/tickets/42']}>
        <Routes>
          <Route path="/tickets/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('TicketDetallePage', () => {
  beforeEach(() => {
    obtenerTicketDetalle.mockResolvedValue(DETALLE_MOCK)
  })

  it('muestra el código del ticket una vez cargado', async () => {
    render(<TicketDetallePage />, { wrapper: Wrapper })
    const elements = await screen.findAllByText('TK-00042')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('muestra el asunto del ticket', async () => {
    render(<TicketDetallePage />, { wrapper: Wrapper })
    expect(await screen.findByText('No genera PDF de factura electrónica')).toBeInTheDocument()
  })

  it('muestra el nombre del agente asignado', async () => {
    render(<TicketDetallePage />, { wrapper: Wrapper })
    const elements = await screen.findAllByText('Carlos Saenz')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('muestra enlace de retorno al panel', async () => {
    render(<TicketDetallePage />, { wrapper: Wrapper })
    const link = await screen.findByText('← Panel de Tickets')
    expect(link).toBeInTheDocument()
  })
})
