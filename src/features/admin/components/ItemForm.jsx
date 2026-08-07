import { useEffect, useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { useStorage } from '../../../hooks/useStorage';
import ItemCard from '../../portfolio/components/ItemCard';
import PreviewChrome from './PreviewChrome';
import RichTextEditor from '../../../components/ui/RichTextEditor';

const EMPTY_ITEM = {
  sectionId: '',
  title: '',
  date: '',
  summary: '',
  content: '',
  images: [],
  links: [],
  tags: [],
  status: 'published',
  featured: false,
};

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]';

export default function ItemForm({ sections, initialItem, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_ITEM);
  const [tagsInput, setTagsInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingPreviewUrls, setPendingPreviewUrls] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const { uploadFile, uploading, progress } = useStorage();

  useEffect(() => {
    const urls = pendingFiles.map((file) => URL.createObjectURL(file));
    setPendingPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [pendingFiles]);

  useEffect(() => {
    if (initialItem) {
      // Migrate older items that only had a "description" field.
      const summary = initialItem.summary ?? initialItem.description ?? '';
      setForm({ ...EMPTY_ITEM, ...initialItem, summary });
      setTagsInput((initialItem.tags ?? []).join(', '));
    } else {
      setForm(EMPTY_ITEM);
      setTagsInput('');
    }
    setPendingFiles([]);
  }, [initialItem]);

  const updateLink = (index, field, value) => {
    const links = [...form.links];
    links[index] = { ...links[index], [field]: value };
    setForm({ ...form, links });
  };

  const addLink = () => setForm({ ...form, links: [...form.links, { title: '', url: '' }] });
  const removeLink = (index) => setForm({ ...form, links: form.links.filter((_, i) => i !== index) });
  const removeImage = (url) => setForm({ ...form, images: form.images.filter((img) => img !== url) });
  const removePendingFile = (idx) => setPendingFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleInlineImageUpload = (file) => uploadFile(file, `items/inline-${Date.now()}-${file.name}`);

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length) setPendingFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let images = form.images;
    if (pendingFiles.length) {
      const uploaded = [];
      for (const file of pendingFiles) {
        // eslint-disable-next-line no-await-in-loop
        const url = await uploadFile(file, `items/${Date.now()}-${file.name}`);
        uploaded.push(url);
      }
      images = [...images, ...uploaded];
    }
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSubmit({ ...form, images, tags });
    setPendingFiles([]);
  };

  const previewItem = {
    id: 'preview',
    title: form.title,
    date: form.date,
    summary: form.summary,
    content: form.content,
    tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    links: form.links.filter((link) => link.url),
    images: [...form.images, ...pendingPreviewUrls],
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] items-start">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 text-lg">{initialItem ? 'Edit Post' : 'Add Post'}</h3>

        <FormSection title="Basics">
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
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <input
            placeholder="Title"
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            rows={2}
            placeholder="Short summary shown on cards and previews"
            className={inputClass}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <input
            placeholder="Tags (comma separated)"
            className={inputClass}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="published">Published</option>
              <option value="draft">Draft (hidden from site)</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Feature on homepage
            </label>
          </div>
        </FormSection>

        <FormSection title="Post Content" description="Write the full post here. Use the toolbar to format text.">
          <RichTextEditor
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            onImageUpload={handleInlineImageUpload}
            placeholder="Write your full blog post here..."
            rows={10}
          />
        </FormSection>

        <FormSection
          title="Images"
          description="Upload as many photos as you want. Drag to reorder; the first image is the cover."
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((url, i) => (
              <div
                key={url}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex === null || dragIndex === i) return;
                  const images = [...form.images];
                  const [moved] = images.splice(dragIndex, 1);
                  images.splice(i, 0, moved);
                  setForm({ ...form, images });
                  setDragIndex(null);
                }}
                className="relative group cursor-move"
              >
                <img src={url} alt="" className="h-20 w-20 object-cover rounded-md border border-gray-200" />
                <span className="absolute bottom-0.5 left-0.5 bg-black/50 rounded p-0.5 text-white opacity-0 group-hover:opacity-100">
                  <GripVertical size={12} />
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-1.5 -right-1.5 bg-white border border-gray-300 rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
                {i === 0 && <span className="absolute -bottom-5 left-0 text-[10px] text-gray-400">Cover</span>}
              </div>
            ))}
            {pendingFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="relative">
                <img
                  src={pendingPreviewUrls[i]}
                  alt=""
                  className="h-20 w-20 object-cover rounded-md border border-dashed border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => removePendingFile(i)}
                  className="absolute -top-1.5 -right-1.5 bg-white border border-gray-300 rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={handleFilesSelected} />
          {uploading && <p className="text-sm text-gray-500">Uploading... {Math.round(progress)}%</p>}
        </FormSection>

        <FormSection title="Links" description="Add as many links as you want (papers, external pages, socials, etc).">
          <div className="space-y-2">
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
                <button type="button" onClick={() => removeLink(i)} className="text-red-600 text-sm shrink-0">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addLink} className="text-sm text-[var(--color-primary)] font-medium">
              + Add Link
            </button>
          </div>
        </FormSection>

        <div className="flex gap-2 pt-2">
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

function FormSection({ title, description, children }) {
  return (
    <div className="space-y-3 pb-5 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

