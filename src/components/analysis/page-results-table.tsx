"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getScoreColor } from "@/lib/utils"

interface PageResult {
  id: string
  url: string
  path: string
  title: string | null
  overallScore: number | null
  pageType: string | null
}

interface PageResultsTableProps {
  pages: PageResult[]
}

export function PageResultsTable({ pages }: PageResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.id}>
            <TableCell>
              <div>
                <p className="font-medium text-sm">{page.title || page.path}</p>
                <p className="text-xs text-muted-foreground">{page.path}</p>
              </div>
            </TableCell>
            <TableCell><Badge variant="outline" className="text-xs">{page.pageType || "other"}</Badge></TableCell>
            <TableCell className="text-right">
              {page.overallScore !== null ? (
                <span className={`font-bold ${getScoreColor(page.overallScore)}`}>{page.overallScore}</span>
              ) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
