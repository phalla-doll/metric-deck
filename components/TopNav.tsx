'use client';

import { Settings, LogOut, Moon, Sun, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/Logo";

export function TopNav({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 md:px-6 w-full max-w-7xl mx-auto">

        {/* Left: Logo */}
        <div className="flex items-center gap-4 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 text-brand font-mono font-bold uppercase tracking-wider">
            <Logo className="w-6 h-6" />
            <span className="hidden sm:inline-block">MetricDeck</span>
          </Link>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            <Moon className="h-4 w-4" />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-secondary border border-white/10 overflow-hidden flex items-center justify-center">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium">{user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
