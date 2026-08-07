import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import SectionItemsLayout from './components/SectionItemsLayout';

// Simple client-side search across all published post titles, summaries, tags and content.
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const { data: items, loading } = useCollection('items');

  const results = useMemo(() => {
    const term = initialQuery.trim().toLowerCase();
    if (!term) return [];
    return items
      .filter((item) => item.status !== 'draft')
      .filter((item) => {
        const haystack = [item.title, item.summary, item.content, ...(item.tags ?? [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [items, initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-[var(--color-text)]">Search</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tags..."
            className="w-full border border-black/10 rounded-[var(--radius-button)] pl-9 pr-3 py-2 bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius-button)] font-medium"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-[var(--color-text-muted)]">Loading...</p>}

      {!loading && initialQuery && (
        <p className="text-sm text-[var(--color-text-muted)]">
          {results.length} result{results.length === 1 ? '' : 's'} for "{initialQuery}"
        </p>
      )}

      {!loading && initialQuery && <SectionItemsLayout type="grid" items={results} />}
    </div>
  );
}
