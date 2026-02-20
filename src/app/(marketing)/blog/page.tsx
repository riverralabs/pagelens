import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const posts = [
  { slug: "introducing-pagelens", title: "Introducing PageLens: AI-Powered Website Analysis", description: "We're launching PageLens, a comprehensive AI platform that analyzes your website across 6 dimensions. Learn how it works.", date: "2026-02-20", readTime: "5 min" },
  { slug: "why-website-analysis-matters", title: "Why Website Analysis Matters More Than Ever", description: "In 2026, your website is your most important asset. Here's why regular AI-powered analysis is essential.", date: "2026-02-18", readTime: "4 min" },
  { slug: "ai-vision-website-design", title: "How AI Vision Models Evaluate Website Design", description: "A deep dive into how GPT-4 Vision analyzes visual hierarchy, color harmony, and typography on your website.", date: "2026-02-15", readTime: "6 min" },
]

export default function BlogPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>{post.date}</span><span>·</span><span>{post.readTime} read</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
