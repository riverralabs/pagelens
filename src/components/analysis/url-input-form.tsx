"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Loader2 } from "lucide-react"

interface UrlInputFormProps {
  onSubmit: (url: string) => void
  loading?: boolean
  placeholder?: string
}

export function UrlInputForm({ onSubmit, loading, placeholder = "Enter website URL..." }: UrlInputFormProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = url.startsWith("http") ? url : `https://${url}`
    onSubmit(normalized)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder={placeholder} value={url} onChange={(e) => setUrl(e.target.value)} className="pl-9" required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
      </Button>
    </form>
  )
}
