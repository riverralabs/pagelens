import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Internal webhook: crawl job callbacks
  return NextResponse.json({ message: 'Crawl webhook endpoint' });
}
