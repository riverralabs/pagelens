"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PagesBreakdownPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${params.projectId}/analyses/${params.analysisId}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-3xl font-bold">Page-by-Page Breakdown</h1>
      </div>
      <Card><CardHeader><CardTitle>Individual Page Results</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Detailed per-page analysis results will display here.</p></CardContent></Card>
    </div>
  )
}
