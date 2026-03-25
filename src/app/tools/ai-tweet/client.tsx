'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

const PLATFORMS = [
  { id: 'twitter', label: '𝕏 Twitter/X', limit: '280 chars' },
  { id: 'linkedin', label: 'in LinkedIn', limit: 'Professional' },
  { id: 'instagram', label: '📸 Instagram', limit: 'With hashtags' },
  { id: 'facebook', label: 'Facebook', limit: 'Conversational' },
]

const TONES = ['Informative', 'Inspirational', 'Funny', 'Professional', 'Casual', 'Promotional', 'Storytelling']

export default function Client() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [tone, setTone] = useState('Informative')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<number | null>(null)

  const run = async () => {
    if (!topic.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Something went wrong') }
    setLoading(false)
  }

  // Parse 3 options from result
  const options = result
    ? result.split(/Option \d+:/i).filter(s => s.trim()).map(s => s.trim())
    : []

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text)
    setCopied(idx); setTimeout(() => setCopied(null), 2000)
  }

  return (
    <AIToolLayout title="AI Post Generator" description="Generate 3 ready-to-post options for any social platform" icon="🐦">
      <div className="space-y-5">
        {/* Platform */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Platform</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`p-3 rounded-xl border text-left transition-all ${platform === p.id ? 'border-brand bg-brand-light' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                <p className={`text-sm font-medium ${platform === p.id ? 'text-brand' : 'text-gray-700'}`}>{p.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.limit}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tone === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">What is your post about?</label>
          <textarea className="textarea-base h-28" placeholder="e.g. Launched my new online tools website — ToolNest. Free tools for developers and creators." value={topic} onChange={e => setTopic(e.target.value)} />
        </div>

        <button onClick={run} disabled={loading || !topic.trim()} className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating posts...</span>
            : 'Generate 3 post options'}
        </button>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        {options.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Choose your favourite</label>
            {options.map((opt, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-brand mb-2 block">Option {i + 1}</span>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{opt}</p>
                  </div>
                  <button onClick={() => copy(opt, i)}
                    className="shrink-0 text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-brand hover:text-brand transition-colors">
                    {copied === i ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}
