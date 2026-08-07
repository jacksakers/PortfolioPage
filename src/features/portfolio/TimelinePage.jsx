import { useCollection } from '../../hooks/useCollection';
import ItemCard from './components/ItemCard';

// A combined, chronological view of every published post across all sections —
// useful as a CV-style overview of everything on the site.
export default function TimelinePage() {
  const { data: items, loading: itemsLoading } = useCollection('items');
  const { data: sections, loading: sectionsLoading } = useCollection('sections');

  if (itemsLoading || sectionsLoading) return <p className="text-[var(--color-text-muted)]">Loading...</p>;

  const sectionTitle = (id) => sections.find((s) => s.id === id)?.title;

  const sorted = [...items]
    .filter((item) => item.status !== 'draft')
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-[var(--color-text)]">Timeline</h1>

      {sorted.length === 0 && <p className="text-[var(--color-text-muted)]">Nothing here yet.</p>}

      <div className="space-y-6">
        {sorted.map((item) => (
          <div key={item.id} className="space-y-1">
            {sectionTitle(item.sectionId) && (
              <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                {sectionTitle(item.sectionId)}
              </span>
            )}
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
