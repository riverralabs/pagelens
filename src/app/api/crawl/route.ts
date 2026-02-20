import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Internal route: crawl orchestration
  // Called by the crawl worker to process crawl jobs
  return NextResponse.json({ message: 'Crawl orchestration endpoint' });
}
