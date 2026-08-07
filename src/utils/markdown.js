// Minimal, dependency-free markdown -> safe HTML renderer for blog post content.
// Only a small, known-safe set of tags is ever produced, and all raw input is
// HTML-escaped first, so this is safe to render with dangerouslySetInnerHTML.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Only allow http(s)/mailto links to avoid javascript: URIs.
function sanitizeUrl(url) {
  const trimmed = (url || '').trim();
  if (/^(https?:|mailto:)/i.test(trimmed)) return escapeHtml(trimmed);
  return '#';
}

function renderInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\((\S+?)\)/g, (_, label, url) => `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>');
  return out;
}

// Converts a small markdown subset (headings, bold/italic, links, lists, quotes)
// into an HTML string built from blocks separated by blank lines.
export function renderMarkdown(source) {
  if (!source) return '';
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let list = null; // 'ul' | 'ol' | null

  const closeList = () => {
    if (list) {
      html.push(list === 'ul' ? '</ul>' : '</ol>');
      list = null;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      closeList();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length + 1; // start at h2
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      return;
    }

    if (/^>\s?/.test(line)) {
      closeList();
      html.push(`<blockquote>${renderInline(line.replace(/^>\s?/, ''))}</blockquote>`);
      return;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (list !== 'ul') {
        closeList();
        html.push('<ul>');
        list = 'ul';
      }
      html.push(`<li>${renderInline(bullet[1])}</li>`);
      return;
    }

    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      if (list !== 'ol') {
        closeList();
        html.push('<ol>');
        list = 'ol';
      }
      html.push(`<li>${renderInline(numbered[1])}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${renderInline(line)}</p>`);
  });

  closeList();
  return html.join('');
}
