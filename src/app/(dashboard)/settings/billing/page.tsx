"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Check } from "lucide-react"
import { PLAN_LIMITS, PLAN_PRICES } from "@/lib/constants"

const plans = [
  { name: "Free", price: "$0", features: ["3 analyses/month", "10 pages max", "Basic scoring"] },
  { name: "Starter", price: "$49", features: ["5 analyses/month", "50 pages max", "Full scoring", "PDF reports"] },
  { name: "Pro", price: "$149", features: ["25 analyses/month", "100 pages max", "Full scoring", "PDF + Excel", "White label", "API access", "5 team members"] },
  { name: "Business", price: "$349", features: ["Unlimited analyses", "500 pages max", "Everything in Pro", "20 team members", "Priority support"] },
]

export default function BillingPage() {
  const [currentPlan] = useState("FREE")

  const handleUpgrade = async (plan: string) => {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, priceId: `price_${plan.toLowerCase()}` }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Billing</h1><p className="text-muted-foreground">Manage your subscription</p></div>
      <Card>
        <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="text-lg px-3 py-1">{currentPlan}</Badge>
              <p className="text-sm text-muted-foreground mt-1">0 of 3 analyses used this month</p>
            </div>
            <Progress value={0} max={3} className="w-32" />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.name === "Pro" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription><span className="text-2xl font-bold text-foreground">{plan.price}</span>/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500" />{f}</li>))}
              </ul>
              <Button className="w-full" variant={plan.name === currentPlan ? "outline" : plan.name === "Pro" ? "default" : "secondary"} disabled={plan.name === "Free"} onClick={() => handleUpgrade(plan.name.toUpperCase())}>
                {plan.name === currentPlan ? "Current" : plan.name === "Free" ? "Free" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
