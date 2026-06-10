import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <div className="min-h-screen flex items-center justify-center bg-int-bg">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-int-purple mb-2">
                DACTA Help Desk IA
              </h1>
              <p className="text-int-text-mid text-sm">
                Épica 3 — Frontend en construcción
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
