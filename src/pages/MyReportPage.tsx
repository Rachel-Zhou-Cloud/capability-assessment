import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useIndividualReport } from '@/hooks/useReports'
import { IndividualReport } from '@/components/reports/IndividualReport'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'

export function MyReportPage() {
  const { currentUser } = useAuthStore()
  const { periods, loadPeriods, loadAssessments } = useAssessmentStore()
  const [selectedPeriod, setSelectedPeriod] = useState('')

  useEffect(() => {
    loadPeriods()
  }, [])

  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      // Default to latest period with data (closed first, then active)
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

  const reportData = useIndividualReport(currentUser?.id, selectedPeriod)

  const periodOptions = periods.map(p => ({
    value: p.id,
    label: p.name,
  }))

  return (
    <div className="space-y-4">
      <Select
        value={selectedPeriod}
        onChange={setSelectedPeriod}
        options={periodOptions}
        placeholder="选择评估周期"
      />

      {reportData ? (
        <IndividualReport data={reportData} />
      ) : (
        <Card className="text-center py-8">
          <p className="text-sm text-slate-500">
            {selectedPeriod ? '该周期暂无评估数据' : '请选择一个评估周期'}
          </p>
        </Card>
      )}
    </div>
  )
}
