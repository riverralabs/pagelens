"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getScoreColor } from "@/lib/utils"
import { ANALYSIS_STATUS_LABELS } from "@/lib/constants"

export default function AnalysesPage() {
  const params = useParams()
  const [analyses, setAnalyses] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then((res) => res.json())
      .then((data) => { setAnalyses(data.data?.analyses || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.projectId])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${params.projectId}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-3xl font-bold">Analysis History</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>All Analyses</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analyses.map((a: Record<string, unknown>) => (
              <Link key={a.id as string} href={`/projects/${params.projectId}/analyses/${a.id}`}>
                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{formatDate(a.createdAt as string)}</span></div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{ANALYSIS_STATUS_LABELS[a.status as string]}</Badge>
                    {a.overallScore && <span className={`font-bold ${getScoreColor(a.overallScore as number)}`}>{a.overallScore as number}/100</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
