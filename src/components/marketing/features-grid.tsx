import { Card, CardContent } from "@/components/ui/card"
import { Eye, PenTool, Zap, Shield, Search, Palette } from "lucide-react"

const features = [
  { icon: Eye, title: "Visual Design", description: "Layout, typography, color, and hierarchy analysis." },
  { icon: PenTool, title: "Copywriting", description: "Headlines, CTAs, readability, and tone analysis." },
  { icon: Zap, title: "UX/Usability", description: "Navigation, responsiveness, and form friction." },
  { icon: Shield, title: "Conversion", description: "Trust signals, social proof, and friction points." },
  { icon: Search, title: "SEO Health", description: "Meta tags, headings, and Core Web Vitals." },
  { icon: Palette, title: "Image Quality", description: "Resolution, alt text, and optimization." },
]

export function FeaturesGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f) => (
        <Card key={f.title}><CardContent className="pt-6"><f.icon className="h-10 w-10 text-primary mb-4" /><h3 className="font-semibold text-lg">{f.title}</h3><p className="text-sm text-muted-foreground mt-2">{f.description}</p></CardContent></Card>
      ))}
    </div>
  )
}
