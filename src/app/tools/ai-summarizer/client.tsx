'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

const STYLES = [
  { id: 'brief', label: 'Brief', desc: '2-3 sentences' },
  { id: 'bullet', label: 'Bullet points', desc: '5 key points' },
  { id: 'detailed', label: 'Detailed', desc: 'Full paragraph' },
  { id: 'eli5', label: 'Simple', desc: 'Easy to understand' },
]

export default function Client() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState('brief')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!text.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, style }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Something went wrong') }
    setLoading(false)
  }

  const copy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <AIToolLayout title="AI Text Summarizer" description="Summarize any text instantly — articles, papers, emails, reports" icon="📋">
      <div className="space-y-5">
        {/* Style selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Summary style</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className={`p-3 rounded-xl border text-left transition-all ${style === s.id ? 'border-brand bg-brand-light' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                <p className={`text-sm font-medium ${style === s.id ? 'text-brand' : 'text-gray-700'}`}>{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your text</label>
            <span className="text-xs text-gray-400">{text.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea className="textarea-base h-48" placeholder="Paste any article, email, document, or text here..." value={text} onChange={e => setText(e.target.value)} />
        </div>

        <button onClick={run} disabled={loading || !text.trim()}
          className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Summarizing...
            </span>
          ) : 'Summarize with AI'}
        </button>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Summary</label>
              <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy'}</button>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{result}</p>
            </div>
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}
