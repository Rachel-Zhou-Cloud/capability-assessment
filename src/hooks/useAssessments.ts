import { useMemo } from 'react'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useAuthStore } from '@/store/useAuthStore'

export function useAssessments(periodId?: string, targetUserId?: string) {
  const { assessments, submitAssessment, loadAssessments } = useAssessmentStore()

  const filteredAssessments = useMemo(() => {
    let result = assessments
    if (periodId) result = result.filter(a => a.period_id === periodId)
    if (targetUserId) result = result.filter(a => a.target_user_id === targetUserId)
    return result
  }, [assessments, periodId, targetUserId])

  const selfAssessment = useMemo(
    () => filteredAssessments.find(a => a.type === 'self'),
    [filteredAssessments]
  )

  const supervisorAssessment = useMemo(
    () => filteredAssessments.find(a => a.type === 'supervisor'),
    [filteredAssessments]
  )

  return {
    assessments: filteredAssessments,
    selfAssessment,
    supervisorAssessment,
    submitAssessment,
    loadAssessments,
  }
}

export function useMyAssessments(periodId?: string) {
  const { currentUser } = useAuthStore()
  return useAssessments(periodId, currentUser?.id)
}
