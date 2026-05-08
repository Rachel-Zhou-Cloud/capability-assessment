import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { CAPABILITIES } from '@/lib/constants'

interface RadarChartProps {
  selfScores?: number[]
  supervisorScores?: number[]
  teamAvgScores?: number[]
  maxScore?: number
  height?: number
}

export function RadarChart({
  selfScores,
  supervisorScores,
  teamAvgScores,
  maxScore = 5,
  height = 300,
}: RadarChartProps) {
  const data = CAPABILITIES.map((cap, index) => ({
    capability: cap.short_name,
    fullName: cap.name,
    self: selfScores?.[index] || 0,
    supervisor: supervisorScores?.[index] || 0,
    teamAvg: teamAvgScores?.[index] || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="capability"
          tick={{ fontSize: 11, fill: '#64748b' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxScore]}
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickCount={maxScore + 1}
        />
        {selfScores && (
          <Radar
            name="自评"
            dataKey="self"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        )}
        {supervisorScores && (
          <Radar
            name="主管评"
            dataKey="supervisor"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        )}
        {teamAvgScores && (
          <Radar
            name="团队均值"
            dataKey="teamAvg"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.08}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        )}
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null
            return (
              <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-lg text-xs">
                <p className="font-semibold text-slate-800 mb-1">{label}</p>
                {payload.map((entry: any) => (
                  <p key={entry.name} style={{ color: entry.stroke }}>
                    {entry.name}: {entry.value}分
                  </p>
                ))}
              </div>
            )
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
