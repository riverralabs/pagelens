"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getScoreColor, getScoreLabel } from "@/lib/utils"
import { SCORING_LABELS, ANALYSIS_STATUS_LABELS } from "@/lib/constants"

export default function AnalysisResultsPage() {
  const params = useParams()
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/analyses/${params.analysisId}`)
      .then((res) => res.json())
      .then((data) => { setAnalysis(data.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.analysisId])

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}</div>
  if (!analysis) return <div>Analysis not found</div>

  const scores = (analysis.scores as Record<string, number>) || {}
  const status = analysis.status as string
  const isComplete = status === "COMPLETED"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${params.projectId}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <Badge variant="secondary">{ANALYSIS_STATUS_LABELS[status]}</Badge>
          </div>
        </div>
        {isComplete && (
          <div className="flex gap-2">
            <a href={`/api/analyses/${params.analysisId}/report/pdf`}><Button variant="outline"><FileText className="mr-2 h-4 w-4" />PDF</Button></a>
            <a href={`/api/analyses/${params.analysisId}/report/excel`}><Button variant="outline"><FileSpreadsheet className="mr-2 h-4 w-4" />Excel</Button></a>
          </div>
        )}
      </div>

      {!isComplete && (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{ANALYSIS_STATUS_LABELS[status]}</span>
                <span>{analysis.pagesCrawled as number}/{analysis.pagesFound as number || "..."} pages</span>
              </div>
              <Progress value={analysis.pagesFound ? ((analysis.pagesCrawled as number) / (analysis.pagesFound as number)) * 100 : 0} />
            </div>
          </CardContent>
        </Card>
      )}

      {isComplete && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore as number || 0)}`}>
                  {(analysis.overallScore as number) || 0}
                </div>
                <p className="text-muted-foreground mt-1">{getScoreLabel(analysis.overallScore as number || 0)}</p>
              </CardContent>
            </Card>

            {Object.entries(SCORING_LABELS).map(([key, label]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(scores[key] || 0)}`}>{scores[key] || 0}/100</div>
                  <Progress value={scores[key] || 0} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="findings">
            <TabsList>
              <TabsTrigger value="findings">Findings</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>
            <TabsContent value="findings">
              <Card>
                <CardHeader><CardTitle>Findings</CardTitle><CardDescription>Issues found during analysis</CardDescription></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Detailed findings will appear here after analysis completes.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pages">
              <Card>
                <CardHeader><CardTitle>Page Results</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Page-by-page breakdown will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="screenshots">
              <Card>
                <CardHeader><CardTitle>Screenshots</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Screenshots across viewports will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
