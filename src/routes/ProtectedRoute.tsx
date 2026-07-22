import { Navigate, useLocation } from 'react-router-dom'
import LoadingScreen from '../components/ui/LoadingScreen'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  if (loading) return <LoadingScreen />
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export function PublicRoute({ children, redirectIfAuth = true }: { children: ReactNode; redirectIfAuth?: boolean }) {
  const { user, loading } = useSelector((state: RootState) => state.auth)

  if (loading) return <LoadingScreen />
  if (redirectIfAuth && user) {
    return <Navigate to="/home" replace />
  }
  return <>{children}</>
}
