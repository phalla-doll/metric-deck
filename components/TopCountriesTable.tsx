'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function TopCountriesTable() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics/countries');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (json.data) {
          setCountries(json.data);
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
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  if (error) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight mb-6 font-mono uppercase">Top Countries</h2>
      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20 border-b border-white/5 font-mono tracking-wider">
              <tr>
                <th className="p-4 font-medium">Country</th>
                <th className="p-4 font-medium text-right">Users</th>
                <th className="p-4 font-medium text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : (
                countries.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group last:border-0">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{item.country}</div>
                    </td>
                    <td className="p-4 text-right font-mono text-sm">
                      {formatNumber(item.users)}
                    </td>
                    <td className="p-4 text-right font-mono text-sm">
                      <div className="flex items-center justify-end gap-3">
                        <span>{item.percentage.toFixed(1)}%</span>
                        <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
