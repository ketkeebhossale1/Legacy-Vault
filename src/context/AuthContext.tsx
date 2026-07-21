import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface User {
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AUTH_KEY = 'legacy-vault-user'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) setUser(JSON.parse(stored) as User)
    } catch {
      localStorage.removeItem(AUTH_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback((u: User) => {
    setUser(u)
    localStorage.setItem(AUTH_KEY, JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
