import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../services/authService'
import { signInWithGoogle } from '../services/authService'

export function Navbar() {
  const { firebaseUser, appUser, domainError } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/#hero',         label: 'Inicio' },
    { to: '/#inscripcion',  label: 'Inscripción' },
    { to: '/#talentos',     label: 'Talentos' },
    { to: '/#votacion',     label: 'Votar' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-2xl shadow-primary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md text-primary tracking-widest uppercase">
              EGTP Got Talent
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="px-3 py-2 text-sm font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors uppercase"
              >
                {l.label}
              </a>
            ))}
            {appUser?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-label-bold text-label-bold uppercase transition-colors ${
                  location.pathname === '/admin'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
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
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                />
                <span className="text-sm font-medium text-on-surface-variant max-w-[120px] truncate">
                  {firebaseUser.displayName}
                </span>
                <button
                  onClick={() => void signOut()}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : domainError ? (
              <span className="text-xs text-error font-bold max-w-[200px] text-right leading-tight">
                Cuenta no autorizada
              </span>
            ) : (
              <button onClick={() => void signInWithGoogle()} className="btn-primary text-sm py-2 px-5">
                Ingresar con Google
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
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
          <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 py-3 space-y-1">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm font-label-bold text-label-bold text-on-surface-variant hover:text-primary uppercase transition-colors"
              >
                {l.label}
              </a>
            ))}
            {appUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm font-label-bold text-label-bold text-on-surface-variant hover:text-primary uppercase transition-colors"
              >
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-outline-variant/20">
              {firebaseUser ? (
                <div className="flex items-center gap-2 px-3 py-2">
                  <img
                    src={firebaseUser.photoURL ?? undefined}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-primary"
                  />
                  <span className="text-sm text-on-surface-variant flex-1 truncate">{firebaseUser.displayName}</span>
                  <button onClick={() => void signOut()} className="text-sm text-on-surface-variant hover:text-primary transition-colors">
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
