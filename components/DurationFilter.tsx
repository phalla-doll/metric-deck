'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DurationFilter() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <Select value={dateRange} onValueChange={setDateRange}>
      <SelectTrigger className="w-[100px] bg-secondary/50 border-white/5 text-xs font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">7d</SelectItem>
        <SelectItem value="30d">30d</SelectItem>
        <SelectItem value="90d">90d</SelectItem>
      </SelectContent>
    </Select>
  );
}
