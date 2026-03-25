export type ToolCategory = 'dev' | 'util' | 'convert' | 'ai' | 'pdf'

export interface Tool {
  slug: string
  name: string
  description: string
  longDescription: string
  icon: string
  category: ToolCategory
  categoryLabel: string
  badge?: 'New' | 'Popular' | 'AI' | 'PDF'
  href: string
  keywords: string[]
}

export const tools: Tool[] = [
  // ── Original 6 ──────────────────────────────────────────
  { slug: 'json-formatter', name: 'JSON Formatter', description: 'Beautify, validate & minify JSON instantly', longDescription: '', icon: '{ }', category: 'dev', categoryLabel: 'Dev Tools', badge: 'Popular', href: '/tools/json-formatter', keywords: ['json', 'formatter'] },
  { slug: 'password-generator', name: 'Password Generator', description: 'Generate strong, secure passwords instantly', longDescription: '', icon: '🔐', category: 'util', categoryLabel: 'Utilities', badge: 'Popular', href: '/tools/password-generator', keywords: ['password', 'generator'] },
  { slug: 'qr-code-generator', name: 'QR Code Generator', description: 'Create QR codes for any URL or text', longDescription: '', icon: '▦', category: 'util', categoryLabel: 'Utilities', href: '/tools/qr-code-generator', keywords: ['qr code', 'qr'] },
  { slug: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode or decode Base64 strings', longDescription: '', icon: '⇄', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/base64-encoder', keywords: ['base64', 'encode'] },
  { slug: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences & more', longDescription: '', icon: '📝', category: 'util', categoryLabel: 'Utilities', href: '/tools/word-counter', keywords: ['word counter'] },
  { slug: 'color-picker', name: 'Color Picker', description: 'Pick colors and convert between formats', longDescription: '', icon: '🎨', category: 'util', categoryLabel: 'Utilities', href: '/tools/color-picker', keywords: ['color picker', 'hex'] },

  // ── Dev/Util tools ───────────────────────────────────────
  { slug: 'unix-timestamp', name: 'Unix Timestamp', description: 'Convert Unix timestamps to dates and back', longDescription: '', icon: '🕐', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/unix-timestamp', keywords: ['unix timestamp', 'epoch'] },
  { slug: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', longDescription: '', icon: '#', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/hash-generator', keywords: ['hash', 'md5', 'sha256'] },
  { slug: 'css-minifier', name: 'CSS Minifier', description: 'Minify & beautify CSS code instantly', longDescription: '', icon: '✦', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/css-minifier', keywords: ['css', 'minifier'] },
  { slug: 'html-formatter', name: 'HTML Formatter', description: 'Beautify & minify HTML code instantly', longDescription: '', icon: '</>', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/html-formatter', keywords: ['html', 'formatter'] },
  { slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text instantly', longDescription: '', icon: '¶', category: 'util', categoryLabel: 'Utilities', href: '/tools/lorem-ipsum', keywords: ['lorem ipsum'] },
  { slug: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique UUIDs / GUIDs instantly', longDescription: '', icon: '⊞', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/uuid-generator', keywords: ['uuid', 'guid'] },
  { slug: 'url-encoder', name: 'URL Encoder / Decoder', description: 'Encode or decode URLs and query strings', longDescription: '', icon: '🔗', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/url-encoder', keywords: ['url encode', 'url decode'] },
  { slug: 'image-compressor', name: 'Image Compressor', description: 'Compress images without losing quality', longDescription: '', icon: '🗜️', category: 'convert', categoryLabel: 'Converters', href: '/tools/image-compressor', keywords: ['image compressor'] },
  { slug: 'markdown-preview', name: 'Markdown Preview', description: 'Write and preview Markdown in real time', longDescription: '', icon: 'Md', category: 'dev', categoryLabel: 'Dev Tools', href: '/tools/markdown-preview', keywords: ['markdown'] },

  // ── AI Tools ─────────────────────────────────────────────
  { slug: 'ai-summarizer', name: 'AI Summarizer', description: 'Summarize any text instantly with AI', longDescription: '', icon: '📋', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-summarizer', keywords: ['summarize', 'ai'] },
  { slug: 'ai-grammar', name: 'AI Grammar Checker', description: 'Fix grammar and spelling errors with AI', longDescription: '', icon: '✍️', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-grammar', keywords: ['grammar checker', 'ai'] },
  { slug: 'ai-email', name: 'AI Email Writer', description: 'Write professional emails in seconds', longDescription: '', icon: '📧', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-email', keywords: ['email writer', 'ai'] },
  { slug: 'ai-code-explainer', name: 'AI Code Explainer', description: 'Understand any code with plain English', longDescription: '', icon: '💻', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-code-explainer', keywords: ['code explainer', 'ai'] },
  { slug: 'ai-tweet', name: 'AI Post Generator', description: 'Generate social media posts with AI', longDescription: '', icon: '🐦', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-tweet', keywords: ['tweet generator', 'social media'] },
  { slug: 'ai-resume', name: 'AI Resume Writer', description: 'Turn tasks into powerful resume bullets', longDescription: '', icon: '📄', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-resume', keywords: ['resume writer', 'ai'] },
  { slug: 'ai-translator', name: 'AI Translator', description: 'Translate text to 50+ languages with AI', longDescription: '', icon: '🌐', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-translator', keywords: ['translate', 'ai'] },
  { slug: 'ai-chat', name: 'AI Chat', description: 'Chat with AI and get instant answers', longDescription: '', icon: '💬', category: 'ai', categoryLabel: 'AI Tools', badge: 'AI', href: '/tools/ai-chat', keywords: ['ai chat', 'chatbot'] },

  // ── PDF Tools ─────────────────────────────────────────────
  { slug: 'pdf-merge', name: 'Merge PDFs', description: 'Combine multiple PDFs into one file', longDescription: '', icon: '🔗', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-merge', keywords: ['merge pdf', 'combine pdf'] },
  { slug: 'pdf-split', name: 'Split PDF', description: 'Split a PDF into separate pages or ranges', longDescription: '', icon: '✂️', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-split', keywords: ['split pdf', 'extract pdf pages'] },
  { slug: 'pdf-compress', name: 'Compress PDF', description: 'Reduce PDF file size instantly', longDescription: '', icon: '🗜️', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-compress', keywords: ['compress pdf', 'reduce pdf size'] },
  { slug: 'pdf-to-images', name: 'PDF to Images', description: 'Convert PDF pages to JPG or PNG', longDescription: '', icon: '🖼️', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-to-images', keywords: ['pdf to image', 'pdf to jpg', 'pdf to png'] },
  { slug: 'pdf-rotate', name: 'Rotate PDF', description: 'Rotate PDF pages 90°, 180°, or 270°', longDescription: '', icon: '🔄', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-rotate', keywords: ['rotate pdf'] },
  { slug: 'pdf-page-numbers', name: 'Add Page Numbers', description: 'Add page numbers to your PDF', longDescription: '', icon: '🔢', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-page-numbers', keywords: ['pdf page numbers', 'number pdf'] },
  { slug: 'pdf-watermark', name: 'Watermark PDF', description: 'Add a custom text watermark to PDF', longDescription: '', icon: '💧', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/pdf-watermark', keywords: ['watermark pdf', 'pdf stamp'] },
  { slug: 'office-to-pdf', name: 'Office to PDF', description: 'Convert Word, Excel, PPT to PDF', longDescription: '', icon: '📑', category: 'pdf', categoryLabel: 'PDF Tools', badge: 'PDF', href: '/tools/office-to-pdf', keywords: ['word to pdf', 'excel to pdf', 'ppt to pdf'] },
]

export const categories = [
  { id: 'all', label: 'All Tools' },
  { id: 'ai', label: '✦ AI Tools' },
  { id: 'pdf', label: '📄 PDF Tools' },
  { id: 'dev', label: 'Dev Tools' },
  { id: 'util', label: 'Utilities' },
  { id: 'convert', label: 'Converters' },
]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug)
}
