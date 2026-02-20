"use client"
import { UrlInputForm } from "@/components/analysis/url-input-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface GraderWidgetProps {
  onSubmit: (url: string) => void
  loading?: boolean
}

export function GraderWidget({ onSubmit, loading }: GraderWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Free Website Grader</CardTitle>
        <CardDescription>Get an instant score across 6 dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <UrlInputForm onSubmit={onSubmit} loading={loading} placeholder="Enter your website URL..." />
      </CardContent>
    </Card>
  )
}
