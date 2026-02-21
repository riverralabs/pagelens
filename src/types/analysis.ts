import type { FindingCategory, Severity, Priority, Effort } from '@/generated/prisma/client';

export interface AnalysisScores {
  visual: number;
  copywriting: number;
  ux: number;
  conversion: number;
  seo: number;
  images: number;
}

export interface VisualAnalysisResult {
  scores: {
    visualHierarchy: number;
    layoutQuality: number;
    colorHarmony: number;
    typography: number;
    whitespace: number;
    ctaVisibility: number;
    overall: number;
  };
  findings: FindingInput[];
  summary: string;
}

export interface CopyAnalysisResult {
  scores: {
    headlineEffectiveness: number;
    ctaClarity: number;
    valueProposition: number;
    readability: number;
    toneConsistency: number;
    overall: number;
  };
  findings: FindingInput[];
  summary: string;
}

export interface UXAnalysisResult {
  scores: {
    navigation: number;
    ctaPlacement: number;
    formFriction: number;
    mobileResponsiveness: number;
    overall: number;
  };
  findings: FindingInput[];
  summary: string;
}

export interface ConversionAnalysisResult {
  scores: {
    trustSignals: number;
    socialProof: number;
    urgencyElements: number;
    frictionPoints: number;
    overall: number;
  };
  findings: FindingInput[];
  summary: string;
}

export interface ImageAnalysisResult {
  scores: {
    resolution: number;
    altTextCoverage: number;
    optimization: number;
    relevance: number;
    overall: number;
  };
  findings: FindingInput[];
  summary: string;
}

export interface FindingInput {
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  location?: string;
  evidence?: string;
}

export interface RecommendationInput {
  priority: Priority;
  action: string;
  expectedImpact: string;
  effort: Effort;
  category: string;
}

export interface ReportContent {
  executiveSummary: string;
  sections: ReportSection[];
  topRecommendations: RecommendationInput[];
}

export interface ReportSection {
  title: string;
  content: string;
  score: number;
  keyFindings: string[];
  recommendations: string[];
}

export interface CrawlResult {
  url: string;
  path: string;
  title: string;
  statusCode: number;
  content: ExtractedContent;
  screenshots: {
    viewport: number;
    buffer: Buffer;
    width: number;
    height: number;
  }[];
}

export interface ExtractedContent {
  title: string;
  metaDescription: string;
  metaKeywords: string;
  headings: { level: number; text: string }[];
  paragraphs: string[];
  links: { href: string; text: string; isExternal: boolean }[];
  images: { src: string; alt: string; width?: number; height?: number }[];
  forms: { action: string; fields: string[] }[];
  ctaButtons: { text: string; href?: string }[];
  ogTags: Record<string, string>;
  structuredData: Record<string, unknown>[];
  wordCount: number;
  readabilityScore?: number;
}

export interface SEOCheckResult {
  scores: {
    metaTags: number;
    headings: number;
    coreWebVitals: number;
    structuredData: number;
    overall: number;
  };
  findings: FindingInput[];
  summary: string;
}
