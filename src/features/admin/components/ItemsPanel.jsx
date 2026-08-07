import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { db } from '../../../firebaseConfig';
import { useCollection } from '../../../hooks/useCollection';
import ItemForm from './ItemForm';

export default function ItemsPanel() {
  const { data: sections } = useCollection('sections');
  const { data: items, loading } = useCollection('items');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const sectionTitle = (id) => sections.find((s) => s.id === id)?.title ?? 'Unknown section';

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await deleteDoc(doc(db, 'items', id));
  };

  const handleSubmit = async (data) => {
    if (editingItem) {
      await updateDoc(doc(db, 'items', editingItem.id), data);
    } else {
      const siblings = items.filter((i) => i.sectionId === data.sectionId);
      const nextOrder = siblings.length ? Math.max(...siblings.map((i) => i.order ?? 0)) + 1 : 0;
      await addDoc(collection(db, 'items'), { ...data, order: nextOrder });
    }
    setEditingItem(null);
    setShowForm(false);
  };

  const moveItem = async (item, direction) => {
    const siblings = [...items]
      .filter((i) => i.sectionId === item.sectionId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const index = siblings.findIndex((i) => i.id === item.id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;
    const target = siblings[targetIndex];
    await Promise.all([
      updateDoc(doc(db, 'items', item.id), { order: target.order ?? 0 }),
      updateDoc(doc(db, 'items', target.id), { order: item.order ?? 0 }),
    ]);
  };

  if (loading) return <p className="text-gray-500">Loading posts...</p>;

  const sortedItems = [...items].sort((a, b) => {
    if (a.sectionId !== b.sectionId) return sectionTitle(a.sectionId).localeCompare(sectionTitle(b.sectionId));
    return (a.order ?? 0) - (b.order ?? 0);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
        {!showForm && (
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium text-sm"
          >
            Add Post
          </button>
        )}
      </div>

      {showForm && (
        <ItemForm
          sections={sections}
          initialItem={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md max-w-2xl">
        {sortedItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <button
                  onClick={() => moveItem(item, -1)}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveItem(item, 1)}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label="Move down"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  {item.title}
                  {item.status === 'draft' && (
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Draft
                    </span>
                  )}
                  {item.featured && (
                    <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-1.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {sectionTitle(item.sectionId)} · {item.date}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setShowForm(true);
                }}
                className="text-sm text-[var(--color-primary)] font-medium"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 font-medium">
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="px-4 py-3 text-gray-500 text-sm">No posts yet.</li>}
      </ul>
    </div>
  );
}
