import { getUser, getWorkspace, getProperties } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { DurationFilter } from '@/components/DurationFilter';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertiesTable } from '@/components/PropertiesTable';
import { TopCountriesTable } from '@/components/TopCountriesTable';
import { Plus, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/');
  }

  const workspace = await getWorkspace(user.id);
  const properties = workspace ? await getProperties(workspace.id) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav user={user} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight font-mono uppercase">Overview</h1>
          <div className="flex-1" />
          <DurationFilter />
          <Link
            href="/dashboard/properties"
            className="flex items-center gap-2 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-md transition-colors font-mono uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center border border-dashed border-white/10 rounded-xl bg-secondary/10">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No properties connected</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Connect your Google Analytics 4 properties to start monitoring your metrics.
            </p>
            <Link 
              href="/dashboard/properties"
              className="flex items-center gap-2 bg-brand text-black px-6 py-3 font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Connect GA4 Properties
            </Link>
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
