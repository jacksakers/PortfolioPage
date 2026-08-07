import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A simple homepage photo gallery, shown when siteSettings.galleryImages has photos.
export default function HomeGallery({ images }) {
  const [index, setIndex] = useState(null);

  if (!images?.length) return null;

  const showPrev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };
  const showNext = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-[var(--color-text)]">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <button key={url} onClick={() => setIndex(i)} className="block">
            <img
              src={url}
              alt=""
              className="w-full h-32 object-cover rounded-[var(--radius-card)] hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      <Modal open={index !== null} onClose={() => setIndex(null)}>
        {index !== null && (
          <div className="relative">
            <img src={images[index]} alt="" className="max-h-[85vh] rounded-md" />
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
    </section>
  );
}
