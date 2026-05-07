import { useAuth } from '../context/AuthContext'
import { AdminPanel } from '../components/AdminPanel'
import { signInWithGoogle } from '../services/authService'

export function Admin() {
  const { firebaseUser, appUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="card p-10 max-w-sm w-full text-center">
          <span className="text-4xl block mb-4">🔐</span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso restringido</h2>
          <p className="text-slate-500 mb-6 text-sm">Ingresá con tu cuenta para continuar.</p>
          <button onClick={() => void signInWithGoogle()} className="btn-primary w-full gap-2">
            Ingresar con Google
          </button>
        </div>
      </div>
    )
  }

  if (appUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="card p-10 max-w-sm w-full text-center">
          <span className="text-4xl block mb-4">🚫</span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sin acceso</h2>
          <p className="text-slate-500 text-sm">No tenés permisos de administrador.</p>
        </div>
      </div>
    )
  }

  return <AdminPanel />
}
