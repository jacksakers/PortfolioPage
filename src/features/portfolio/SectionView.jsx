import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { where } from 'firebase/firestore';
import { useCollection } from '../../hooks/useCollection';
import SectionItemsLayout from './components/SectionItemsLayout';

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

  if (sectionLoading) return <p className="text-[var(--color-text-muted)]">Loading...</p>;

  if (!section) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-[var(--color-text-muted)]">Section not found.</p>
        <Link to="/" className="text-[var(--color-primary)] font-medium">
          Back home
        </Link>
      </div>
    );
  }

  if (itemsLoading) return <p className="text-[var(--color-text-muted)]">Loading...</p>;

  const sorted = [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-[var(--color-text)]">{section.title}</h1>
      <SectionItemsLayout type={section.type} items={sorted} />
    </div>
  );
}
