import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { AssessmentForm } from '@/components/assessment/AssessmentForm'
import { TeamMemberList } from '@/components/assessment/TeamMemberList'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'

export function AssessmentPage() {
  const { currentUser } = useAuthStore()
  const { periods, activePeriod, loadPeriods, loadAssessments, assessments } = useAssessmentStore()
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    loadPeriods()
  }, [])

  useEffect(() => {
    if (activePeriod && !selectedPeriod) {
      setSelectedPeriod(activePeriod.id)
    }
  }, [activePeriod])

  useEffect(() => {
    if (selectedPeriod) {
      loadAssessments(selectedPeriod)
    }
  }, [selectedPeriod])

  if (!currentUser) return null

  const periodOptions = periods.map(p => ({
    value: p.id,
    label: `${p.name} (${p.status === 'active' ? '进行中' : p.status === 'closed' ? '已结束' : '准备中'})`,
  }))

  const currentPeriod = periods.find(p => p.id === selectedPeriod)
  const isActive = currentPeriod?.status === 'active'

  // Check if self-assessment already submitted
  const selfDone = assessments.some(
    a => a.period_id === selectedPeriod && a.target_user_id === currentUser.id && a.type === 'self'
  )
  const existingSelfScores = assessments.find(
    a => a.period_id === selectedPeriod && a.target_user_id === currentUser.id && a.type === 'self'
  )?.scores

  // Supervisor view: evaluating a team member
  if (selectedMember && (currentUser.role === 'supervisor' || currentUser.role === 'hr' || currentUser.role === 'admin')) {
    const existingSupScores = assessments.find(
      a => a.period_id === selectedPeriod && a.target_user_id === selectedMember.id && a.type === 'supervisor'
    )?.scores

    return (
      <div>
        <button
          onClick={() => setSelectedMember(null)}
          className="flex items-center gap-1 text-sm text-primary mb-3 hover:underline"
        >
          <ArrowLeft size={16} /> 返回团队列表
        </button>
        <AssessmentForm
          targetUserId={selectedMember.id}
          targetUserName={selectedMember.name}
          type="supervisor"
          periodId={selectedPeriod}
          existingScores={existingSupScores}
          onComplete={() => {
            setSelectedMember(null)
            loadAssessments(selectedPeriod)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <Select
        value={selectedPeriod}
        onChange={setSelectedPeriod}
        options={periodOptions}
        placeholder="选择评估周期"
      />

      {!isActive && selectedPeriod && (
        <Card className="bg-amber-50 border-amber-200">
          <p className="text-xs text-amber-700">
            当前周期状态: {currentPeriod?.status === 'closed' ? '已结束' : '准备中'}，
            {currentPeriod?.status === 'closed' ? '评估已锁定不可修改' : '尚未开放评估'}
          </p>
        </Card>
      )}

      {/* Self Assessment Section */}
      {selectedPeriod && isActive && (
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-2">我的自评</h2>
          {selfDone ? (
            <Card className="bg-green-50 border-green-200">
              <p className="text-sm text-green-700 font-medium">自评已完成 ✓</p>
              <p className="text-xs text-green-600 mt-1">你可以在"我的报告"中查看评估结果</p>
            </Card>
          ) : (
            <AssessmentForm
              targetUserId={currentUser.id}
              targetUserName={currentUser.name}
              type="self"
              periodId={selectedPeriod}
              existingScores={existingSelfScores}
              onComplete={() => loadAssessments(selectedPeriod)}
            />
          )}
        </div>
      )}

      {/* Supervisor: Team Members */}
      {selectedPeriod && (currentUser.role === 'supervisor' || currentUser.role === 'hr' || currentUser.role === 'admin') && (
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-2 mt-6">团队评估</h2>
          <TeamMemberList
            periodId={selectedPeriod}
            onSelectMember={(id, name) => setSelectedMember({ id, name })}
          />
        </div>
      )}
    </div>
  )
}
