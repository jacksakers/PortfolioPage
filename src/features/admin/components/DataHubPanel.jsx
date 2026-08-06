import { useRef, useState } from 'react';
import { exportSiteData, importSiteData } from '../../../utils/siteData';

export default function DataHubPanel() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setBusy(true);
    setMessage('');
    try {
      const data = await exportSiteData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage('Export failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage('');
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await importSiteData(json);
      setMessage('Import successful. Existing data was replaced.');
    } catch (err) {
      setMessage(err.message || 'Import failed.');
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900">Data Hub</h2>
      <p className="text-sm text-gray-600">
        Export the full site as JSON, or import a JSON file to replace all sections and posts.
      </p>

      {message && <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={busy}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          Export JSON
        </button>
        <label className="px-4 py-2 rounded-md font-medium border border-gray-300 cursor-pointer">
          Import JSON
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
            disabled={busy}
          />
        </label>
      </div>
    </div>
  );
}
