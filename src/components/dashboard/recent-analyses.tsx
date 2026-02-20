"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime, getScoreColor } from "@/lib/utils"

interface Analysis {
  id: string
  projectId: string
  projectName: string
  overallScore: number | null
  status: string
  createdAt: string
}

interface RecentAnalysesProps {
  analyses: Analysis[]
}

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  return (
    <div className="space-y-3">
      {analyses.map((analysis) => (
        <Link key={analysis.id} href={`/projects/${analysis.projectId}/analyses/${analysis.id}`}>
          <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div>
              <p className="font-medium text-sm">{analysis.projectName}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(analysis.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{analysis.status}</Badge>
              {analysis.overallScore && <span className={`text-sm font-bold ${getScoreColor(analysis.overallScore)}`}>{analysis.overallScore}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
