import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { Card } from '@/components/ui/Card'
import { CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TeamMemberListProps {
  periodId: string
  onSelectMember: (userId: string, userName: string) => void
}

export function TeamMemberList({ periodId, onSelectMember }: TeamMemberListProps) {
  const members = useTeamMembers()
  const { assessments } = useAssessmentStore()

  const getMemberStatus = (userId: string) => {
    const selfDone = assessments.some(
      a => a.period_id === periodId && a.target_user_id === userId && a.type === 'self'
    )
    const supDone = assessments.some(
      a => a.period_id === periodId && a.target_user_id === userId && a.type === 'supervisor'
    )
    return { selfDone, supDone }
  }

  if (members.length === 0) {
    return (
      <Card className="text-center py-6">
        <p className="text-sm text-slate-500">暂无团队成员</p>
      </Card>
    )
  }

  return (
    <Card title="团队成员" subtitle={`共 ${members.length} 人`}>
      <div className="divide-y divide-slate-100">
        {members.map((member) => {
          const status = getMemberStatus(member.id)
          return (
            <button
              key={member.id}
              onClick={() => onSelectMember(member.id, member.name)}
              className="w-full flex items-center justify-between py-3 hover:bg-slate-50 rounded-lg px-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {member.name.slice(0, 1)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.department_l4 || member.department_l3}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded',
                    status.selfDone ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                  )}>
                    {status.selfDone ? <CheckCircle size={10} className="inline mr-0.5" /> : <Clock size={10} className="inline mr-0.5" />}
                    自评
                  </span>
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded',
                    status.supDone ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  )}>
                    {status.supDone ? <CheckCircle size={10} className="inline mr-0.5" /> : <Clock size={10} className="inline mr-0.5" />}
                    上级评
                  </span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
