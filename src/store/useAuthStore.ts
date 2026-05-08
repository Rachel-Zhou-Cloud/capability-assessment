import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Role } from '@/types'
import { getUsers } from '@/lib/mock-store'

interface AuthState {
  currentUser: Profile | null
  isAuthenticated: boolean
  login: (userId: string) => void
  loginAs: (role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (userId: string) => {
        const users = getUsers()
        const user = users.find(u => u.id === userId)
        if (user) {
          set({ currentUser: user, isAuthenticated: true })
        }
      },

      loginAs: (role: Role) => {
        const users = getUsers()
        const user = users.find(u => u.role === role)
        if (user) {
          set({ currentUser: user, isAuthenticated: true })
        }
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false })
      },
    }),
    { name: 'cap-auth-store' }
  )
)
