import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDocument } from '../../hooks/useDocument';
import { useCollection } from '../../hooks/useCollection';
import { renderMarkdown } from '../../utils/markdown';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function ItemDetailPage() {
  const { itemId } = useParams();
  return <ItemDetailContent key={itemId} itemId={itemId} />;
}

function ItemDetailContent({ itemId }) {
  const { data: item, loading } = useDocument('items', itemId);
  const { data: sections } = useCollection('sections');
  const [galleryIndex, setGalleryIndex] = useState(null);

  if (loading) return <p className="text-[var(--color-text-muted)]">Loading...</p>;

  if (!item || item.status === 'draft') {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-[var(--color-text-muted)]">Post not found.</p>
        <Link to="/" className="text-[var(--color-primary)] font-medium">
          Back home
        </Link>
      </div>
    );
  }

  const section = sections.find((s) => s.id === item.sectionId);
  const images = item.images ?? [];

  const showPrev = (e) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i - 1 + images.length) % images.length);
  };
  const showNext = (e) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {section && (
        <Link to={`/portfolio/${section.slug}`} className="text-sm text-[var(--color-primary)] font-medium">
          &larr; Back to {section.title}
        </Link>
      )}

      <Card className="p-6 space-y-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{item.title}</h1>
          {item.date && <p className="text-sm text-[var(--color-text-muted)] mt-1">{item.date}</p>}
        </div>

        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, i) => (
              <button key={url} onClick={() => setGalleryIndex(i)} className="flex-shrink-0">
                <img src={url} alt="" className="h-28 w-28 object-cover rounded-[var(--radius-card)]" />
              </button>
            ))}
          </div>
        )}

        {item.summary && <p className="text-[var(--color-text-muted)]">{item.summary}</p>}

        {item.content && (
          <div
            className="prose-post text-[var(--color-text)]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
          />
        )}

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] px-2 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.links?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.links.map((link) => (
              <Button key={link.url} as="a" href={link.url} target="_blank" rel="noopener noreferrer" className="!px-3 !py-1.5 text-sm">
                {link.title || link.url}
              </Button>
            ))}
          </div>
        )}
      </Card>

      <Modal open={galleryIndex !== null} onClose={() => setGalleryIndex(null)}>
        {galleryIndex !== null && (
          <div className="relative">
            <img src={images[galleryIndex]} alt={item.title} className="max-h-[85vh] rounded-md" />
            {images.length > 1 && (
              <>
                <button
                  onClick={showPrev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={showNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
