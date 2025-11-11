import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type AuthUser = {
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  login: (data: { access: string; refresh: string; user: AuthUser }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const getInitialUser = (): AuthUser | null => {
  const email = localStorage.getItem('userEmail')
  if (!email) return null
  return { email }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser())

  const login = useCallback((data: { access: string; refresh: string; user: AuthUser }) => {
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    localStorage.setItem('userEmail', data.user.email)
    setUser({ email: data.user.email })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userEmail')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [login, logout, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
