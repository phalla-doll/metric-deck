'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

function PropertyRow({ property, onDataLoaded }: { property: any, onDataLoaded: (id: string, users: number) => void }) {
  const [totals, setTotals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/analytics?propertyId=${property.id}&days=7`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (json.totals) {
          setTotals(json.totals);
          onDataLoaded(property.id, json.totals.users);
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
  }, [property.id, onDataLoaded]);

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
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-4 py-3">
        <div className="font-medium text-foreground">{property.name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{property.url}</div>
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatNumber(totals?.users || 0)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatNumber(totals?.sessions || 0)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatNumber(totals?.views || 0)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : `${(totals?.bounceRate * 100 || 0).toFixed(1)}%`}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatDuration(totals?.avgDuration || 0)}
      </td>
    </tr>
  );
}

export function PropertiesTable({ properties }: { properties: any[] }) {
  const [propertyUsers, setPropertyUsers] = useState<Record<string, number>>({});

  const handleDataLoaded = useCallback((id: string, users: number) => {
    setPropertyUsers(prev => ({ ...prev, [id]: users }));
  }, []);

  if (!properties || properties.length === 0) return null;

  const totalUsers = Object.values(propertyUsers).reduce((sum, users) => sum + users, 0);
  const isAllLoaded = Object.keys(propertyUsers).length === properties.length;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight font-mono uppercase">Sites Summary</h2>
        <div className="bg-secondary/30 border border-white/10 px-4 py-2 rounded-md flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Total Users</span>
          <span className="font-mono font-bold text-brand">
            {!isAllLoaded ? <Loader2 className="w-4 h-4 animate-spin inline" /> : formatNumber(totalUsers)}
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20 border-b border-white/5 font-mono tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium w-[30%]">Property</th>
                <th className="px-4 py-3 font-medium text-right w-[14%]">Users</th>
                <th className="px-4 py-3 font-medium text-right w-[14%]">Sessions</th>
                <th className="px-4 py-3 font-medium text-right w-[14%]">Views</th>
                <th className="px-4 py-3 font-medium text-right w-[14%]">Bounce Rate</th>
                <th className="px-4 py-3 font-medium text-right w-[14%]">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <PropertyRow key={prop.id} property={prop} onDataLoaded={handleDataLoaded} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
