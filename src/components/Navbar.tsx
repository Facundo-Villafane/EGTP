import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../services/authService'
import { signInWithGoogle } from '../services/authService'

export function Navbar() {
  const { firebaseUser, appUser } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/#hero',         label: 'Inicio' },
    { to: '/#inscripcion',  label: 'Inscripción' },
    { to: '/#talentos',     label: 'Talentos' },
    { to: '/#votacion',     label: 'Votar' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
            <span className="text-2xl">🎤</span>
            <span>EGTP Got Talent</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
              >
                {l.label}
              </a>
            ))}
            {appUser?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <img
                  src={firebaseUser.photoURL ?? undefined}
                  alt={firebaseUser.displayName ?? ''}
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-200"
                />
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                  {firebaseUser.displayName}
                </span>
                <button
                  onClick={() => void signOut()}
                  className="text-sm text-slate-500 hover:text-red-500 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button onClick={() => void signInWithGoogle()} className="btn-primary text-sm py-2 px-4">
                Ingresar con Google
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50"
              >
                {l.label}
              </a>
            ))}
            {appUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50"
              >
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-slate-100">
              {firebaseUser ? (
                <div className="flex items-center gap-2 px-3 py-2">
                  <img
                    src={firebaseUser.photoURL ?? undefined}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm text-slate-700 flex-1 truncate">{firebaseUser.displayName}</span>
                  <button onClick={() => void signOut()} className="text-sm text-red-500">
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { void signInWithGoogle(); setMenuOpen(false) }}
                  className="w-full btn-primary text-sm py-2"
                >
                  Ingresar con Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
