import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await ratelimit.limit(`tracking:${ip}`);
    if (!success) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

    const events = await request.json();

    // TODO: In future sprints, forward to ClickHouse via Kafka
    // For now, acknowledge receipt
    return NextResponse.json({ received: true, count: Array.isArray(events) ? events.length : 1 });
  } catch (error) {
    console.error('POST /api/tracking/events error:', error);
    return NextResponse.json({ error: 'Failed to ingest events' }, { status: 500 });
  }
}
