import { useMemo } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import * as store from '@/lib/mock-store'
import type { Profile } from '@/types'

export function useTeamMembers(): Profile[] {
  const { currentUser } = useAuthStore()

  return useMemo(() => {
    if (!currentUser) return []

    switch (currentUser.role) {
      case 'supervisor':
        return store.getTeamMembers(currentUser.id)
      case 'hr':
      case 'admin':
        return store.getUsers().filter(u => u.role === 'employee' || u.role === 'supervisor')
      default:
        return []
    }
  }, [currentUser])
}

export function useDepartments(): string[] {
  return useMemo(() => {
    const users = store.getUsers()
    const depts = new Set(users.map(u => u.department_l3).filter(Boolean))
    return Array.from(depts)
  }, [])
}
