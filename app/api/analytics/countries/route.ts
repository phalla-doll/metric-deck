import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { getAccessToken, fetchGA4Countries } from '@/lib/google';
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
      return getMockData();
    }

    // Get fresh access token
    const accessToken = await getAccessToken(refreshToken);
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 401 });
    }
    
    // Calculate date range in YYYY-MM-DD format
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
    
    // Fetch real GA4 country data
    const ga4Response = await fetchGA4Countries(accessToken!, propertyId, startDate, endDate);
    
    // Transform GA4 response to our format
    const rows = ga4Response.rows || [];
    const totalUsers = rows.reduce((sum: number, row: any) => {
      return sum + parseInt(row.metricValues?.[0]?.value || '0', 10);
    }, 0);
    
    const countries = rows.map((row: any) => {
      const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
      return {
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        users,
        percentage: totalUsers > 0 ? (users / totalUsers) * 100 : 0,
      };
    });

    return NextResponse.json({ data: countries });
  } catch (error: any) {
    console.error('Error fetching GA4 country data:', error);
    
    // If it's an auth error, return specific message
    if (error?.status === 401 || error?.code === 401) {
      return NextResponse.json({ error: 'Authentication expired. Please reconnect your account.' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 });
  }
}

function getMockData() {
  // Mock country data
  const countries = [
    { country: 'United States', users: 45200, percentage: 45.2 },
    { country: 'United Kingdom', users: 12500, percentage: 12.5 },
    { country: 'Germany', users: 9800, percentage: 9.8 },
    { country: 'Canada', users: 7400, percentage: 7.4 },
    { country: 'Australia', users: 5100, percentage: 5.1 },
    { country: 'France', users: 4200, percentage: 4.2 },
    { country: 'Japan', users: 3800, percentage: 3.8 },
    { country: 'Brazil', users: 2100, percentage: 2.1 },
  ];

  return NextResponse.json({ data: countries });
}
