"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, FileText, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${params.projectId}/analyses/${params.analysisId}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-3xl font-bold">Full Report</h1>
        </div>
        <div className="flex gap-2">
          <a href={`/api/analyses/${params.analysisId}/report/pdf`}><Button variant="outline"><FileText className="mr-2 h-4 w-4" />Download PDF</Button></a>
          <a href={`/api/analyses/${params.analysisId}/report/excel`}><Button variant="outline"><FileSpreadsheet className="mr-2 h-4 w-4" />Download Excel</Button></a>
        </div>
      </div>
      <Card><CardHeader><CardTitle>Executive Summary</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Full AI-generated report will display here.</p></CardContent></Card>
    </div>
  )
}
