'use client';

import { ChevronDown, Settings, LogOut, Moon, Sun, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export function TopNav({ user }: { user: any }) {
  const [dateRange, setDateRange] = useState("7d");
  const [compare, setCompare] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 md:px-6 w-full max-w-7xl mx-auto">
        
        {/* Left: Logo + Workspace */}
        <div className="flex items-center gap-4 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 text-brand font-mono font-bold uppercase tracking-wider">
            <Logo className="w-6 h-6" />
            <span className="hidden sm:inline-block">MetricDeck</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Workspace
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </div>

        {/* Center: Date Range */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center rounded-md bg-secondary/50 p-1 border border-white/5">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${
                  dateRange === range 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className="text-xs text-muted-foreground font-medium">Compare</span>
            <button 
              onClick={() => setCompare(!compare)}
              className={`w-8 h-4 rounded-full transition-colors relative ${compare ? 'bg-brand' : 'bg-secondary'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${compare ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
          
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
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
