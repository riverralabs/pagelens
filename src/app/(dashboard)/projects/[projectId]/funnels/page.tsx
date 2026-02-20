"use client"
import { Card, CardContent } from "@/components/ui/card"
import { GitBranch } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export default function FunnelsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Funnel Analytics</h1>
      <Card><CardContent className="py-12"><EmptyState icon={GitBranch} title="Funnel analytics coming soon" description="Build conversion funnels and track drop-off points in a future update." /></CardContent></Card>
    </div>
  )
}
