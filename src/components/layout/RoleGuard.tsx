import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import type { Role } from '@/types'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { currentUser, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/assessment" replace />
  }

  return <>{children}</>
}
