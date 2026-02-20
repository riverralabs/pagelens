import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  { name: "Free", price: "$0", period: "forever", description: "Try PageLens with basic features", features: ["3 analyses per month", "10 pages per analysis", "1 month history", "Basic scoring (6 categories)", "Community support"], cta: "Get Started", href: "/signup" },
  { name: "Starter", price: "$49", period: "/month", description: "For freelancers and small sites", features: ["5 analyses per month", "50 pages per analysis", "5 months history", "PDF reports", "Email support"], cta: "Start Free Trial", href: "/signup", popular: false },
  { name: "Pro", price: "$149", period: "/month", description: "For agencies and growing businesses", features: ["25 analyses per month", "100 pages per analysis", "Unlimited history", "PDF + Excel reports", "White label reports", "API access", "Up to 5 team members", "Priority support"], cta: "Start Free Trial", href: "/signup", popular: true },
  { name: "Business", price: "$349", period: "/month", description: "For large teams and enterprises", features: ["Unlimited analyses", "500 pages per analysis", "Unlimited history", "Everything in Pro", "Up to 20 team members", "Dedicated support", "Custom integrations"], cta: "Contact Sales", href: "/signup" },
]

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground mt-2">Start free, upgrade when you need more power.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg relative" : ""}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">Most Popular</div>}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2"><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">{plan.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{f}</li>))}</ul>
                <Link href={plan.href}><Button className="w-full" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
