import type { Assessment, TeamStats } from '@/types'

export function calculateTeamStats(assessments: Assessment[], memberCount: number): TeamStats {
  const selfAssessments = assessments.filter(a => a.type === 'self')
  const supAssessments = assessments.filter(a => a.type === 'supervisor')

  // Calculate average scores across all assessments (prefer supervisor scores)
  const allScores: number[][] = Array(9).fill(null).map(() => [])

  // Group by target user
  const userMap = new Map<string, { self?: Assessment; supervisor?: Assessment }>()
  for (const a of assessments) {
    const entry = userMap.get(a.target_user_id) || {}
    if (a.type === 'self') entry.self = a
    else entry.supervisor = a
    userMap.set(a.target_user_id, entry)
  }

  // For each user, use effective score (40% self + 60% supervisor)
  for (const { self, supervisor } of userMap.values()) {
    for (let i = 0; i < 9; i++) {
      const selfScore = self?.scores[i] || 0
      const supScore = supervisor?.scores[i] || 0
      let effective: number
      if (selfScore > 0 && supScore > 0) {
        effective = selfScore * 0.4 + supScore * 0.6
      } else if (supScore > 0) {
        effective = supScore
      } else if (selfScore > 0) {
        effective = selfScore
      } else {
        continue
      }
      allScores[i].push(effective)
    }
  }

  const avg_scores = allScores.map(scores =>
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0
  )

  const validScores = avg_scores.filter(s => s > 0)
  const strongest_index = avg_scores.indexOf(Math.max(...avg_scores))
  const weakest_index = avg_scores.indexOf(
    Math.min(...avg_scores.filter(s => s > 0).length > 0 ? avg_scores.filter(s => s > 0) : [0])
  )

  return {
    total_members: memberCount,
    completed_self: selfAssessments.length,
    completed_supervisor: supAssessments.length,
    avg_scores,
    strongest_index: validScores.length > 0 ? strongest_index : 0,
    weakest_index: validScores.length > 0 ? weakest_index : 0,
  }
}

export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
