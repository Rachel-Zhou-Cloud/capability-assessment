import { useAuthStore } from '@/store/useAuthStore'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { currentUser, logout } = useAuthStore()

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-base font-bold text-slate-800">能力评估平台</h1>
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {currentUser.name}
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                  {currentUser.role === 'employee' ? '员工' :
                    currentUser.role === 'supervisor' ? '主管' :
                    currentUser.role === 'hr' ? 'HR' : '管理员'}
                </span>
              </span>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                退出
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
