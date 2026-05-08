import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import * as store from '@/lib/mock-store'
import type { Role } from '@/types'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [selectedUser, setSelectedUser] = useState('')

  const users = store.getUsers()

  const handleLogin = () => {
    if (!selectedUser) return
    login(selectedUser)
    navigate('/assessment')
  }

  const quickLogin = (role: Role) => {
    const user = users.find(u => u.role === role)
    if (user) {
      login(user.id)
      navigate('/assessment')
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary">CA</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">能力评估平台</h1>
          <p className="text-sm text-slate-500 mt-1">专业能力评估与发展</p>
        </div>

        {/* Quick Login by Role */}
        <Card title="快速登录" subtitle="选择角色体验不同视角">
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button variant="secondary" size="sm" onClick={() => quickLogin('employee')}>
              员工 (张三)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => quickLogin('supervisor')}>
              主管 (赵主管)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => quickLogin('hr')}>
              HR (周HR)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => quickLogin('admin')}>
              管理员 (吴管理)
            </Button>
          </div>
        </Card>

        {/* Login by User */}
        <Card className="mt-3" title="指定用户登录">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm mb-3 focus:border-primary focus:outline-none"
          >
            <option value="">选择用户...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.department_l3}) - {user.role}
              </option>
            ))}
          </select>
          <Button onClick={handleLogin} disabled={!selectedUser} className="w-full">
            登录
          </Button>
        </Card>

        <p className="text-xs text-slate-400 text-center mt-4">
          演示模式 · 数据存储在浏览器本地
        </p>
      </div>
    </div>
  )
}
