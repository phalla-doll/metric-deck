import { NextResponse } from 'next/server';
import { getTokens, getOAuthClient } from '@/lib/google';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const tokens = await getTokens(code);
    const client = getOAuthClient(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const userInfo = await oauth2.userinfo.get();

    if (!userInfo.data.email || !userInfo.data.id) {
      throw new Error('Failed to get user info');
    }

    // Create user session object
    const userSession = {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name || '',
      avatar_url: userInfo.data.picture || '',
      refresh_token: tokens.refresh_token || '',
    };

    // Set session cookie with user data
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Return HTML to close popup and notify parent
    return new NextResponse(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/dashboard';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
