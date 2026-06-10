import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Layout from './components/common/Layout'
import PanelTicketsPage from './pages/PanelTicketsPage'
import TicketDetallePage from './pages/TicketDetallePage'

const Placeholder = ({ titulo }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E1B2E', marginBottom: 6 }}>{titulo}</h2>
      <p style={{ fontSize: 14, color: '#8B87A8' }}>En construcción — próxima tarea</p>
    </div>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/tickets"        element={<PanelTicketsPage />} />
        <Route path="/tickets/:id"    element={<TicketDetallePage />} />
        <Route path="/dashboard"      element={<Placeholder titulo="Dashboard Gerencial" />} />
        <Route path="/admin"          element={<Placeholder titulo="Administración" />} />
      </Route>
    </Routes>
  )
}

export default App
