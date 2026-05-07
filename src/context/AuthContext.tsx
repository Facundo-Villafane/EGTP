import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AppUser } from '../types/user'
import { onAuthChanged, syncUserToFirestore } from '../services/authService'

interface AuthState {
  firebaseUser: User | null
  appUser: AppUser | null
  loading: boolean
}

const AuthContext = createContext<AuthState>({
  firebaseUser: null,
  appUser:      null,
  loading:      true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    appUser:      null,
    loading:      true,
  })

  useEffect(() => {
    const unsub = onAuthChanged(async (user) => {
      if (user) {
        const appUser = await syncUserToFirestore(user)
        setState({ firebaseUser: user, appUser, loading: false })
      } else {
        setState({ firebaseUser: null, appUser: null, loading: false })
      }
    })
    return unsub
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
