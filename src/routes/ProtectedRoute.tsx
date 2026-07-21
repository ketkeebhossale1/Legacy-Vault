import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/ui/LoadingScreen'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export function PublicRoute({ children, redirectIfAuth = true }: { children: ReactNode; redirectIfAuth?: boolean }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (redirectIfAuth && isAuthenticated) {
    return <Navigate to="/home" replace />
  }
  return <>{children}</>
}
