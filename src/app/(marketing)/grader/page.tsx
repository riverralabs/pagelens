"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, ArrowRight, Globe } from "lucide-react"
import { getScoreColor, getScoreLabel } from "@/lib/utils"
import { SCORING_LABELS } from "@/lib/constants"

export default function GraderPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/grader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.startsWith("http") ? url : `https://${url}` }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Free Website Grader</h1>
          <p className="text-muted-foreground mt-2">Get an instant AI-powered score for your website across 6 dimensions.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter your website URL..." value={url} onChange={(e) => setUrl(e.target.value)} className="pl-9" required />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
              </Button>
            </form>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(result.overallScore as number)}`}>{String(result.overallScore)}</div>
                <p className="text-muted-foreground mt-1">{getScoreLabel(result.overallScore as number)}</p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries((result.scores as Record<string, number>) || {}).map(([key, score]) => (
                <Card key={key}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{SCORING_LABELS[key] || key}</span>
                      <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/100</span>
                    </div>
                    <Progress value={score} />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">Want detailed findings, recommendations, and PDF reports?</p>
              <Link href="/signup"><Button size="lg">Get Full Analysis <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
