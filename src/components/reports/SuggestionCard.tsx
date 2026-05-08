import { cn } from '@/lib/utils'
import type { DevelopmentSuggestion } from '@/types'
import { AlertTriangle, TrendingUp, Star } from 'lucide-react'

interface SuggestionCardProps {
  suggestion: DevelopmentSuggestion
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const levelConfig = {
    priority: {
      icon: AlertTriangle,
      label: '需重点发展',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    growth: {
      icon: TrendingUp,
      label: '有提升空间',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    good: {
      icon: Star,
      label: '表现良好',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
  }

  const config = levelConfig[suggestion.level]
  const Icon = config.icon

  return (
    <div className={cn('rounded-lg border p-3', config.bg, config.border)}>
      <div className="flex items-start gap-2">
        <Icon size={16} className={cn('mt-0.5 shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800">
              {suggestion.capability_name}
            </span>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', config.color, config.bg)}>
              {config.label}
            </span>
            {suggestion.gap_alert && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
                认知偏差
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-1 text-xs text-slate-500">
            <span>有效得分: <strong>{suggestion.effective_score}</strong></span>
            {suggestion.self_score > 0 && <span>自评: {suggestion.self_score}</span>}
            {suggestion.supervisor_score > 0 && <span>主管评: {suggestion.supervisor_score}</span>}
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {suggestion.suggestion}
          </p>
          {suggestion.gap_alert && (
            <p className="text-xs text-purple-600 mt-1 italic">
              自评与主管评差距较大，建议与上级沟通对齐对该能力的理解
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
