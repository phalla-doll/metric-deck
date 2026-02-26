import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { DurationFilter } from '@/components/DurationFilter';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertiesTable } from '@/components/PropertiesTable';
import { TopCountriesTable } from '@/components/TopCountriesTable';

async function getPropertiesFromAPI(): Promise<any[]> {
  try {
    const res = await fetch('/api/properties', {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch properties:', res.status);
      return [];
    }
    
    const data = await res.json();
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/');
  }

  // Fetch all GA4 properties directly from API
  const properties = await getPropertiesFromAPI();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav user={user} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight font-mono uppercase">Overview</h1>
          <div className="flex-1" />
          <DurationFilter />
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {user.is_mock 
                ? 'Demo mode active. Mock data will be displayed.' 
                : 'Unable to fetch your GA4 properties. Please try reconnecting your account.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop: any) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
            
            <PropertiesTable properties={properties} />
            <TopCountriesTable />
          </>
        )}
      </main>
    </div>
  );
}
