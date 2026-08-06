// Shared "browser window" chrome used to frame admin live-preview panes.
export default function PreviewChrome({ children, label = 'Live Preview', style, onClick }) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-4">
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
  );
}
