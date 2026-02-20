import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Eye, Globe, Palette, PenTool, Search, Shield, Zap, Check } from "lucide-react"

const features = [
  { icon: Eye, title: "Visual Design Analysis", description: "AI evaluates layout, typography, color harmony, and visual hierarchy across all viewports." },
  { icon: PenTool, title: "Copywriting Audit", description: "Analyze headlines, CTAs, value propositions, and readability scores." },
  { icon: Zap, title: "UX/Usability Review", description: "Navigation patterns, mobile responsiveness, form friction, and user flow analysis." },
  { icon: Shield, title: "Conversion Readiness", description: "Trust signals, social proof, urgency elements, and friction point identification." },
  { icon: Search, title: "SEO Health Check", description: "Meta tags, heading structure, Core Web Vitals, and structured data audit." },
  { icon: Palette, title: "Image Quality", description: "Resolution, optimization, alt text coverage, and relevance scoring." },
]

const stats = [
  { value: "6", label: "Analysis Dimensions" },
  { value: "3", label: "Viewport Sizes" },
  { value: "100+", label: "Check Points" },
  { value: "< 5min", label: "Analysis Time" },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-6">
            <span className="text-primary font-medium">New</span>
            <span className="mx-2 text-muted-foreground">AI-powered analysis is here</span>
            <ArrowRight className="h-3 w-3" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
            See What Your Visitors See.{" "}
            <span className="text-primary">Fix What They Don&apos;t.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            PageLens uses GPT-4 Vision and Claude to analyze every dimension of your website — visual design, copywriting, UX patterns, SEO health, and conversion readiness. Get actionable insights in minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/signup"><Button size="lg" className="h-12 px-8">Start Free Analysis <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/grader"><Button variant="outline" size="lg" className="h-12 px-8">Try Free Grader</Button></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Comprehensive Analysis, Every Dimension</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Six AI-powered analysis categories give you a complete picture of your website&apos;s strengths and weaknesses.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to improve your website?</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">Start with our free grader or create an account for comprehensive analysis with detailed PDF reports.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/signup"><Button size="lg" variant="secondary" className="h-12 px-8">Get Started Free</Button></Link>
            <Link href="/pricing"><Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">View Pricing</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
