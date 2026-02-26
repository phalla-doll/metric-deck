import { cookies } from 'next/headers';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  refresh_token?: string;
  is_mock?: boolean;
}

export async function getUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const user = JSON.parse(sessionCookie) as UserSession;
    return user;
  } catch {
    return null;
  }
}
