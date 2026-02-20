"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FolderKanban, LayoutDashboard, Settings, HelpCircle, CreditCard, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/projects", icon: FolderKanban },
]

const bottomItems = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Billing", href: "/settings/billing", icon: CreditCard },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center px-6 border-b border-sidebar-border">
        <Link href="/dashboard"><Logo /></Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", pathname === item.href || pathname.startsWith(item.href + "/") ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <Separator className="my-4 mx-3" />
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
