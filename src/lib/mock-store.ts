import type { Profile, Assessment, AssessmentPeriod } from '@/types'
import { generateId } from './utils'

// Mock data for local development without Supabase
const MOCK_USERS: Profile[] = [
  { id: 'user-1', name: '张三', employee_id: 'EMP001', department_l3: '业务一部', department_l4: '区域组', role: 'employee', supervisor_id: 'user-4', created_at: '2026-01-01' },
  { id: 'user-2', name: '李四', employee_id: 'EMP002', department_l3: '业务一部', department_l4: '区域组', role: 'employee', supervisor_id: 'user-4', created_at: '2026-01-01' },
  { id: 'user-3', name: '王五', employee_id: 'EMP003', department_l3: '业务一部', department_l4: '创新组', role: 'employee', supervisor_id: 'user-4', created_at: '2026-01-01' },
  { id: 'user-4', name: '赵主管', employee_id: 'EMP004', department_l3: '业务一部', role: 'supervisor', created_at: '2026-01-01' },
  { id: 'user-5', name: '钱经理', employee_id: 'EMP005', department_l3: '业务二部', role: 'supervisor', created_at: '2026-01-01' },
  { id: 'user-6', name: '孙六', employee_id: 'EMP006', department_l3: '业务二部', department_l4: '运营组', role: 'employee', supervisor_id: 'user-5', created_at: '2026-01-01' },
  { id: 'user-7', name: '周HR', employee_id: 'EMP007', department_l3: '人力资源部', role: 'hr', created_at: '2026-01-01' },
  { id: 'user-8', name: '吴管理', employee_id: 'EMP008', department_l3: '管理层', role: 'admin', created_at: '2026-01-01' },
]

const MOCK_PERIODS: AssessmentPeriod[] = [
  { id: 'period-1', name: '2026年Q1', start_date: '2026-01-01', end_date: '2026-03-31', status: 'closed', score_levels: 5, created_at: '2025-12-20' },
  { id: 'period-2', name: '2026年Q2', start_date: '2026-04-01', end_date: '2026-06-30', status: 'active', score_levels: 5, created_at: '2026-03-20' },
]

const MOCK_ASSESSMENTS: Assessment[] = [
  // Q1 data
  { id: 'a-1', period_id: 'period-1', target_user_id: 'user-1', assessor_id: 'user-1', type: 'self', scores: [3, 4, 2, 3, 4, 4, 2, 3, 4], submitted_at: '2026-02-15', department_l3: '业务一部', department_l4: '区域组', target_user_name: '张三' },
  { id: 'a-2', period_id: 'period-1', target_user_id: 'user-1', assessor_id: 'user-4', type: 'supervisor', scores: [2, 3, 3, 4, 3, 3, 2, 2, 3], submitted_at: '2026-02-20', department_l3: '业务一部', department_l4: '区域组', target_user_name: '张三' },
  { id: 'a-3', period_id: 'period-1', target_user_id: 'user-2', assessor_id: 'user-2', type: 'self', scores: [4, 3, 4, 3, 3, 3, 4, 2, 3], submitted_at: '2026-02-16', department_l3: '业务一部', department_l4: '区域组', target_user_name: '李四' },
  { id: 'a-4', period_id: 'period-1', target_user_id: 'user-2', assessor_id: 'user-4', type: 'supervisor', scores: [3, 4, 3, 3, 4, 4, 3, 2, 4], submitted_at: '2026-02-21', department_l3: '业务一部', department_l4: '区域组', target_user_name: '李四' },
  { id: 'a-5', period_id: 'period-1', target_user_id: 'user-3', assessor_id: 'user-3', type: 'self', scores: [2, 5, 3, 2, 4, 5, 3, 5, 5], submitted_at: '2026-02-17', department_l3: '业务一部', department_l4: '创新组', target_user_name: '王五' },
  { id: 'a-6', period_id: 'period-1', target_user_id: 'user-3', assessor_id: 'user-4', type: 'supervisor', scores: [2, 4, 2, 2, 3, 4, 2, 4, 5], submitted_at: '2026-02-22', department_l3: '业务一部', department_l4: '创新组', target_user_name: '王五' },
  { id: 'a-7', period_id: 'period-1', target_user_id: 'user-6', assessor_id: 'user-6', type: 'self', scores: [3, 3, 4, 4, 3, 3, 3, 2, 3], submitted_at: '2026-02-18', department_l3: '业务二部', department_l4: '运营组', target_user_name: '孙六' },
  { id: 'a-8', period_id: 'period-1', target_user_id: 'user-6', assessor_id: 'user-5', type: 'supervisor', scores: [3, 3, 5, 4, 2, 3, 4, 1, 2], submitted_at: '2026-02-23', department_l3: '业务二部', department_l4: '运营组', target_user_name: '孙六' },
  // Q2 - partial (active period, some people haven't submitted)
  { id: 'a-9', period_id: 'period-2', target_user_id: 'user-1', assessor_id: 'user-1', type: 'self', scores: [3, 4, 3, 3, 4, 4, 3, 4, 4], submitted_at: '2026-05-01', department_l3: '业务一部', department_l4: '区域组', target_user_name: '张三' },
  { id: 'a-10', period_id: 'period-2', target_user_id: 'user-2', assessor_id: 'user-2', type: 'self', scores: [4, 4, 4, 3, 4, 3, 4, 3, 4], submitted_at: '2026-05-02', department_l3: '业务一部', department_l4: '区域组', target_user_name: '李四' },
]

// Local storage keys
const STORAGE_KEYS = {
  users: 'cap_assessment_users',
  periods: 'cap_assessment_periods',
  assessments: 'cap_assessment_assessments',
  initialized: 'cap_assessment_initialized',
}

function initializeLocalStorage() {
  if (localStorage.getItem(STORAGE_KEYS.initialized)) return
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(MOCK_USERS))
  localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(MOCK_PERIODS))
  localStorage.setItem(STORAGE_KEYS.assessments, JSON.stringify(MOCK_ASSESSMENTS))
  localStorage.setItem(STORAGE_KEYS.initialized, 'true')
}

// Initialize on import
initializeLocalStorage()

export function getUsers(): Profile[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]')
}

export function getUserById(id: string): Profile | undefined {
  return getUsers().find(u => u.id === id)
}

export function getUsersByDepartment(dept_l3?: string, dept_l4?: string): Profile[] {
  let users = getUsers()
  if (dept_l3) users = users.filter(u => u.department_l3 === dept_l3)
  if (dept_l4) users = users.filter(u => u.department_l4 === dept_l4)
  return users
}

export function getTeamMembers(supervisorId: string): Profile[] {
  return getUsers().filter(u => u.supervisor_id === supervisorId)
}

export function getPeriods(): AssessmentPeriod[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.periods) || '[]')
}

export function getActivePeriod(): AssessmentPeriod | undefined {
  return getPeriods().find(p => p.status === 'active')
}

export function getAssessments(periodId?: string, targetUserId?: string): Assessment[] {
  let assessments: Assessment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.assessments) || '[]')
  if (periodId) assessments = assessments.filter(a => a.period_id === periodId)
  if (targetUserId) assessments = assessments.filter(a => a.target_user_id === targetUserId)
  return assessments
}

export function saveAssessment(assessment: Omit<Assessment, 'id' | 'submitted_at'>): Assessment {
  const assessments = getAssessments()
  // Check if assessment already exists (update) or create new
  const existingIndex = assessments.findIndex(
    a => a.period_id === assessment.period_id &&
      a.target_user_id === assessment.target_user_id &&
      a.type === assessment.type &&
      a.assessor_id === assessment.assessor_id
  )

  const newAssessment: Assessment = {
    ...assessment,
    id: existingIndex >= 0 ? assessments[existingIndex].id : generateId(),
    submitted_at: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    assessments[existingIndex] = newAssessment
  } else {
    assessments.push(newAssessment)
  }

  localStorage.setItem(STORAGE_KEYS.assessments, JSON.stringify(assessments))
  return newAssessment
}

export function savePeriod(period: Omit<AssessmentPeriod, 'id' | 'created_at'>): AssessmentPeriod {
  const periods = getPeriods()
  const newPeriod: AssessmentPeriod = {
    ...period,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  periods.push(newPeriod)
  localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods))
  return newPeriod
}

export function updatePeriodStatus(id: string, status: AssessmentPeriod['status']): void {
  const periods = getPeriods()
  const index = periods.findIndex(p => p.id === id)
  if (index >= 0) {
    periods[index].status = status
    localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods))
  }
}
