import { useEffect, useState } from 'react';
import { useStorage } from '../../../hooks/useStorage';
import ItemCard from '../../portfolio/components/ItemCard';
import PreviewChrome from './PreviewChrome';

const EMPTY_ITEM = {
  sectionId: '',
  title: '',
  date: '',
  description: '',
  images: [],
  links: [],
  tags: [],
};

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]';

export default function ItemForm({ sections, initialItem, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_ITEM);
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const { uploadFile, uploading, progress } = useStorage();

  useEffect(() => {
    if (initialItem) {
      setForm({ ...EMPTY_ITEM, ...initialItem });
      setTagsInput((initialItem.tags ?? []).join(', '));
    } else {
      setForm(EMPTY_ITEM);
      setTagsInput('');
    }
  }, [initialItem]);

  useEffect(() => {
    if (!file) {
      setFilePreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const updateLink = (index, field, value) => {
    const links = [...form.links];
    links[index] = { ...links[index], [field]: value };
    setForm({ ...form, links });
  };

  const addLink = () => setForm({ ...form, links: [...form.links, { title: '', url: '' }] });
  const removeLink = (index) => setForm({ ...form, links: form.links.filter((_, i) => i !== index) });
  const removeImage = (url) => setForm({ ...form, images: form.images.filter((img) => img !== url) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let images = form.images;
    if (file) {
      const url = await uploadFile(file, `items/${Date.now()}-${file.name}`);
      images = [...images, url];
    }
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSubmit({ ...form, images, tags });
  };

  const previewItem = {
    id: 'preview',
    title: form.title,
    date: form.date,
    description: form.description,
    tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    links: form.links.filter((link) => link.url),
    images: filePreviewUrl ? [...form.images, filePreviewUrl] : form.images,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] items-start">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-md p-4">
        <h3 className="font-medium text-gray-900">{initialItem ? 'Edit Post' : 'Add Post'}</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className={inputClass}
            value={form.sectionId}
            onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
            required
          >
            <option value="">Select section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>

        <input
          placeholder="Title"
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          rows={3}
          placeholder="Description"
          className={inputClass}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Tags (comma separated)"
          className={inputClass}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Images</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-16 w-16 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-1.5 -right-1.5 bg-white border border-gray-300 rounded-full text-xs h-5 w-5 leading-none"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {uploading && <p className="text-sm text-gray-500">Uploading... {Math.round(progress)}%</p>}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Links</p>
          {form.links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Title"
                className={inputClass}
                value={link.title}
                onChange={(e) => updateLink(i, 'title', e.target.value)}
              />
              <input
                placeholder="URL"
                className={inputClass}
                value={link.url}
                onChange={(e) => updateLink(i, 'url', e.target.value)}
              />
              <button type="button" onClick={() => removeLink(i)} className="text-red-600 text-sm">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addLink} className="text-sm text-[var(--color-primary)] font-medium">
            + Add Link
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {initialItem ? 'Save Changes' : 'Add Post'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md font-medium text-gray-600">
            Cancel
          </button>
        </div>
      </form>

      <PreviewChrome label="Post Preview" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="p-4" onClickCapture={(e) => e.preventDefault()}>
          <ItemCard item={previewItem} />
        </div>
      </PreviewChrome>
    </div>
  );
}

