import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
          See What Your Visitors See.{" "}
          <span className="text-primary">Fix What They Don&apos;t.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered website analysis across visual design, copywriting, UX patterns, SEO health, and conversion readiness.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/signup"><Button size="lg">Start Free Analysis <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          <Link href="/grader"><Button variant="outline" size="lg">Try Free Grader</Button></Link>
        </div>
      </div>
    </section>
  )
}
