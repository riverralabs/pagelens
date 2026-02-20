import Link from "next/link"
import { Logo } from "@/components/shared/logo"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">See What Your Visitors See. Fix What They Don&apos;t.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <nav className="space-y-2 text-sm text-muted-foreground">
              <Link href="/features" className="block hover:text-foreground">Features</Link>
              <Link href="/pricing" className="block hover:text-foreground">Pricing</Link>
              <Link href="/grader" className="block hover:text-foreground">Free Grader</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <nav className="space-y-2 text-sm text-muted-foreground">
              <Link href="/blog" className="block hover:text-foreground">Blog</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <nav className="space-y-2 text-sm text-muted-foreground">
              <Link href="/pricing" className="block hover:text-foreground">Pricing</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} PageLens. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
