"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserPlus, Users } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Team</h1><p className="text-muted-foreground">Manage team members</p></div>
        <Button><UserPlus className="mr-2 h-4 w-4" />Invite Member</Button>
      </div>
      <Card>
        <CardContent className="py-12">
          <EmptyState icon={Users} title="No team members" description="Invite team members to collaborate on your projects." action={<Button><UserPlus className="mr-2 h-4 w-4" />Invite Member</Button>} />
        </CardContent>
      </Card>
    </div>
  )
}
