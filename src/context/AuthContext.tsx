import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AppUser } from '../types/user'
import { onAuthChanged, syncUserToFirestore, signOut } from '../services/authService'

const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN ?? 'gmail.com'

function isAllowedDomain(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN.toLowerCase()}`)
}

interface AuthState {
  firebaseUser: User | null
  appUser: AppUser | null
  loading: boolean
  domainError: string | null
}

const AuthContext = createContext<AuthState>({
  firebaseUser: null,
  appUser:      null,
  loading:      true,
  domainError:  null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    appUser:      null,
    loading:      true,
    domainError:  null,
  })

  useEffect(() => {
    const unsub = onAuthChanged(async (user) => {
      if (user) {
        const email = user.email ?? ''

        if (!isAllowedDomain(email)) {
          // Sign out immediately and surface a clear error
          await signOut()
          setState({
            firebaseUser: null,
            appUser:      null,
            loading:      false,
            domainError:  `Solo se permiten cuentas @${ALLOWED_DOMAIN}. Tu cuenta (${email}) no está autorizada.`,
          })
          return
        }

        const appUser = await syncUserToFirestore(user)
        setState({ firebaseUser: user, appUser, loading: false, domainError: null })
      } else {
        setState((prev) => ({ ...prev, firebaseUser: null, appUser: null, loading: false }))
      }
    })
    return unsub
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
