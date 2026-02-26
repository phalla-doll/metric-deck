'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Eye, Clock, Activity, Loader2 } from 'lucide-react';

export function PropertyCard({ property }: { property: any }) {
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/analytics?propertyId=${property.id}&days=7`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          setTotals(json.totals);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [property.id]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="rounded-xl border border-white/10 bg-card overflow-hidden flex flex-col group hover:border-white/20 transition-colors">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-foreground truncate max-w-[200px]" title={property.name}>{property.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]" title={property.url}>{property.url || 'No URL'}</p>
        </div>
        <div className="text-right">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : error ? (
            <span className="text-xs text-destructive">Error</span>
          ) : (
            <>
              <div className="text-2xl font-semibold tracking-tight">{formatNumber(totals?.users || 0)}</div>
              <div className="text-xs font-medium text-emerald-500 flex items-center justify-end gap-1 mt-1">
                <Users className="w-3 h-3" />
                Users
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="h-24 w-full bg-secondary/20 p-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/50" />
          </div>
        ) : error || data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="var(--color-brand)" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <YAxis domain={['dataMin', 'dataMax']} hide />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 bg-secondary/10">
        <div className="p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Views
          </span>
          <span className="text-sm font-medium">
            {loading ? '-' : formatNumber(totals?.views || 0)}
          </span>
        </div>
        <div className="p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Time
          </span>
          <span className="text-sm font-medium">
            {loading ? '-' : formatDuration(totals?.avgDuration || 0)}
          </span>
        </div>
        <div className="p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Bounce
          </span>
          <span className="text-sm font-medium">
            {loading ? '-' : `${(totals?.bounceRate * 100 || 0).toFixed(1)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
