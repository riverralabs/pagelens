import { Card, CardContent } from "@/components/ui/card"
import { Eye, PenTool, Zap, Shield, Search, Palette, Camera, FileText, BarChart3 } from "lucide-react"

const features = [
  { icon: Eye, title: "Visual Design Analysis", description: "Our AI evaluates layout quality, whitespace usage, color harmony, typography choices, and visual hierarchy. Get scores across desktop, tablet, and mobile viewports." },
  { icon: PenTool, title: "Copywriting Audit", description: "Analyze headline effectiveness, CTA clarity, value proposition strength, readability scores (Flesch-Kincaid), and tone consistency across all pages." },
  { icon: Zap, title: "UX/Usability Review", description: "Evaluate navigation patterns, CTA placement, form friction points, and mobile responsiveness with actionable recommendations." },
  { icon: Shield, title: "Conversion Readiness", description: "Assess trust signals (testimonials, security badges), social proof elements, urgency indicators, and identify conversion friction points." },
  { icon: Search, title: "SEO Health Check", description: "Check meta tags, heading structure, Core Web Vitals via PageSpeed API, broken links, and structured data compliance." },
  { icon: Palette, title: "Image Quality Assessment", description: "Evaluate image resolution, alt text coverage, file optimization, and content relevance for every image on your site." },
  { icon: Camera, title: "Multi-Viewport Screenshots", description: "Capture full-page screenshots at 1440px (desktop), 768px (tablet), and 375px (mobile) for every page analyzed." },
  { icon: FileText, title: "Professional Reports", description: "Generate detailed PDF and Excel reports with executive summaries, annotated screenshots, and prioritized recommendations." },
  { icon: BarChart3, title: "Score Tracking", description: "Track your scores over time, compare analyses, and measure improvement across all six categories." },
]

export default function FeaturesPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">Every Feature You Need</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">PageLens combines AI vision analysis, content auditing, and technical checks into one comprehensive platform.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="pt-6">
                <f.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
