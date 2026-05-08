import type { DevelopmentSuggestion, Assessment } from '@/types'
import { CAPABILITIES } from './constants'

export function generateSuggestions(
  selfAssessment?: Assessment,
  supervisorAssessment?: Assessment
): DevelopmentSuggestion[] {
  if (!selfAssessment && !supervisorAssessment) return []

  const selfScores = selfAssessment?.scores || Array(9).fill(0)
  const supScores = supervisorAssessment?.scores || Array(9).fill(0)

  const suggestions: DevelopmentSuggestion[] = CAPABILITIES.map((cap, index) => {
    const selfScore = selfScores[index] || 0
    const supScore = supScores[index] || 0

    // Effective score: weighted average (supervisor weighs more)
    let effectiveScore: number
    if (selfScore > 0 && supScore > 0) {
      effectiveScore = selfScore * 0.4 + supScore * 0.6
    } else if (supScore > 0) {
      effectiveScore = supScore
    } else {
      effectiveScore = selfScore
    }

    // Classify level
    let level: 'priority' | 'growth' | 'good'
    let suggestion: string
    if (effectiveScore <= 2) {
      level = 'priority'
      suggestion = cap.suggestion_low
    } else if (effectiveScore <= 3) {
      level = 'growth'
      suggestion = cap.suggestion_mid
    } else {
      level = 'good'
      suggestion = cap.suggestion_high
    }

    // Gap alert: difference >= 2 between self and supervisor
    const gapAlert = selfScore > 0 && supScore > 0 && Math.abs(selfScore - supScore) >= 2

    return {
      capability_index: index,
      capability_name: cap.name,
      effective_score: Math.round(effectiveScore * 10) / 10,
      level,
      suggestion,
      gap_alert: gapAlert,
      self_score: selfScore,
      supervisor_score: supScore,
    }
  })

  // Sort: priority first, then growth, then good
  const priority = { priority: 0, growth: 1, good: 2 }
  suggestions.sort((a, b) => priority[a.level] - priority[b.level])

  return suggestions
}

export function getTopWeaknesses(suggestions: DevelopmentSuggestion[], count = 3): DevelopmentSuggestion[] {
  return suggestions
    .filter(s => s.level === 'priority' || s.level === 'growth')
    .slice(0, count)
}
