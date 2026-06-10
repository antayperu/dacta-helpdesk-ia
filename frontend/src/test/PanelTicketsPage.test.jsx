import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('../services/ticketService', () => ({
  obtenerTickets: vi.fn(),
  crearTicketManual: vi.fn(),
}))
vi.mock('../services/authService', () => ({
  getRol: vi.fn(() => 'AGENTE'),
  getUsuarioActual: vi.fn(() => ({ nombre: 'Carlos', apellido: 'Saenz', correo: 'carlos@test.pe' })),
}))

import { obtenerTickets } from '../services/ticketService'

const TICKET_MOCK = {
  id: 1,
  codigo: 'TK-00001',
  asunto: 'No genera PDF de factura',
  urgencia: 'CRITICA',
  estado: 'NUEVO',
  canalOrigen: 'CORREO',
  correoCliente: 'cliente@test.pe',
  nombreCliente: 'Cliente Test SAC',
  nombreAgente: null,
  revisadoIa: true,
  dtCreado: new Date().toISOString(),
}

const PAGE_MOCK = {
  content: [TICKET_MOCK],
  totalElements: 1,
  totalPages: 1,
}

function Wrapper({ children }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

import PanelTicketsPage from '../pages/PanelTicketsPage'

describe('PanelTicketsPage', () => {
  beforeEach(() => {
    obtenerTickets.mockResolvedValue(PAGE_MOCK)
  })

  it('muestra título del panel', () => {
    render(<PanelTicketsPage />, { wrapper: Wrapper })
    expect(screen.getByText('Panel de Tickets')).toBeInTheDocument()
  })

  it('muestra botón Crear ticket para AGENTE', () => {
    render(<PanelTicketsPage />, { wrapper: Wrapper })
    expect(screen.getByText('+ Crear ticket')).toBeInTheDocument()
  })

  it('abre el modal al hacer clic en Crear ticket', async () => {
    render(<PanelTicketsPage />, { wrapper: Wrapper })
    const btn = screen.getByText('+ Crear ticket')
    fireEvent.click(btn)
    expect(screen.getByText('Crear ticket manual por llamada')).toBeInTheDocument()
  })

  it('muestra sección Filtros avanzados', () => {
    render(<PanelTicketsPage />, { wrapper: Wrapper })
    expect(screen.getByText('Filtros avanzados')).toBeInTheDocument()
  })
})
