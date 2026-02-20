import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"
import { formatRelativeTime, getScoreColor } from "@/lib/utils"

interface ProjectCardProps {
  id: string
  name: string
  domain: string
  description?: string | null
  latestScore?: number | null
  analysisCount: number
  updatedAt: string
}

export function ProjectCard({ id, name, domain, description, latestScore, analysisCount, updatedAt }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{name}</CardTitle>
            {latestScore !== null && latestScore !== undefined && (
              <Badge variant={latestScore >= 80 ? "default" : "secondary"}>{latestScore}/100</Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-1"><Globe className="h-3 w-3" />{domain}</CardDescription>
        </CardHeader>
        <CardContent>
          {description && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{description}</p>}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{analysisCount} analyses</span>
            <span>{formatRelativeTime(updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
