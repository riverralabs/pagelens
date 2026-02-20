"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, FolderKanban, Globe, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatRelativeTime } from "@/lib/utils"

interface Project {
  id: string
  name: string
  url: string
  domain: string
  description: string | null
  createdAt: string
  _count?: { analyses: number }
  latestScore?: number | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => { setProjects(data.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your website projects</p>
        </div>
        <Link href="/projects/new">
          <Button><Plus className="mr-2 h-4 w-4" />New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start analyzing websites."
          action={<Link href="/projects/new"><Button>Create Project</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {project.latestScore && (
                      <Badge variant={project.latestScore >= 80 ? "default" : "secondary"}>
                        {project.latestScore}/100
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />{project.domain}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.description && <p className="text-sm text-muted-foreground mb-2">{project.description}</p>}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project._count?.analyses || 0} analyses</span>
                    <span>{formatRelativeTime(project.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
