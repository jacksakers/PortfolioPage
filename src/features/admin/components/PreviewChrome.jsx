import { useCallback, useRef, useState } from 'react';

const DEFAULT_WIDTH = 440;
const MIN_WIDTH = 320;
const MAX_WIDTH = 720;

// Shared "browser window" chrome used to frame admin live-preview panes.
// Resizable by dragging the left edge on desktop; stacks full-width below the form on mobile.
export default function PreviewChrome({ children, label = 'Live Preview', style, onClick }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const draggingRef = useRef(false);

  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      draggingRef.current = true;
      const startX = e.clientX;
      const startWidth = width;

      const handlePointerMove = (moveEvent) => {
        if (!draggingRef.current) return;
        const delta = startX - moveEvent.clientX;
        setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta)));
      };
      const stopDragging = () => {
        draggingRef.current = false;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', stopDragging);
      };
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', stopDragging);
    },
    [width],
  );

  return (
    <div className="flex items-stretch w-full lg:w-auto lg:inline-flex lg:self-stretch">
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize preview panel"
        onPointerDown={handlePointerDown}
        className="hidden lg:flex w-2.5 shrink-0 cursor-col-resize items-center justify-center -ml-2.5 mr-1 touch-none group"
      >
        <span className="h-10 w-1 rounded-full bg-gray-300 group-hover:bg-[var(--color-primary)] transition-colors" />
      </div>

      <div
        className="w-full lg:w-[var(--preview-width)] lg:shrink-0 lg:h-full min-w-0"
        style={{ '--preview-width': `${width}px` }}
      >
        <p className="lg:hidden mb-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
          📱 Your live preview is below the form — scroll down to see changes as you make them.
        </p>
        <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden lg:sticky lg:top-4">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
            <span className="ml-2 text-xs text-gray-500">{label}</span>
          </div>
          <div className="max-h-[75vh] overflow-y-auto" style={style} onClickCapture={onClick}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
