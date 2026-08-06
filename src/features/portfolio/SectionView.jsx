import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { where } from 'firebase/firestore';
import { useCollection } from '../../hooks/useCollection';
import ItemCard from './components/ItemCard';

export default function SectionView() {
  const { slug } = useParams();

  const sectionConstraints = useMemo(() => [where('slug', '==', slug)], [slug]);
  const { data: matchingSections, loading: sectionLoading } = useCollection('sections', sectionConstraints);
  const section = matchingSections[0];

  const itemConstraints = useMemo(
    () => (section ? [where('sectionId', '==', section.id)] : []),
    [section?.id],
  );
  const { data: items, loading: itemsLoading } = useCollection('items', itemConstraints);

  if (sectionLoading) return <p className="text-gray-500">Loading...</p>;

  if (!section) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-gray-600">Section not found.</p>
        <Link to="/" className="text-[var(--color-primary)] font-medium">
          Back home
        </Link>
      </div>
    );
  }

  if (itemsLoading) return <p className="text-gray-500">Loading...</p>;

  const sorted = [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const layoutClass = section.type === 'timeline' ? 'space-y-4' : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">{section.title}</h1>
      {sorted.length === 0 ? (
        <p className="text-gray-500">Nothing here yet.</p>
      ) : (
        <div className={layoutClass}>
          {sorted.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
