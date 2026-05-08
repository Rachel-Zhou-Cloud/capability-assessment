import { create } from 'zustand'
import type { Assessment, AssessmentPeriod } from '@/types'
import * as store from '@/lib/mock-store'

interface AssessmentState {
  periods: AssessmentPeriod[]
  activePeriod: AssessmentPeriod | null
  assessments: Assessment[]
  loading: boolean

  loadPeriods: () => void
  setActivePeriod: (period: AssessmentPeriod) => void
  loadAssessments: (periodId: string, targetUserId?: string) => void
  submitAssessment: (assessment: Omit<Assessment, 'id' | 'submitted_at'>) => Assessment
  createPeriod: (period: Omit<AssessmentPeriod, 'id' | 'created_at'>) => void
  updatePeriodStatus: (id: string, status: AssessmentPeriod['status']) => void
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  periods: [],
  activePeriod: null,
  assessments: [],
  loading: false,

  loadPeriods: () => {
    const periods = store.getPeriods()
    const activePeriod = periods.find(p => p.status === 'active') || periods[0] || null
    set({ periods, activePeriod })
  },

  setActivePeriod: (period) => {
    set({ activePeriod: period })
  },

  loadAssessments: (periodId, targetUserId) => {
    set({ loading: true })
    const assessments = store.getAssessments(periodId, targetUserId)
    set({ assessments, loading: false })
  },

  submitAssessment: (assessment) => {
    const result = store.saveAssessment(assessment)
    // Reload assessments for current view
    const { activePeriod } = get()
    if (activePeriod) {
      const assessments = store.getAssessments(activePeriod.id)
      set({ assessments })
    }
    return result
  },

  createPeriod: (period) => {
    store.savePeriod(period)
    const periods = store.getPeriods()
    set({ periods })
  },

  updatePeriodStatus: (id, status) => {
    store.updatePeriodStatus(id, status)
    const periods = store.getPeriods()
    const activePeriod = periods.find(p => p.status === 'active') || periods[0] || null
    set({ periods, activePeriod })
  },
}))
