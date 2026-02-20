"use client"
import { cn } from "@/lib/utils"
import { getScoreColor, getScoreLabel } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
  size?: "sm" | "md" | "lg"
  label?: string
}

export function ScoreGauge({ score, size = "md", label }: ScoreGaugeProps) {
  const sizes = { sm: "h-20 w-20", md: "h-32 w-32", lg: "h-44 w-44" }
  const textSizes = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" }
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative", sizes[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={cn("transition-all duration-1000", getScoreColor(score).replace("text-", "stroke-"))} style={{ stroke: score >= 80 ? '#10B981' : score >= 60 ? '#EAB308' : score >= 40 ? '#F97316' : '#F43F5E' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", textSizes[size])}>{score}</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm text-muted-foreground">{label}</span>}
      <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
    </div>
  )
}
