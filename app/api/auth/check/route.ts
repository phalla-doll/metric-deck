import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  
  return NextResponse.json({ 
    authenticated: !!user,
    user: user ? { 
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      is_mock: user.is_mock 
    } : null 
  });
}
