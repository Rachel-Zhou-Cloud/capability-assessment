import { useMemo } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { generateSuggestions } from '@/lib/suggestion-engine'
import { calculateTeamStats } from '@/lib/aggregation'
import * as store from '@/lib/mock-store'
import type { IndividualReportData, TeamStats } from '@/types'

export function useIndividualReport(userId?: string, periodId?: string): IndividualReportData | null {
  const { currentUser } = useAuthStore()
  const { assessments } = useAssessmentStore()

  return useMemo(() => {
    const targetId = userId || currentUser?.id
    if (!targetId || !periodId) return null

    const user = store.getUserById(targetId)
    const periods = store.getPeriods()
    const period = periods.find(p => p.id === periodId)
    if (!user || !period) return null

    const userAssessments = assessments.filter(
      a => a.target_user_id === targetId && a.period_id === periodId
    )

    const selfAssessment = userAssessments.find(a => a.type === 'self')
    const supervisorAssessment = userAssessments.find(a => a.type === 'supervisor')

    const suggestions = generateSuggestions(selfAssessment, supervisorAssessment)

    return {
      user,
      period,
      self_assessment: selfAssessment,
      supervisor_assessment: supervisorAssessment,
      suggestions,
    }
  }, [userId, currentUser, periodId, assessments])
}

export function useTeamReport(departmentL3?: string, periodId?: string): TeamStats | null {
  const { assessments } = useAssessmentStore()

  return useMemo(() => {
    if (!periodId) return null

    const teamMembers = departmentL3
      ? store.getUsersByDepartment(departmentL3)
      : store.getUsers().filter(u => u.role === 'employee')

    const periodAssessments = assessments.filter(a => {
      if (a.period_id !== periodId) return false
      if (departmentL3 && a.department_l3 !== departmentL3) return false
      return true
    })

    return calculateTeamStats(periodAssessments, teamMembers.length)
  }, [departmentL3, periodId, assessments])
}
