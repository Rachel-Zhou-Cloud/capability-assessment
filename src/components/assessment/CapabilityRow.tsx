import { CAPABILITIES } from '@/lib/constants'
import { ScoreSelector } from '@/components/ui/ScoreSelector'

interface CapabilityRowProps {
  index: number
  score: number
  onChange: (index: number, score: number) => void
  disabled?: boolean
}

export function CapabilityRow({ index, score, onChange, disabled }: CapabilityRowProps) {
  const cap = CAPABILITIES[index]

  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5">
              {cap.id}
            </span>
            <span className="text-sm font-semibold text-slate-800">{cap.name}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{cap.description}</p>
        </div>
      </div>
      <ScoreSelector
        value={score}
        onChange={(val) => onChange(index, val)}
        disabled={disabled}
      />
      {score > 0 && (
        <p className="text-xs text-slate-400 mt-1.5 italic">
          {cap.level_descriptions[score - 1]}
        </p>
      )}
    </div>
  )
}
