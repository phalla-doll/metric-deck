import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { subDays, format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const days = parseInt(searchParams.get('days') || '7', 10);

    if (!propertyId) {
      return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
    }

    // Generate mock data based on propertyId to make it look somewhat consistent
    const seed = parseInt(propertyId.replace(/\D/g, '') || '123', 10);
    const baseUsers = (seed % 10) * 1000 + 500;
    
    const data = Array.from({ length: days }).map((_, i) => {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyyMMdd');
      const users = Math.floor(baseUsers + Math.random() * (baseUsers * 0.5));
      const sessions = Math.floor(users * (1 + Math.random() * 0.5));
      const views = Math.floor(sessions * (1.5 + Math.random() * 2));
      const bounceRate = 0.3 + Math.random() * 0.4;
      const avgDuration = 60 + Math.random() * 120;
      
      return { date, users, sessions, views, bounceRate, avgDuration };
    });

    const totals = {
      users: data.reduce((sum, d) => sum + d.users, 0),
      sessions: data.reduce((sum, d) => sum + d.sessions, 0),
      views: data.reduce((sum, d) => sum + d.views, 0),
      bounceRate: data.reduce((sum, d) => sum + d.bounceRate, 0) / data.length,
      avgDuration: data.reduce((sum, d) => sum + d.avgDuration, 0) / data.length,
    };

    return NextResponse.json({ data, totals });
  } catch (error) {
    console.error('Error fetching mock GA4 data:', error);
    return NextResponse.json({ error: 'Failed to fetch GA4 data' }, { status: 500 });
  }
}
