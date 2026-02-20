"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  { name: "Free", price: 0, features: ["3 analyses/month", "10 pages max", "Basic scoring"] },
  { name: "Starter", price: 49, features: ["5 analyses/month", "50 pages max", "PDF reports"] },
  { name: "Pro", price: 149, features: ["25 analyses/month", "100 pages max", "PDF + Excel", "White label", "API access", "5 team members"], popular: true },
  { name: "Business", price: 349, features: ["Unlimited analyses", "500 pages max", "Everything in Pro", "20 team members"] },
]

interface PricingCardsProps {
  currentPlan?: string
  onUpgrade?: (plan: string) => void
}

export function PricingCards({ currentPlan = "FREE", onUpgrade }: PricingCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription><span className="text-2xl font-bold text-foreground">${plan.price}</span>/month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">{plan.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500" />{f}</li>))}</ul>
            <Button className="w-full" variant={plan.popular ? "default" : "outline"} disabled={plan.name.toUpperCase() === currentPlan} onClick={() => onUpgrade?.(plan.name.toUpperCase())}>
              {plan.name.toUpperCase() === currentPlan ? "Current Plan" : "Upgrade"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
