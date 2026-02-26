import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { getAccessToken, fetchGA4Data } from '@/lib/google';
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

    // Check if we have a refresh token (real data) or fall back to mock
    const refreshToken = user.refresh_token;
    if (!refreshToken || user.is_mock) {
      // Fallback to mock data if no refresh token (demo mode)
      return getMockData(propertyId, days);
    }

    // Get fresh access token
    const accessToken = await getAccessToken(refreshToken);
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 401 });
    }
    
    // Calculate date range in YYYY-MM-DD format
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
    
    // Fetch real GA4 data
    const ga4Response = await fetchGA4Data(accessToken!, propertyId, startDate, endDate);
    
    // Transform GA4 response to our format
    const rows = ga4Response.rows || [];
    
    const data = rows.map((row: any) => {
      const date = row.dimensionValues?.[0]?.value || '';
      const values = row.metricValues || [];
      
      return {
        date,
        users: parseInt(values[0]?.value || '0', 10),
        sessions: parseInt(values[1]?.value || '0', 10),
        views: parseInt(values[2]?.value || '0', 10),
        bounceRate: parseFloat(values[3]?.value || '0'),
        avgDuration: parseFloat(values[4]?.value || '0'),
      };
    });

    // Calculate totals
    const totals = {
      users: data.reduce((sum, d) => sum + d.users, 0),
      sessions: data.reduce((sum, d) => sum + d.sessions, 0),
      views: data.reduce((sum, d) => sum + d.views, 0),
      bounceRate: data.length > 0 ? data.reduce((sum, d) => sum + d.bounceRate, 0) / data.length : 0,
      avgDuration: data.length > 0 ? data.reduce((sum, d) => sum + d.avgDuration, 0) / data.length : 0,
    };

    return NextResponse.json({ data, totals });
  } catch (error: any) {
    console.error('Error fetching GA4 data:', error);
    
    // If it's an auth error, return specific message
    if (error?.status === 401 || error?.code === 401) {
      return NextResponse.json({ error: 'Authentication expired. Please reconnect your account.' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch GA4 data' }, { status: 500 });
  }
}

function getMockData(propertyId: string, days: number) {
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
}
