import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { getAccessToken, fetchGA4Properties } from '@/lib/google';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we have a refresh token in session
    const refreshToken = user.refresh_token;
    if (!refreshToken || user.is_mock) {
      // Return mock properties if no refresh token (demo mode)
      return NextResponse.json({
        properties: [
          { id: '111', name: 'Acme Corp', accountName: 'Demo Account', url: 'acme.com' },
          { id: '222', name: 'SaaS Platform', accountName: 'Demo Account', url: 'app.saas.com' },
          { id: '333', name: 'Marketing Site', accountName: 'Demo Account', url: 'marketing.io' },
        ],
      });
    }

    // Get fresh access token
    const accessToken = await getAccessToken(refreshToken);
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 401 });
    }
    
    // Fetch real GA4 properties
    const properties = await fetchGA4Properties(accessToken!);

    return NextResponse.json({ properties });
  } catch (error: any) {
    console.error('Error fetching GA4 properties:', error);
    
    // If it's an auth error, return specific message
    if (error?.status === 401 || error?.code === 401) {
      return NextResponse.json({ error: 'Authentication expired. Please reconnect your account.' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
