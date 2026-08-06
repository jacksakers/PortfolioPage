import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export default function ItemCard({ item }) {
  const [openImage, setOpenImage] = useState(null);
  const thumbnail = item.images?.[0];

  return (
    <Card className="p-4 space-y-3">
      {thumbnail && (
        <button onClick={() => setOpenImage(thumbnail)} className="block w-full">
          <img src={thumbnail} alt={item.title} className="w-full h-40 object-cover rounded-[var(--radius-card)]" />
        </button>
      )}

      <div>
        <h3 className="font-heading font-semibold text-[var(--color-text)]">{item.title}</h3>
        {item.date && <p className="text-sm text-[var(--color-text-muted)]">{item.date}</p>}
      </div>

      {item.description && <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>}

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

      <Modal open={!!openImage} onClose={() => setOpenImage(null)}>
        {openImage && <img src={openImage} alt={item.title} className="max-h-[85vh] rounded-md" />}
      </Modal>
    </Card>
  );
}
