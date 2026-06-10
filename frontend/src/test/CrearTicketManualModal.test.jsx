import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../services/ticketService', () => ({
  crearTicketManual: vi.fn(),
}))

import CrearTicketManualModal from '../components/tickets/CrearTicketManualModal'

function Wrapper({ children }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('CrearTicketManualModal', () => {
  it('renderiza el título del modal', () => {
    render(<CrearTicketManualModal onClose={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('Crear ticket manual por llamada')).toBeInTheDocument()
  })

  it('muestra los campos obligatorios', () => {
    render(<CrearTicketManualModal onClose={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByPlaceholderText('facturacion@cliente.pe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Descripción breve del problema')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Detalla el problema reportado por el cliente…')).toBeInTheDocument()
  })

  it('llama a onClose al hacer clic en Cancelar', () => {
    const onClose = vi.fn()
    render(<CrearTicketManualModal onClose={onClose} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('deshabilita submit si los campos están vacíos', () => {
    render(<CrearTicketManualModal onClose={() => {}} />, { wrapper: Wrapper })
    const submit = screen.getByText('+ Crear ticket')
    expect(submit).toBeInTheDocument()
  })

  it('muestra la sección Contexto ERP opcional', () => {
    render(<CrearTicketManualModal onClose={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('Contexto ERP — opcional')).toBeInTheDocument()
  })
})
