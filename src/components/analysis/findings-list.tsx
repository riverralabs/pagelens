"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Finding {
  id: string
  category: string
  severity: string
  title: string
  description: string
  location?: string
}

interface FindingsListProps {
  findings: Finding[]
}

const severityIcons: Record<string, React.ReactNode> = {
  CRITICAL: <XCircle className="h-4 w-4 text-red-500" />,
  HIGH: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  MEDIUM: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  LOW: <Info className="h-4 w-4 text-blue-500" />,
  INFO: <Info className="h-4 w-4 text-muted-foreground" />,
}

const severityColors: Record<string, string> = {
  CRITICAL: "border-red-500/20 bg-red-500/5",
  HIGH: "border-orange-500/20 bg-orange-500/5",
  MEDIUM: "border-yellow-500/20 bg-yellow-500/5",
  LOW: "border-blue-500/20 bg-blue-500/5",
  INFO: "",
}

export function FindingsList({ findings }: FindingsListProps) {
  if (findings.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No findings.</p>
  }

  return (
    <div className="space-y-2">
      {findings.map((finding) => (
        <Card key={finding.id} className={cn("border", severityColors[finding.severity])}>
          <CardContent className="py-3">
            <div className="flex items-start gap-3">
              {severityIcons[finding.severity]}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{finding.title}</span>
                  <Badge variant="outline" className="text-xs">{finding.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{finding.description}</p>
                {finding.location && <p className="text-xs text-muted-foreground mt-1">Location: {finding.location}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
