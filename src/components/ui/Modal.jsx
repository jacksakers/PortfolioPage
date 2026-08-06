import { useEffect } from 'react';

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div className="max-w-3xl max-h-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-white text-2xl font-bold"
      >
        &times;
      </button>
    </div>
  );
}
