"use client"
import { Progress } from "@/components/ui/progress"

interface UsageMeterProps {
  used: number
  limit: number
  label?: string
}

export function UsageMeter({ used, limit, label = "Analyses" }: UsageMeterProps) {
  const isUnlimited = limit === -1
  const percentage = isUnlimited ? 0 : (used / limit) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{used}{isUnlimited ? "" : ` / ${limit}`}</span>
      </div>
      {!isUnlimited && <Progress value={percentage} />}
    </div>
  )
}
