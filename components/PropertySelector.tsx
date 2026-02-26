'use client';

import { useState } from 'react';
import { Check, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PropertySelector({ availableProperties, workspaceId }: { availableProperties: any[], workspaceId: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const filtered = availableProperties.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.accountName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProperty = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const selectedProps = availableProperties.filter(p => selected.has(p.id));
      
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: selectedProps, workspaceId }),
      });
      
      if (res.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to save properties');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-white/10 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-secondary/20">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search properties..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
        />
      </div>
      
      <div className="max-h-[400px] overflow-y-auto p-2">
        {availableProperties.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No GA4 properties found for this account.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No properties match your search.
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map(prop => (
              <button
                key={prop.id}
                onClick={() => toggleProperty(prop.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  selected.has(prop.id) 
                    ? 'bg-brand/10 border border-brand/20' 
                    : 'hover:bg-secondary/50 border border-transparent'
                }`}
              >
                <div>
                  <div className="font-medium text-sm text-foreground">{prop.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{prop.accountName} • {prop.id}</div>
                </div>
                {selected.has(prop.id) && (
                  <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/5 bg-secondary/10 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selected.size} selected
        </div>
        <button
          onClick={handleSave}
          disabled={selected.size === 0 || saving}
          className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Connect Selected'}
        </button>
      </div>
    </div>
  );
}
