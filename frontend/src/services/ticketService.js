import { api } from './authService'

export async function obtenerTickets(filtros = {}, pagina = 0) {
  const params = { page: pagina, size: 20, ...filtros }
  // Eliminar claves vacías para no contaminar la query
  Object.keys(params).forEach(k => (params[k] === '' || params[k] == null) && delete params[k])
  const { data } = await api.get('/tickets', { params })
  return data
}

export async function obtenerTicketDetalle(id) {
  const { data } = await api.get(`/tickets/${id}`)
  return data
}

export async function cambiarEstado(id, nuevoEstado, comentario = '') {
  const { data } = await api.patch(`/tickets/${id}/estado`, { nuevoEstado, comentario })
  return data
}

export async function reabrirTicket(id, motivo = '') {
  const { data } = await api.patch(`/tickets/${id}/reabrir`, { motivo })
  return data
}

export async function asignarTicket(id, idAgente) {
  const { data } = await api.patch(`/tickets/${id}/asignar`, { idAgente })
  return data
}

export async function agregarComentario(id, contenido, esInterno = false) {
  const { data } = await api.post(`/tickets/${id}/comentarios`, { contenido, esInterno })
  return data
}

export async function corregirClasificacion(id, clasificacion) {
  const { data } = await api.patch(`/tickets/${id}/clasificacion`, clasificacion)
  return data
}

export async function crearTicketManual(datos) {
  const { data } = await api.post('/tickets/manual', datos)
  return data
}
