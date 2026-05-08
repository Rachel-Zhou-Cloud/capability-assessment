import { useState, useEffect } from 'react'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useTeamReport } from '@/hooks/useReports'
import { useDepartments } from '@/hooks/useTeamMembers'
import { TeamReport } from '@/components/reports/TeamReport'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'

export function TeamReportPage() {
  const { periods, loadPeriods, loadAssessments } = useAssessmentStore()
  const departments = useDepartments()
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedDept, setSelectedDept] = useState('')

  useEffect(() => {
    loadPeriods()
  }, [])

  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      const closedPeriod = periods.find(p => p.status === 'closed')
      const activePeriod = periods.find(p => p.status === 'active')
      setSelectedPeriod(closedPeriod?.id || activePeriod?.id || periods[0].id)
    }
  }, [periods])

  useEffect(() => {
    if (selectedPeriod) {
      loadAssessments(selectedPeriod)
    }
  }, [selectedPeriod])

  const teamStats = useTeamReport(selectedDept || undefined, selectedPeriod)

  const periodOptions = periods.map(p => ({ value: p.id, label: p.name }))
  const deptOptions = [
    { value: '', label: '全部门' },
    ...departments.map(d => ({ value: d, label: d })),
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={selectedPeriod}
          onChange={setSelectedPeriod}
          options={periodOptions}
          placeholder="评估周期"
        />
        <Select
          value={selectedDept}
          onChange={setSelectedDept}
          options={deptOptions}
        />
      </div>

      {teamStats && teamStats.avg_scores.some(s => s > 0) ? (
        <TeamReport stats={teamStats} departmentName={selectedDept || '全部门'} />
      ) : (
        <Card className="text-center py-8">
          <p className="text-sm text-slate-500">
            {selectedPeriod ? '该筛选条件下暂无数据' : '请选择评估周期'}
          </p>
        </Card>
      )}
    </div>
  )
}
