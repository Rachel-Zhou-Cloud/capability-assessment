import { useLocation, useNavigate } from 'react-router-dom'
import { ClipboardList, User, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const NAV_ITEMS = [
  { path: '/assessment', label: '评估', icon: ClipboardList, roles: ['employee', 'supervisor', 'hr', 'admin'] },
  { path: '/my-report', label: '我的', icon: User, roles: ['employee', 'supervisor', 'hr', 'admin'] },
  { path: '/team-report', label: '团队', icon: Users, roles: ['supervisor', 'hr', 'admin'] },
  { path: '/admin', label: '管理', icon: Settings, roles: ['hr', 'admin'] },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()

  if (!currentUser) return null

  const visibleItems = NAV_ITEMS.filter(item =>
    item.roles.includes(currentUser.role)
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200">
      <div className="max-w-lg mx-auto flex">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors',
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
