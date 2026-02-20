"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" disabled /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Password</CardTitle><CardDescription>Change your password</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
