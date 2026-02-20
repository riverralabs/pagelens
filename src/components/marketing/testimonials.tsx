import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  { name: "Sarah Chen", role: "Head of Marketing, TechCo", quote: "PageLens found issues our team missed for months. The AI-powered insights are incredibly detailed and actionable." },
  { name: "Marcus Johnson", role: "Freelance Designer", quote: "I use PageLens on every client project. The visual design scoring helps me justify design decisions with data." },
  { name: "Emily Rodriguez", role: "Growth Lead, SaaS Startup", quote: "Our conversion rate improved 23% after implementing PageLens recommendations. Worth every penny." },
]

export function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t) => (
        <Card key={t.name}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground italic mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8"><AvatarFallback>{t.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
              <div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
