import { cn } from '@/lib/utils'
import { SCORE_LEVELS } from '@/lib/constants'

interface ScoreSelectorProps {
  value: number
  onChange: (value: number) => void
  maxScore?: number
  disabled?: boolean
}

export function ScoreSelector({ value, onChange, maxScore = 5, disabled }: ScoreSelectorProps) {
  const levels = SCORE_LEVELS.slice(0, maxScore)

  return (
    <div className="flex gap-1.5">
      {levels.map((level) => (
        <button
          key={level.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(level.value)}
          className={cn(
            'flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all border',
            value === level.value
              ? 'bg-primary text-white border-primary shadow-sm scale-105'
              : 'bg-white text-slate-600 border-slate-200 hover:border-primary-light hover:text-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          title={level.description}
        >
          <div className="text-center">
            <div className="font-bold">{level.value}</div>
            <div className="text-[10px] opacity-80 mt-0.5 leading-tight">{level.description}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
