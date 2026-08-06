import { useRef, useState } from 'react';
import { useStorage } from '../../hooks/useStorage';

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]';

// A photo field that lets admins either upload a file (stored in Firebase Storage)
// or paste an existing image URL. Reports the resulting URL via onChange.
export default function ImageUploadField({ value, onChange, storagePath, label, aspect = 'square' }) {
  const { uploadFile, uploading, progress } = useStorage();
  const [localError, setLocalError] = useState('');
  const inputId = useRef(`upload-${Math.random().toString(36).slice(2)}`);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setLocalError('');
    try {
      const url = await uploadFile(file, `${storagePath}/${Date.now()}-${file.name}`);
      onChange(url);
    } catch {
      setLocalError('Upload failed. Please try again.');
    }
  };

  const previewShape = aspect === 'wide' ? 'h-24 w-40 rounded-md' : 'h-16 w-16 rounded-full';

  return (
    <div className="space-y-2">
      {label && <span className="block text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className={`${previewShape} object-cover border border-gray-200`} />
        ) : (
          <div className={`${previewShape} bg-gray-100 border border-dashed border-gray-300`} />
        )}
        <label
          htmlFor={inputId.current}
          className="cursor-pointer text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          {uploading ? `Uploading... ${Math.round(progress)}%` : value ? 'Replace photo' : 'Upload photo'}
        </label>
        <input id={inputId.current} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      {localError && <p className="text-xs text-red-600">{localError}</p>}
      <input
        placeholder="...or paste an image URL"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
