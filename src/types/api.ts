export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CreateProjectRequest {
  name: string;
  url: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  settings?: {
    crawlDepth?: number;
    maxPages?: number;
    viewports?: number[];
  };
}

export interface StartAnalysisRequest {
  crawlDepth?: number;
  maxPages?: number;
}

export interface GraderRequest {
  url: string;
}

export interface GraderResponse {
  url: string;
  overallScore: number;
  scores: {
    visual: number;
    copywriting: number;
    ux: number;
    conversion: number;
    seo: number;
    images: number;
  };
  topFindings: {
    title: string;
    description: string;
    severity: string;
    category: string;
  }[];
  summary: string;
}

export interface AnalysisStatusEvent {
  status: string;
  pagesFound: number;
  pagesCrawled: number;
  pagesAnalyzed: number;
  overallScore?: number;
  message?: string;
}
