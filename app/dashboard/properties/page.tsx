import { getUser, getWorkspace } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { PropertySelector } from '@/components/PropertySelector';

export default async function PropertiesPage() {
  const user = await getUser();
  if (!user) {
    redirect('/');
  }

  const workspace = await getWorkspace(user.id);
  if (!workspace) {
    redirect('/');
  }

  // Mock available properties
  const availableProperties = [
    { id: '111', name: 'Acme Corp', url: 'acme.com', accountName: 'Acme Inc' },
    { id: '222', name: 'SaaS Platform', url: 'app.saas.com', accountName: 'Acme Inc' },
    { id: '333', name: 'Marketing Site', url: 'marketing.io', accountName: 'Acme Inc' },
    { id: '444', name: 'Personal Blog', url: 'blog.dev', accountName: 'Personal' },
    { id: '555', name: 'E-commerce Store', url: 'shop.com', accountName: 'Retail LLC' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav user={user} />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Connect Properties</h1>
          <p className="text-muted-foreground mt-2">
            Select the Google Analytics 4 properties you want to monitor in this workspace.
          </p>
        </div>

        <PropertySelector 
          availableProperties={availableProperties} 
          workspaceId={workspace.id} 
        />
      </main>
    </div>
  );
}
