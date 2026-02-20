import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-4">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}
