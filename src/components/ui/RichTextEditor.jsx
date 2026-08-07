import { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Pencil,
} from 'lucide-react';
import { renderMarkdown } from '../../utils/markdown';

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: 'Bold', wrap: ['**', '**'] },
  { icon: Italic, label: 'Italic', wrap: ['*', '*'] },
  { icon: Heading2, label: 'Heading', linePrefix: '## ' },
  { icon: Heading3, label: 'Subheading', linePrefix: '### ' },
  { icon: List, label: 'Bullet list', linePrefix: '- ' },
  { icon: ListOrdered, label: 'Numbered list', linePrefix: '1. ' },
  { icon: Quote, label: 'Quote', linePrefix: '> ' },
  { icon: LinkIcon, label: 'Link', wrap: ['[', '](https://)'] },
];

// A lightweight markdown editor: a toolbar inserts markdown syntax around the
// current selection, with a toggleable live preview rendered via renderMarkdown.
// `onImageUpload(file)` is optional; if provided it enables an "insert image" button
// that uploads the file and inserts a markdown image reference at the cursor.
export default function RichTextEditor({ value, onChange, onImageUpload, placeholder, rows = 10 }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const applyFormat = (button) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);

    let nextValue;
    let cursorStart;
    let cursorEnd;

    if (button.wrap) {
      const [before, after] = button.wrap;
      nextValue = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
      cursorStart = selectionStart + before.length;
      cursorEnd = cursorStart + selected.length;
    } else {
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      nextValue = value.slice(0, lineStart) + button.linePrefix + value.slice(lineStart);
      cursorStart = selectionStart + button.linePrefix.length;
      cursorEnd = selectionEnd + button.linePrefix.length;
    }

    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const nextValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
    onChange(nextValue);
    const cursor = selectionStart + text.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleImageSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onImageUpload) return;
    setImageUploading(true);
    try {
      const url = await onImageUpload(file);
      insertAtCursor(`\n![${file.name}](${url})\n`);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-300 px-2 py-1.5">
        {TOOLBAR_BUTTONS.map(({ icon: Icon, label, ...rest }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={() => applyFormat(rest)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
          >
            <Icon size={16} />
          </button>
        ))}
        {onImageUpload && (
          <>
            <button
              type="button"
              title="Insert image"
              aria-label="Insert image"
              disabled={imageUploading}
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
            >
              <ImageIcon size={16} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelected} />
          </>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-200"
        >
          {showPreview ? <Pencil size={14} /> : <Eye size={14} />}
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {showPreview ? (
        <div
          className="prose-post min-h-[10rem] p-3 text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-gray-400">Nothing to preview yet.</p>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm focus:outline-none resize-y"
        />
      )}
    </div>
  );
}
