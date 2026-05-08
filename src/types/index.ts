export type Role = 'employee' | 'supervisor' | 'hr' | 'admin'

export type AssessmentType = 'self' | 'supervisor'

export type PeriodStatus = 'draft' | 'active' | 'closed'

export interface Profile {
  id: string
  name: string
  employee_id: string
  department_l3: string
  department_l4?: string
  role: Role
  supervisor_id?: string
  created_at: string
}

export interface AssessmentPeriod {
  id: string
  name: string
  start_date: string
  end_date: string
  status: PeriodStatus
  score_levels: number
  created_at: string
}

export interface Assessment {
  id: string
  period_id: string
  target_user_id: string
  assessor_id: string
  type: AssessmentType
  scores: number[] // 9 scores in order S1-S9
  comments?: string
  submitted_at: string
  department_l3: string
  department_l4?: string
  // Denormalized for display
  target_user_name?: string
  assessor_name?: string
}

export interface CapabilityDefinition {
  id: string
  name: string
  short_name: string
  description: string
  level_descriptions: string[] // index 0=level1, index 4=level5
  suggestion_low: string
  suggestion_mid: string
  suggestion_high: string
}

export interface DevelopmentSuggestion {
  capability_index: number
  capability_name: string
  effective_score: number
  level: 'priority' | 'growth' | 'good'
  suggestion: string
  gap_alert?: boolean
  self_score: number
  supervisor_score: number
}

export interface TeamStats {
  total_members: number
  completed_self: number
  completed_supervisor: number
  avg_scores: number[] // 9 averages
  strongest_index: number
  weakest_index: number
}

export interface IndividualReportData {
  user: Profile
  period: AssessmentPeriod
  self_assessment?: Assessment
  supervisor_assessment?: Assessment
  suggestions: DevelopmentSuggestion[]
}
