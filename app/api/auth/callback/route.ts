import { NextResponse } from 'next/server';
import { getTokens, getOAuthClient } from '@/lib/google';
import db from '@/lib/db';
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

    // Insert or update user
    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, avatar_url, refresh_token)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        avatar_url = excluded.avatar_url,
        refresh_token = COALESCE(excluded.refresh_token, users.refresh_token)
    `);
    
    stmt.run(
      userInfo.data.id,
      userInfo.data.email,
      userInfo.data.name || '',
      userInfo.data.picture || '',
      tokens.refresh_token || null
    );

    // Create default workspace if not exists
    const wsStmt = db.prepare('SELECT id FROM workspaces WHERE user_id = ? LIMIT 1');
    const existingWs = wsStmt.get(userInfo.data.id);
    
    if (!existingWs) {
      const createWs = db.prepare('INSERT INTO workspaces (id, user_id, name) VALUES (?, ?, ?)');
      createWs.run(`ws_${Date.now()}`, userInfo.data.id, 'My Workspace');
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', userInfo.data.id, {
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
