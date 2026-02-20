"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MousePointerClick } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export default function HeatmapsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Heatmaps</h1>
      <Card>
        <CardContent className="py-12">
          <EmptyState icon={MousePointerClick} title="Heatmaps coming soon" description="Click, scroll, and movement heatmaps will be available in a future update." />
        </CardContent>
      </Card>
    </div>
  )
}
