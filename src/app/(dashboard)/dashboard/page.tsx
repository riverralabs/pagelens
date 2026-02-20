"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, FolderKanban, Plus, TrendingUp, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"

interface DashboardStats {
  totalProjects: number
  totalAnalyses: number
  avgScore: number
  recentAnalyses: {
    id: string
    projectName: string
    overallScore: number | null
    status: string
    createdAt: string
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, show empty state
    setLoading(false)
  }, [])

  const statCards = [
    { title: "Total Projects", value: stats?.totalProjects || 0, icon: FolderKanban, color: "text-blue-500" },
    { title: "Total Analyses", value: stats?.totalAnalyses || 0, icon: BarChart3, color: "text-emerald-500" },
    { title: "Avg Score", value: stats?.avgScore || 0, icon: TrendingUp, color: "text-yellow-500" },
    { title: "Active", value: 0, icon: Activity, color: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your website analyses</p>
        </div>
        <Link href="/projects/new">
          <Button><Plus className="mr-2 h-4 w-4" />New Project</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Your latest website analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          {!stats?.recentAnalyses?.length ? (
            <EmptyState
              icon={BarChart3}
              title="No analyses yet"
              description="Create a project and run your first analysis to see results here."
              action={<Link href="/projects/new"><Button>Create Project</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {stats.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{analysis.projectName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(analysis.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>{analysis.status}</Badge>
                    {analysis.overallScore && <span className="text-lg font-bold">{analysis.overallScore}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
