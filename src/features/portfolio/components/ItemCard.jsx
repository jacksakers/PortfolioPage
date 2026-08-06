import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';

export default function ItemCard({ item }) {
  const [openImage, setOpenImage] = useState(null);
  const thumbnail = item.images?.[0];

  return (
    <Card className="p-4 space-y-3">
      {thumbnail && (
        <button onClick={() => setOpenImage(thumbnail)} className="block w-full">
          <img src={thumbnail} alt={item.title} className="w-full h-40 object-cover rounded-md" />
        </button>
      )}

      <div>
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        {item.date && <p className="text-sm text-gray-500">{item.date}</p>}
      </div>

      {item.description && <p className="text-sm text-gray-600">{item.description}</p>}

      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.links?.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {item.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              {link.title || link.url}
            </a>
          ))}
        </div>
      )}

      <Modal open={!!openImage} onClose={() => setOpenImage(null)}>
        {openImage && <img src={openImage} alt={item.title} className="max-h-[85vh] rounded-md" />}
      </Modal>
    </Card>
  );
}
