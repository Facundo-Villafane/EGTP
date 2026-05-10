import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AppUser } from '../types/user'
import { onAuthChanged, syncUserToFirestore, signOut } from '../services/authService'

const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN ?? 'gmail.com'
const CACHE_KEY = 'egtp_user_cache'

function isAllowedDomain(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN.toLowerCase()}`)
}

function readCache(): AppUser | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as AppUser) : null
  } catch {
    return null
  }
}

function writeCache(user: AppUser | null) {
  if (user) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CACHE_KEY)
  }
}

interface AuthState {
  firebaseUser: User | null
  appUser: AppUser | null
  loading: boolean
  domainError: string | null
  clearDomainError: () => void
}

const AuthContext = createContext<AuthState>({
  firebaseUser:     null,
  appUser:          null,
  loading:          true,
  domainError:      null,
  clearDomainError: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const cached = readCache()

  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    appUser:      cached,       // arranca con el caché — sin flash
    loading:      !cached,     // si hay caché, no hay loading inicial
    domainError:  null,
  })

  useEffect(() => {
    const unsub = onAuthChanged(async (user) => {
      if (user) {
        const email = user.email ?? ''

        if (!isAllowedDomain(email)) {
          await signOut()
          writeCache(null)
          setState({
            firebaseUser: null,
            appUser: null,
            loading: false,
            domainError: `Solo se puede ingresar con cuentas personales de Google (@gmail.com). La cuenta ${email} es corporativa y no está permitida.`,
          })
          return
        }

        const appUser = await syncUserToFirestore(user)
        writeCache(appUser)
        setState({ firebaseUser: user, appUser, loading: false, domainError: null })
      } else {
        writeCache(null)
        setState((prev) => ({ ...prev, firebaseUser: null, appUser: null, loading: false }))
      }
    })
    return unsub
  }, [])

  function clearDomainError() {
    setState((prev) => ({ ...prev, domainError: null }))
  }

  return (
    <AuthContext.Provider value={{ ...state, clearDomainError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
