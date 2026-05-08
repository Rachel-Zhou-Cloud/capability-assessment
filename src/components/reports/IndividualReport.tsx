import { Card } from '@/components/ui/Card'
import { RadarChart } from './RadarChart'
import { SuggestionCard } from './SuggestionCard'
import type { IndividualReportData } from '@/types'
import { CAPABILITIES } from '@/lib/constants'
import { getTopWeaknesses } from '@/lib/suggestion-engine'

interface IndividualReportProps {
  data: IndividualReportData
}

export function IndividualReport({ data }: IndividualReportProps) {
  const { user, period, self_assessment, supervisor_assessment, suggestions } = data
  const weaknesses = getTopWeaknesses(suggestions)

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <span className="text-lg font-bold text-primary">{user.name.slice(0, 1)}</span>
          </div>
          <h2 className="text-base font-bold text-slate-800">{user.name}</h2>
          <p className="text-xs text-slate-500">{user.department_l3} {user.department_l4 ? `· ${user.department_l4}` : ''}</p>
          <p className="text-xs text-slate-400 mt-1">评估周期: {period.name}</p>
        </div>
      </Card>

      {/* Radar Chart */}
      <Card title="能力雷达图" subtitle="蓝色=自评 橙色=主管评">
        {(self_assessment || supervisor_assessment) ? (
          <RadarChart
            selfScores={self_assessment?.scores}
            supervisorScores={supervisor_assessment?.scores}
          />
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">暂无评估数据</p>
        )}
      </Card>

      {/* Score Details */}
      {(self_assessment || supervisor_assessment) && (
        <Card title="各项得分明细">
          <div className="space-y-2">
            {CAPABILITIES.map((cap, index) => {
              const selfScore = self_assessment?.scores[index] || 0
              const supScore = supervisor_assessment?.scores[index] || 0
              const gap = selfScore > 0 && supScore > 0 ? Math.abs(selfScore - supScore) : 0
              return (
                <div key={cap.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-700 font-medium">{cap.short_name}</span>
                  <div className="flex items-center gap-3">
                    {selfScore > 0 && (
                      <span className="text-xs text-indigo-600 font-mono">自{selfScore}</span>
                    )}
                    {supScore > 0 && (
                      <span className="text-xs text-amber-600 font-mono">上{supScore}</span>
                    )}
                    {gap >= 2 && (
                      <span className="text-[10px] text-purple-500 font-medium">偏差</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Development Suggestions */}
      {weaknesses.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2 px-1">
            重点发展方向 (前{weaknesses.length}项)
          </h3>
          <div className="space-y-2">
            {weaknesses.map((s, i) => (
              <SuggestionCard key={i} suggestion={s} />
            ))}
          </div>
        </div>
      )}

      {/* All suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2 px-1">全部能力评估</h3>
          <div className="space-y-2">
            {suggestions.filter(s => !weaknesses.includes(s)).map((s, i) => (
              <SuggestionCard key={i} suggestion={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
