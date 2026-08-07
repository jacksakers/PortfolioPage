import ItemCard from './ItemCard';

// Shared item-grid/timeline/gallery rendering used by both the public SectionView
// page and the admin Sections live preview, so they always stay in sync.
export default function SectionItemsLayout({ type, items, sectionSlug }) {
  if (items.length === 0) {
    return <p className="text-[var(--color-text-muted)]">Nothing here yet.</p>;
  }

  const layoutClass =
    type === 'timeline'
      ? 'space-y-4'
      : type === 'gallery'
        ? 'grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={layoutClass}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} sectionSlug={sectionSlug} />
      ))}
    </div>
  );
}
