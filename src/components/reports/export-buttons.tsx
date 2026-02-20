"use client"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet, Download } from "lucide-react"

interface ExportButtonsProps {
  analysisId: string
  hasPdf?: boolean
  hasExcel?: boolean
}

export function ExportButtons({ analysisId, hasPdf, hasExcel }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      {hasPdf && (
        <a href={`/api/analyses/${analysisId}/report/pdf`}>
          <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" />PDF Report</Button>
        </a>
      )}
      {hasExcel && (
        <a href={`/api/analyses/${analysisId}/report/excel`}>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-2 h-4 w-4" />Excel Report</Button>
        </a>
      )}
    </div>
  )
}
