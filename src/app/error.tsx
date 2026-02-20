"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2">An unexpected error occurred.</p>
      <Button onClick={reset} className="mt-4">Try again</Button>
    </div>
  )
}
