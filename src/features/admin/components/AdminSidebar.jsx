const NAV_ITEMS = [
  { id: 'settings', label: 'Site Settings' },
  { id: 'sections', label: 'Sections' },
  { id: 'items', label: 'Posts' },
  { id: 'data', label: 'Data Hub' },
];

export default function AdminSidebar({ activeTab, onSelectTab, onLogout }) {
  return (
    <aside className="w-full md:w-56 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 flex md:flex-col gap-2">
      <nav className="flex md:flex-col gap-1 flex-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`text-left px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 whitespace-nowrap"
      >
        Log Out
      </button>
    </aside>
  );
}
