"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function ProjectSettingsPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Settings</h1>
      <Card>
        <CardHeader><CardTitle>General</CardTitle><CardDescription>Update your project details</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Project Name</Label><Input placeholder="My Website" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe your project..." /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Crawl Settings</CardTitle><CardDescription>Configure how your website is crawled</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Crawl Depth</Label><Input type="number" defaultValue={2} min={1} max={5} /></div>
          <div className="space-y-2"><Label>Max Pages</Label><Input type="number" defaultValue={50} min={1} max={500} /></div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle><CardDescription>Irreversible actions</CardDescription></CardHeader>
        <CardContent><Button variant="destructive">Delete Project</Button></CardContent>
      </Card>
    </div>
  )
}
