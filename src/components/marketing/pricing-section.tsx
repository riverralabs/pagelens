import { PricingCards } from "@/components/billing/pricing-cards"

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Simple Pricing</h2>
          <p className="text-muted-foreground mt-2">Start free, upgrade when you need more.</p>
        </div>
        <PricingCards />
      </div>
    </section>
  )
}
