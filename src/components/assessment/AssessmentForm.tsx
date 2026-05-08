import { useState } from 'react'
import { CAPABILITIES } from '@/lib/constants'
import { CapabilityRow } from './CapabilityRow'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAssessmentStore } from '@/store/useAssessmentStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { AssessmentType } from '@/types'
import { CheckCircle } from 'lucide-react'

interface AssessmentFormProps {
  targetUserId: string
  targetUserName: string
  type: AssessmentType
  periodId: string
  existingScores?: number[]
  onComplete?: () => void
}

export function AssessmentForm({
  targetUserId,
  targetUserName,
  type,
  periodId,
  existingScores,
  onComplete,
}: AssessmentFormProps) {
  const [scores, setScores] = useState<number[]>(existingScores || Array(9).fill(0))
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { submitAssessment } = useAssessmentStore()
  const { currentUser } = useAuthStore()

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...scores]
    newScores[index] = value
    setScores(newScores)
  }

  const isComplete = scores.every(s => s > 0)

  const handleSubmit = () => {
    if (!currentUser || !isComplete) return

    submitAssessment({
      period_id: periodId,
      target_user_id: targetUserId,
      assessor_id: currentUser.id,
      type,
      scores,
      comments,
      department_l3: currentUser.department_l3,
      department_l4: currentUser.department_l4,
      target_user_name: targetUserName,
    })
    setSubmitted(true)
    onComplete?.()
  }

  if (submitted) {
    return (
      <Card className="text-center py-8">
        <CheckCircle className="mx-auto text-success mb-3" size={48} />
        <p className="text-lg font-semibold text-slate-800">提交成功!</p>
        <p className="text-sm text-slate-500 mt-1">
          {type === 'self' ? '自评' : `对 ${targetUserName} 的评估`}已保存
        </p>
      </Card>
    )
  }

  const filledCount = scores.filter(s => s > 0).length

  return (
    <div>
      <Card className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {type === 'self' ? '自我评估' : `评估: ${targetUserName}`}
            </p>
            <p className="text-xs text-slate-500">
              请对每项能力进行1-5分评价
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">进度</span>
            <p className="text-sm font-bold text-primary">{filledCount}/9</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(filledCount / 9) * 100}%` }}
          />
        </div>
      </Card>

      <Card>
        {CAPABILITIES.map((_, index) => (
          <CapabilityRow
            key={index}
            index={index}
            score={scores[index]}
            onChange={handleScoreChange}
          />
        ))}
      </Card>

      {/* Comments */}
      <Card className="mt-3">
        <label className="text-sm font-medium text-slate-700">备注 (可选)</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="对评估的补充说明..."
          className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm resize-none h-20 focus:border-primary focus:outline-none"
        />
      </Card>

      {/* Submit */}
      <div className="mt-4 sticky bottom-16 bg-surface pt-2 pb-2">
        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          size="lg"
          className="w-full"
        >
          {isComplete ? '提交评估' : `还需评价 ${9 - filledCount} 项能力`}
        </Button>
      </div>
    </div>
  )
}
