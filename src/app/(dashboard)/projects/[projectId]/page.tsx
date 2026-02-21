"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe, Play, BarChart3, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getScoreColor } from "@/lib/utils"
import { ANALYSIS_STATUS_LABELS } from "@/lib/constants"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Record<string, unknown> | null>(null)
  const [analyses, setAnalyses] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.data)
        setAnalyses(data.data?.analyses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.projectId])

  const startAnalysis = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch(`/api/projects/${params.projectId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crawlDepth: 2, maxPages: 50 }),
      })
      const data = await res.json()
      if (data.data?.id) {
        router.push(`/projects/${params.projectId}/analyses/${data.data.id}`)
      }
    } catch {
      setAnalyzing(false)
    }
  }

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold">{project.name as string}</h1>
            <p className="text-muted-foreground flex items-center gap-1"><Globe className="h-3 w-3" />{project.domain as string}</p>
          </div>
        </div>
        <Button onClick={startAnalysis} disabled={analyzing}>
          {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          Run Analysis
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Latest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analyses[0] ? getScoreColor((analyses[0] as Record<string, unknown>).overallScore as number || 0) : ""}`}>
              {analyses[0] ? `${(analyses[0] as Record<string, unknown>).overallScore || "—"}/100` : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{analyses[0] ? ANALYSIS_STATUS_LABELS[(analyses[0] as Record<string, unknown>).status as string] || "No analyses" : "No analyses"}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>All analyses for this project</CardDescription>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <p>No analyses yet. Run your first analysis to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map((analysis: Record<string, unknown>) => (
                <Link key={analysis.id as string} href={`/projects/${params.projectId}/analyses/${analysis.id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(analysis.createdAt as string)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{ANALYSIS_STATUS_LABELS[analysis.status as string]}</Badge>
                      {analysis.overallScore != null && <span className={`font-bold ${getScoreColor(analysis.overallScore as number)}`}>{String(analysis.overallScore)}/100</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
