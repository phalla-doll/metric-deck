import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Create mock user session
  const mockSession = {
    id: 'mock_user_123',
    email: 'demo@metricdeck.io',
    name: 'Demo User',
    avatar_url: '',
    refresh_token: '',
    is_mock: true,
  };

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(mockSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  return NextResponse.json({ success: true });
}
