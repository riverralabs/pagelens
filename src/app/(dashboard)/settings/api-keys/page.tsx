"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">API Keys</h1><p className="text-muted-foreground">Manage your API keys for programmatic access</p></div>
        <Button><Key className="mr-2 h-4 w-4" />Create API Key</Button>
      </div>
      <Card>
        <CardContent className="py-12">
          <EmptyState icon={Key} title="No API keys" description="Create an API key to integrate PageLens into your workflow. Requires Pro plan or higher." />
        </CardContent>
      </Card>
    </div>
  )
}
