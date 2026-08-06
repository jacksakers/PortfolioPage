import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useCollection } from '../../../hooks/useCollection';

const SECTION_TYPES = ['grid', 'timeline', 'gallery'];
const EMPTY_FORM = { title: '', slug: '', type: 'grid', order: 0 };
const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]';

export default function SectionsPanel() {
  const { data: sections, loading } = useCollection('sections');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (section) => {
    setEditingId(section.id);
    setForm({
      title: section.title ?? '',
      slug: section.slug ?? '',
      type: section.type ?? 'grid',
      order: section.order ?? 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section? Its posts will remain but be orphaned.')) return;
    await deleteDoc(doc(db, 'sections', id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.');
      return;
    }
    const payload = { ...form, order: Number(form.order) || 0 };
    if (editingId) {
      await updateDoc(doc(db, 'sections', editingId), payload);
    } else {
      await addDoc(collection(db, 'sections'), payload);
    }
    resetForm();
  };

  if (loading) return <p className="text-gray-500">Loading sections...</p>;

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900">Sections</h2>

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
        {sorted.map((section) => (
          <li key={section.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-gray-900">{section.title}</p>
              <p className="text-sm text-gray-500">
                /{section.slug} · {section.type} · order {section.order}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(section)} className="text-sm text-[var(--color-primary)] font-medium">
                Edit
              </button>
              <button onClick={() => handleDelete(section.id)} className="text-sm text-red-600 font-medium">
                Delete
              </button>
            </div>
          </li>
        ))}
        {sorted.length === 0 && <li className="px-4 py-3 text-gray-500 text-sm">No sections yet.</li>}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-md p-4">
        <h3 className="font-medium text-gray-900">{editingId ? 'Edit Section' : 'Add Section'}</h3>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            placeholder="Title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Slug (e.g. research)"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {SECTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Order"
            className={inputClass}
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium">
            {editingId ? 'Save Changes' : 'Add Section'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md font-medium text-gray-600">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
