'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  users: {
    label: 'Users',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

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

  if (error) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight mb-6 font-mono uppercase">Top Countries</h2>
      <div className="rounded-xl border border-white/10 bg-card overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={countries}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="country"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {value.toLocaleString()} ({item.payload.percentage.toFixed(1)}%)
                      </span>
                    )}
                  />
                }
              />
              <Bar dataKey="users" fill="var(--color-users)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
