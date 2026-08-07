import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { where } from 'firebase/firestore';
import { useCollection } from '../../hooks/useCollection';
import SectionItemsLayout from './components/SectionItemsLayout';
import { renderMarkdown } from '../../utils/markdown';

export default function SectionView() {
  const { slug } = useParams();
  // Key remounts the whole subtree per slug so hook state from the previous
  // section (matched sections, items) can never leak into the new one.
  return <SectionViewContent key={slug} slug={slug} />;
}

function SectionViewContent({ slug }) {
  const sectionConstraints = useMemo(() => [where('slug', '==', slug)], [slug]);
  const { data: matchingSections, loading: sectionLoading } = useCollection('sections', sectionConstraints);
  const section = matchingSections[0];

  const isPage = section?.type === 'page';
  const itemConstraints = useMemo(
    () => (section && !isPage ? [where('sectionId', '==', section.id)] : []),
    [section?.id, isPage],
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

  if (isPage) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-[var(--color-text)]">{section.title}</h1>
        <div className="prose-post text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }} />
      </div>
    );
  }

  if (itemsLoading) return <p className="text-[var(--color-text-muted)]">Loading...</p>;

  const sorted = items
    .filter((item) => item.status !== 'draft')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-[var(--color-text)]">{section.title}</h1>
      <SectionItemsLayout type={section.type} items={sorted} sectionSlug={slug} />
    </div>
  );
}
