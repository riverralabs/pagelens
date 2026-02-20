"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Video } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Session Recordings</h1>
      <Card><CardContent className="py-12"><EmptyState icon={Video} title="Session recording coming soon" description="Watch real user sessions with rage click detection in a future update." /></CardContent></Card>
    </div>
  )
}
