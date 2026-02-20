import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Ready to improve your website?</h2>
        <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">Get AI-powered insights in minutes, not weeks.</p>
        <Link href="/signup"><Button size="lg" variant="secondary" className="mt-8">Get Started Free</Button></Link>
      </div>
    </section>
  )
}
