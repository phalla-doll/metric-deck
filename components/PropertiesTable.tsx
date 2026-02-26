'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function PropertyRow({ property }: { property: any }) {
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
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="p-4">
        <div className="font-medium text-foreground">{property.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{property.url}</div>
      </td>
      <td className="p-4 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatNumber(totals?.users || 0)}
      </td>
      <td className="p-4 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatNumber(totals?.sessions || 0)}
      </td>
      <td className="p-4 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatNumber(totals?.views || 0)}
      </td>
      <td className="p-4 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : `${(totals?.bounceRate * 100 || 0).toFixed(1)}%`}
      </td>
      <td className="p-4 text-right font-mono text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin inline text-muted-foreground" /> : error ? '-' : formatDuration(totals?.avgDuration || 0)}
      </td>
    </tr>
  );
}

export function PropertiesTable({ properties }: { properties: any[] }) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight mb-6 font-mono uppercase">Sites Summary</h2>
      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20 border-b border-white/5 font-mono tracking-wider">
              <tr>
                <th className="p-4 font-medium">Property</th>
                <th className="p-4 font-medium text-right">Users</th>
                <th className="p-4 font-medium text-right">Sessions</th>
                <th className="p-4 font-medium text-right">Views</th>
                <th className="p-4 font-medium text-right">Bounce Rate</th>
                <th className="p-4 font-medium text-right">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <PropertyRow key={prop.id} property={prop} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
