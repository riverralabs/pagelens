"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface Recommendation {
  id: string
  priority: string
  action: string
  expectedImpact: string
  effort: string
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[]
}

const effortColors: Record<string, string> = {
  LOW: "bg-emerald-500/10 text-emerald-500",
  MEDIUM: "bg-yellow-500/10 text-yellow-500",
  HIGH: "bg-red-500/10 text-red-500",
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={rec.id} className="flex items-start gap-3 rounded-lg border p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{rec.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{rec.expectedImpact}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{rec.priority}</Badge>
                  <Badge variant="outline" className={`text-xs ${effortColors[rec.effort] || ""}`}>{rec.effort} effort</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
