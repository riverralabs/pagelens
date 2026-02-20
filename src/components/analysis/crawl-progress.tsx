"use client"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { ANALYSIS_STATUS_LABELS } from "@/lib/constants"

interface CrawlProgressProps {
  status: string
  pagesFound: number
  pagesCrawled: number
  pagesAnalyzed: number
}

export function CrawlProgress({ status, pagesFound, pagesCrawled, pagesAnalyzed }: CrawlProgressProps) {
  const total = pagesFound || 1
  const progress = status === "CRAWLING"
    ? (pagesCrawled / total) * 50
    : status === "ANALYZING"
    ? 50 + (pagesAnalyzed / total) * 40
    : status === "GENERATING_REPORT"
    ? 90
    : status === "COMPLETED" ? 100 : 0

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center gap-3 mb-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">{ANALYSIS_STATUS_LABELS[status] || status}</span>
        </div>
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{pagesCrawled}/{pagesFound} pages crawled</span>
          <span>{pagesAnalyzed} analyzed</span>
        </div>
      </CardContent>
    </Card>
  )
}
