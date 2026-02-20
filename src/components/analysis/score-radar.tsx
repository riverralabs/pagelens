"use client"
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { SCORING_LABELS } from "@/lib/constants"
import type { AnalysisScores } from "@/types/analysis"

interface ScoreRadarProps {
  scores: AnalysisScores
}

export function ScoreRadar({ scores }: ScoreRadarProps) {
  const data = Object.entries(scores).map(([key, value]) => ({
    category: SCORING_LABELS[key] || key,
    score: value,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
