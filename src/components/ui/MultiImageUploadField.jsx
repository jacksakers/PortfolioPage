import { useState } from 'react';
import { X } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

// A gallery field for uploading multiple photos at once (e.g. a homepage photo gallery).
export default function MultiImageUploadField({ value = [], onChange, storagePath, label }) {
  const { uploadFile, uploading, progress } = useStorage();
  const [localError, setLocalError] = useState('');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setLocalError('');
    try {
      const uploaded = [];
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const url = await uploadFile(file, `${storagePath}/${Date.now()}-${file.name}`);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch {
      setLocalError('Upload failed. Please try again.');
    }
  };

  const removeAt = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {label && <span className="block text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={url} className="relative">
            <img src={url} alt="" className="h-16 w-16 object-cover rounded-md border border-gray-200" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -top-1.5 -right-1.5 bg-white border border-gray-300 rounded-full h-5 w-5 flex items-center justify-center"
              aria-label="Remove photo"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <label className="inline-block cursor-pointer text-sm font-medium text-[var(--color-primary)] hover:underline">
        {uploading ? `Uploading... ${Math.round(progress)}%` : '+ Add photos'}
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>
      {localError && <p className="text-xs text-red-600">{localError}</p>}
    </div>
  );
}
