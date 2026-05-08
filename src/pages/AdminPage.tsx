import { useState, useEffect } from 'react'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import * as store from '@/lib/mock-store'
import { Plus, Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export function AdminPage() {
  const { periods, loadPeriods, createPeriod, updatePeriodStatus } = useAssessmentStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPeriod, setNewPeriod] = useState({ name: '', start_date: '', end_date: '' })

  const users = store.getUsers()

  useEffect(() => {
    loadPeriods()
  }, [])

  const handleCreatePeriod = () => {
    if (!newPeriod.name || !newPeriod.start_date || !newPeriod.end_date) return
    createPeriod({
      name: newPeriod.name,
      start_date: newPeriod.start_date,
      end_date: newPeriod.end_date,
      status: 'draft',
      score_levels: 5,
    })
    setNewPeriod({ name: '', start_date: '', end_date: '' })
    setShowCreateForm(false)
  }

  const statusConfig = {
    draft: { label: '准备中', color: 'bg-slate-100 text-slate-600' },
    active: { label: '进行中', color: 'bg-green-100 text-green-700' },
    closed: { label: '已结束', color: 'bg-slate-100 text-slate-500' },
  }

  return (
    <div className="space-y-4">
      {/* Period Management */}
      <Card title="评估周期管理">
        <div className="space-y-3">
          {periods.map((period) => (
            <div key={period.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{period.name}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(period.start_date)} ~ {formatDate(period.end_date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', statusConfig[period.status].color)}>
                  {statusConfig[period.status].label}
                </span>
                {period.status === 'draft' && (
                  <Button size="sm" variant="ghost" onClick={() => updatePeriodStatus(period.id, 'active')}>
                    <Play size={12} className="mr-1" /> 开启
                  </Button>
                )}
                {period.status === 'active' && (
                  <Button size="sm" variant="ghost" onClick={() => updatePeriodStatus(period.id, 'closed')}>
                    <Square size={12} className="mr-1" /> 结束
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!showCreateForm ? (
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => setShowCreateForm(true)}>
            <Plus size={14} className="mr-1" /> 新建周期
          </Button>
        ) : (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-2">
            <input
              type="text"
              placeholder="周期名称 (如: 2026年Q3)"
              value={newPeriod.name}
              onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newPeriod.start_date}
                onChange={(e) => setNewPeriod({ ...newPeriod, start_date: e.target.value })}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="date"
                value={newPeriod.end_date}
                onChange={(e) => setNewPeriod({ ...newPeriod, end_date: e.target.value })}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreatePeriod}>创建</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowCreateForm(false)}>取消</Button>
            </div>
          </div>
        )}
      </Card>

      {/* User Management */}
      <Card title="人员管理" subtitle={`共 ${users.length} 人`}>
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">{user.name.slice(0, 1)}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800">{user.name}</p>
                  <p className="text-[10px] text-slate-400">{user.department_l3} {user.department_l4 ? `· ${user.department_l4}` : ''}</p>
                </div>
              </div>
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded font-medium',
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                user.role === 'hr' ? 'bg-blue-100 text-blue-700' :
                user.role === 'supervisor' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-600'
              )}>
                {user.role === 'employee' ? '员工' :
                  user.role === 'supervisor' ? '主管' :
                  user.role === 'hr' ? 'HR' : '管理员'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
