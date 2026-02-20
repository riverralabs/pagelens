"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportPreviewProps {
  executiveSummary?: string
  sections?: { title: string; content: string }[]
}

export function ReportPreview({ executiveSummary, sections }: ReportPreviewProps) {
  return (
    <div className="space-y-6">
      {executiveSummary && (
        <Card>
          <CardHeader><CardTitle>Executive Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{executiveSummary}</p></CardContent>
        </Card>
      )}
      {sections?.map((section, i) => (
        <Card key={i}>
          <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
          <CardContent><div className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</div></CardContent>
        </Card>
      ))}
    </div>
  )
}
