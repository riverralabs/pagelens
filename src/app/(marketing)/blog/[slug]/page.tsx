import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const posts: Record<string, { title: string; date: string; content: string }> = {
  "introducing-pagelens": {
    title: "Introducing PageLens: AI-Powered Website Analysis",
    date: "February 20, 2026",
    content: `We're excited to announce the launch of PageLens, an AI-powered SaaS platform that analyzes your website across six critical dimensions: Visual Design, Copywriting, UX/Usability, Conversion Readiness, SEO Health, and Image Quality.

## How It Works

1. **Submit your URL** — PageLens crawls your entire website, capturing screenshots at three viewport sizes (desktop, tablet, mobile).
2. **AI Analysis** — GPT-4 Vision analyzes your screenshots for visual design quality, while our text analysis engine evaluates your copy, UX patterns, and conversion elements.
3. **Get Your Report** — Receive a comprehensive report with scores, findings, and prioritized recommendations you can act on immediately.

## Why PageLens?

Traditional website audits are expensive, subjective, and slow. PageLens gives you an objective, AI-powered analysis in minutes — not weeks.

Start your free analysis today and see what your visitors see.`,
  },
  "why-website-analysis-matters": {
    title: "Why Website Analysis Matters More Than Ever",
    date: "February 18, 2026",
    content: `In 2026, your website is often the first interaction a potential customer has with your brand. Yet most businesses launch their site and rarely revisit it with fresh eyes.

## The Cost of a Poor Website

Studies show that 88% of users are less likely to return after a bad experience. Poor design, confusing navigation, and weak copy cost businesses millions in lost conversions.

## What Regular Analysis Catches

- **Visual inconsistencies** that erode trust
- **Copy weaknesses** that fail to convert
- **UX friction** that drives users away
- **SEO issues** that limit your reach
- **Image problems** that slow your site

Regular AI-powered analysis ensures your website stays optimized and competitive.`,
  },
  "ai-vision-website-design": {
    title: "How AI Vision Models Evaluate Website Design",
    date: "February 15, 2026",
    content: `GPT-4 Vision represents a breakthrough in how we can programmatically evaluate visual design quality. Here's how PageLens leverages it.

## Visual Hierarchy Analysis

The model evaluates how well your page guides the viewer's eye, checking for clear heading hierarchy, proper use of size and contrast, and logical content flow.

## Color Harmony

AI assesses your color palette for consistency, contrast ratios (WCAG compliance), and overall aesthetic appeal.

## Typography

Font choices, sizing, line height, and readability are all evaluated against best practices.

## Layout Quality

The model checks for balanced use of whitespace, grid consistency, alignment, and responsive behavior across viewports.

Each dimension receives a score from 0-100, giving you a clear picture of where your visual design excels and where it needs improvement.`,
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return <div className="py-24 container mx-auto px-4 text-center"><h1 className="text-2xl font-bold">Post not found</h1></div>

  return (
    <div className="py-24">
      <article className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Button></Link>
        <h1 className="text-4xl font-bold mt-6">{post.title}</h1>
        <p className="text-muted-foreground mt-2">{post.date}</p>
        <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
            if (paragraph.startsWith('- ')) return <ul key={i} className="list-disc pl-6 space-y-1">{paragraph.split('\n').map((item, j) => <li key={j} className="text-muted-foreground">{item.replace('- ', '')}</li>)}</ul>
            return <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>
          })}
        </div>
      </article>
    </div>
  )
}
