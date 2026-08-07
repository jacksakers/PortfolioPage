import { useCollection } from '../../../hooks/useCollection';
import SectionItemsLayout from './SectionItemsLayout';

const MAX_POSTS = 3;

// Shows manually "featured" posts on the homepage; falls back to the most
// recent published posts across all sections if none are featured.
export default function FeaturedPosts() {
  const { data: items, loading } = useCollection('items');

  if (loading) return null;

  const published = items.filter((item) => item.status !== 'draft');
  const featured = published.filter((item) => item.featured);
  const source = featured.length > 0 ? featured : published;
  const sorted = [...source].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, MAX_POSTS);

  if (sorted.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-[var(--color-text)]">
        {featured.length > 0 ? 'Featured' : 'Recent Posts'}
      </h2>
      <SectionItemsLayout type="grid" items={sorted} />
    </section>
  );
}
