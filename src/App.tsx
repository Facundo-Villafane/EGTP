import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Admin } from './pages/Admin'
import { Inscripcion } from './pages/Inscripcion'
import { Participantes } from './pages/Participantes'
import { Resultados } from './pages/Resultados'
import { DomainErrorModal } from './components/ui/DomainErrorModal'

function AppShell() {
  const { domainError, clearDomainError } = useAuth()
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/inscripcion"    element={<Inscripcion />} />
          <Route path="/participantes"  element={<Participantes />} />
          <Route path="/resultados"     element={<Resultados />} />
          <Route path="/admin"          element={<Admin />} />
        </Routes>
      </main>
      <DomainErrorModal message={domainError} onDismiss={clearDomainError} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}
