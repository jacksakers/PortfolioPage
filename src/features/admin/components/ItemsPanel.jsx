import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
      await addDoc(collection(db, 'items'), data);
    }
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading) return <p className="text-gray-500">Loading posts...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
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

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">
                {sectionTitle(item.sectionId)} · {item.date}
              </p>
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
