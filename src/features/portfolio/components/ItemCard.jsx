import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export default function ItemCard({ item }) {
  const [galleryIndex, setGalleryIndex] = useState(null);
  const images = item.images ?? [];
  const thumbnail = images[0];
  const summary = item.summary ?? item.description ?? '';
  const hasFullContent = !!item.content;

  const showPrev = (e) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i - 1 + images.length) % images.length);
  };
  const showNext = (e) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i + 1) % images.length);
  };

  return (
    <Card className="p-4 space-y-3">
      {thumbnail && (
        <button onClick={() => setGalleryIndex(0)} className="block w-full relative group">
          <img src={thumbnail} alt={item.title} className="w-full h-40 object-cover rounded-[var(--radius-card)]" />
          {images.length > 1 && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              +{images.length - 1} more
            </span>
          )}
        </button>
      )}

      <div>
        <h3 className="font-heading font-semibold text-[var(--color-text)]">{item.title}</h3>
        {item.date && <p className="text-sm text-[var(--color-text-muted)]">{item.date}</p>}
      </div>

      {summary && <p className="text-sm text-[var(--color-text-muted)]">{summary}</p>}

      {hasFullContent && (
        <Link
          to={`/post/${item.id}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          Read more
        </Link>
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
            <Button
              key={link.url}
              as="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="!px-3 !py-1.5 text-sm"
            >
              {link.title || link.url}
            </Button>
          ))}
        </div>
      )}

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
                <p className="text-center text-white text-xs mt-1">
                  {galleryIndex + 1} / {images.length}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}
