import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { properties, workspaceId } = await request.json();

    if (!Array.isArray(properties) || !workspaceId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Mock saving properties
    console.log('Mock saving properties:', properties);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving properties:', error);
    return NextResponse.json({ error: 'Failed to save properties' }, { status: 500 });
  }
}
