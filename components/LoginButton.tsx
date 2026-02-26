'use client';

import { useState } from 'react';
import { LogIn, Loader2, ArrowRight } from 'lucide-react';

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/mock', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="group relative inline-flex items-center justify-center gap-3 bg-brand text-black px-8 py-5 font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 overflow-hidden border-2 border-brand hover:border-white"
    >
      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      <span className="relative z-10 flex items-center gap-3">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
        {loading ? 'INITIALIZING...' : 'ENTER DASHBOARD'}
        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </span>
    </button>
  );
}
