import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
  } catch (error) {
    console.error('Error fetching mock country data:', error);
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 });
  }
}
