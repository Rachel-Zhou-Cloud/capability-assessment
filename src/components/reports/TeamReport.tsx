import { Card } from '@/components/ui/Card'
import { RadarChart } from './RadarChart'
import { CAPABILITIES } from '@/lib/constants'
import type { TeamStats } from '@/types'
import { calculateCompletionRate } from '@/lib/aggregation'
import { TrendingUp, TrendingDown, Users, CheckCircle } from 'lucide-react'

interface TeamReportProps {
  stats: TeamStats
  departmentName?: string
}

export function TeamReport({ stats, departmentName }: TeamReportProps) {
  const completionSelf = calculateCompletionRate(stats.completed_self, stats.total_members)
  const completionSup = calculateCompletionRate(stats.completed_supervisor, stats.total_members)
  void completionSup // Used for future supervisor completion display
  const strongest = CAPABILITIES[stats.strongest_index]
  const weakest = CAPABILITIES[stats.weakest_index]

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <Users size={20} className="mx-auto text-primary mb-1" />
          <p className="text-xl font-bold text-slate-800">{stats.total_members}</p>
          <p className="text-[10px] text-slate-500">团队人数</p>
        </Card>
        <Card className="text-center">
          <CheckCircle size={20} className="mx-auto text-success mb-1" />
          <p className="text-xl font-bold text-slate-800">{completionSelf}%</p>
          <p className="text-[10px] text-slate-500">自评完成率</p>
        </Card>
      </div>

      {/* Team Radar */}
      <Card title="团队能力均值" subtitle={departmentName || '全部门'}>
        {stats.avg_scores.some(s => s > 0) ? (
          <RadarChart teamAvgScores={stats.avg_scores} />
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">暂无数据</p>
        )}
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-green-200 bg-green-50/50">
          <div className="flex items-start gap-2">
            <TrendingUp size={16} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-[10px] text-green-600 font-medium">团队最强项</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{strongest?.short_name}</p>
              <p className="text-xs text-slate-600 mt-0.5">均分: {stats.avg_scores[stats.strongest_index]}</p>
            </div>
          </div>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <div className="flex items-start gap-2">
            <TrendingDown size={16} className="text-red-600 mt-0.5" />
            <div>
              <p className="text-[10px] text-red-600 font-medium">团队待发展</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{weakest?.short_name}</p>
              <p className="text-xs text-slate-600 mt-0.5">均分: {stats.avg_scores[stats.weakest_index]}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Score Breakdown */}
      <Card title="各能力团队均分">
        <div className="space-y-2">
          {CAPABILITIES.map((cap, index) => {
            const score = stats.avg_scores[index]
            const percentage = (score / 5) * 100
            return (
              <div key={cap.id} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-16 shrink-0">{cap.short_name}</span>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-gradient-to-r from-primary-light to-primary"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-700 w-8 text-right">{score}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* HR Insights */}
      <Card title="管理者洞察" subtitle="基于团队数据的建议">
        <div className="space-y-3">
          {stats.avg_scores[stats.weakest_index] <= 2.5 && (
            <div className="flex items-start gap-2 text-xs">
              <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-[10px]">!</span>
              <p className="text-slate-700">
                <strong>{weakest?.name}</strong> 是团队整体最薄弱环节（均分 {stats.avg_scores[stats.weakest_index]}），
                建议组织专项培训或引入外部资源提升团队在该领域的能力。
              </p>
            </div>
          )}
          {completionSelf < 80 && (
            <div className="flex items-start gap-2 text-xs">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-[10px]">!</span>
              <p className="text-slate-700">
                自评完成率仅 {completionSelf}%，建议通过群通知或1:1提醒未完成评估的同事。
              </p>
            </div>
          )}
          {stats.avg_scores[stats.strongest_index] >= 4 && (
            <div className="flex items-start gap-2 text-xs">
              <span className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-[10px]">+</span>
              <p className="text-slate-700">
                团队在 <strong>{strongest?.name}</strong> 方面表现突出（均分 {stats.avg_scores[stats.strongest_index]}），
                可安排该领域强项成员担任内部导师，带动其他能力的提升。
              </p>
            </div>
          )}
          <div className="flex items-start gap-2 text-xs">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">i</span>
            <p className="text-slate-700">
              建议结合个人报告中的认知偏差数据，对偏差较大的成员进行重点沟通，帮助其建立准确的自我认知。
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
