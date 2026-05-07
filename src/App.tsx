import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Admin } from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"      element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}
