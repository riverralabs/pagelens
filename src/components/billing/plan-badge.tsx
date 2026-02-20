import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const planColors: Record<string, string> = {
  FREE: "",
  STARTER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PRO: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  BUSINESS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ENTERPRISE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

export function PlanBadge({ plan }: { plan: string }) {
  return <Badge variant="outline" className={cn(planColors[plan])}>{plan}</Badge>
}
