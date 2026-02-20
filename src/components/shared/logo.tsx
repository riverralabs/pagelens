import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <Eye className="h-5 w-5 text-primary-foreground" />
      </div>
      {showText && <span className="text-xl font-bold">PageLens</span>}
    </div>
  )
}
