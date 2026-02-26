import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { TopNav } from '@/components/TopNav';

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav user={user} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight font-mono uppercase mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Account Section */}
          <div className="bg-secondary/20 border border-white/5 rounded-lg p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Connected Account</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full bg-secondary border border-white/10 overflow-hidden flex items-center justify-center">
                {user?.avatar_url ? (
                  <Image src={user.avatar_url} alt="Avatar" fill className="object-cover" unoptimized />
                ) : (
                  <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-green-500/10 text-green-400 px-2.5 py-0.5 text-xs font-medium">
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* OAuth Connection Section */}
          <div className="bg-secondary/20 border border-white/5 rounded-lg p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Google Analytics Connection</h2>
            
            <p className="text-sm text-muted-foreground mb-4">
              Your Google account is connected with read-only access to Google Analytics 4 data.
            </p>
            
            <div className="flex items-center gap-3">
              <form action="/api/auth/url" method="get">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-md transition-colors font-mono uppercase tracking-wider"
                >
                  Reconnect Account
                </button>
              </form>
            </div>
          </div>

          {/* Info */}
          <div className="bg-secondary/10 border border-white/5 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              To disconnect your Google account completely, please visit <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Google Account Permissions</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
