'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

const LEVELS = [
  { id: 'beginner', label: '🌱 Beginner', desc: 'No coding experience' },
  { id: 'intermediate', label: '⚡ Intermediate', desc: '1-2 years experience' },
  { id: 'expert', label: '🔥 Expert', desc: 'Technical deep dive' },
]

export default function Client() {
  const [code, setCode] = useState('')
  const [level, setLevel] = useState('intermediate')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!code.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/code-explain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, level }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Something went wrong') }
    setLoading(false)
  }

  const copy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <AIToolLayout title="AI Code Explainer" description="Paste any code and get a plain English explanation instantly" icon="💻">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Explanation level</label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map(l => (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`p-3 rounded-xl border text-left transition-all ${level === l.id ? 'border-brand bg-brand-light' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                <p className={`text-sm font-medium ${level === l.id ? 'text-brand' : 'text-gray-700'}`}>{l.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Paste your code</label>
          <textarea className="textarea-base h-52 font-mono text-xs" placeholder="// Paste any code here — Python, JavaScript, SQL, Java, anything..." value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
        </div>

        <button onClick={run} disabled={loading || !code.trim()} className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing code...</span> : 'Explain this code'}
        </button>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Explanation</label>
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
