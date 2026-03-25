'use client'
import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="block">$2</code></pre>')
    // Headings
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links + images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // HR
    .replace(/^(-{3,}|\*{3,})$/gm, '<hr />')
    // Unordered lists
    .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')

  return '<p>' + html + '</p>'
    .replace(/<p><(h[1-6]|ul|ol|blockquote|pre|hr)/g, '<$1')
    .replace(/<\/(h[1-6]|ul|ol|blockquote|pre|hr[^>]*)><\/p>/g, '</$1>')
    .replace(/<p><\/p>/g, '')
}

const DEFAULT_MD = `# Hello, Markdown!

Write your markdown on the left and see it rendered here in real time.

## Features

- **Bold text** and *italic text*
- ~~Strikethrough~~ and \`inline code\`
- [Links](https://toolnest.io) and images

## Code blocks

\`\`\`javascript
const greet = (name) => {
  return \`Hello, \${name}!\`;
};
\`\`\`

> Blockquotes look great too.

---

1. Ordered lists
2. Work as expected
3. Nice and clean
`

export default function MarkdownClient() {
  const [md, setMd] = useState(DEFAULT_MD)
  const [view, setView] = useState<'split' | 'preview' | 'editor'>('split')
  const [copied, setCopied] = useState(false)

  const html = useMemo(() => parseMarkdown(md), [md])

  const copyHTML = async () => {
    await navigator.clipboard.writeText(html)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout title="Markdown Preview" description="Write Markdown and see a live rendered preview" icon="Md" category="Dev Tools">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1">
          {(['split', 'editor', 'preview'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${view === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-xs text-gray-400">
          <span>{md.split(/\s+/).filter(Boolean).length} words</span>
          <span>·</span>
          <span>{md.length} chars</span>
          <button onClick={copyHTML} className="text-brand font-medium ml-2">{copied ? '✓ Copied HTML!' : 'Copy HTML'}</button>
        </div>
      </div>

      <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {view !== 'preview' && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Markdown</label>
            <textarea
              className="textarea-base h-[500px]"
              value={md}
              onChange={e => setMd(e.target.value)}
              spellCheck={false}
            />
          </div>
        )}
        {view !== 'editor' && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Preview</label>
            <div
              className="border border-gray-200 rounded-xl p-5 h-[500px] overflow-auto bg-white prose prose-sm max-w-none"
              style={{
                lineHeight: 1.7,
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      <style>{`
        .prose h1 { font-size: 1.6rem; font-weight: 800; margin: 1rem 0 0.5rem; font-family: 'Syne', sans-serif; }
        .prose h2 { font-size: 1.3rem; font-weight: 700; margin: 1rem 0 0.5rem; font-family: 'Syne', sans-serif; }
        .prose h3 { font-size: 1.1rem; font-weight: 700; margin: 0.8rem 0 0.4rem; }
        .prose h4, .prose h5, .prose h6 { font-weight: 600; margin: 0.6rem 0 0.3rem; }
        .prose p { margin: 0.5rem 0; color: #374151; }
        .prose ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose li { margin: 0.25rem 0; }
        .prose code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-family: monospace; color: #e8502a; }
        .prose pre { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 10px; overflow-x: auto; margin: 0.75rem 0; }
        .prose pre code { background: none; color: inherit; padding: 0; }
        .prose blockquote { border-left: 3px solid #e8502a; padding-left: 1rem; color: #6b7280; margin: 0.75rem 0; font-style: italic; }
        .prose a { color: #e8502a; text-decoration: underline; }
        .prose hr { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
        .prose strong { font-weight: 700; }
        .prose em { font-style: italic; }
        .prose del { text-decoration: line-through; color: #9ca3af; }
        .prose img { max-width: 100%; border-radius: 8px; }
      `}</style>
    </ToolLayout>
  )
}
