'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

const LANGUAGES = [
  'Arabic', 'Bengali', 'Chinese (Simplified)', 'Chinese (Traditional)',
  'Dutch', 'English', 'French', 'German', 'Greek', 'Hindi',
  'Indonesian', 'Italian', 'Japanese', 'Korean', 'Malay',
  'Persian', 'Polish', 'Portuguese', 'Russian', 'Spanish',
  'Swahili', 'Swedish', 'Tagalog', 'Thai', 'Turkish',
  'Ukrainian', 'Urdu', 'Vietnamese',
]

const QUICK_LANGS = ['Spanish', 'French', 'Arabic', 'Chinese (Simplified)', 'Urdu', 'Hindi', 'German', 'Japanese']

export default function Client() {
  const [text, setText] = useState('')
  const [targetLang, setTargetLang] = useState('Spanish')
  const [sourceLang, setSourceLang] = useState('auto')
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!text.trim()) return
    setLoading(true); setError(''); setResult(''); setNotes('')
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang, sourceLang })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const translation = data.result.match(/TRANSLATION:\n([\s\S]*?)\n\nNOTES:/)?.[1]?.trim() || data.result
      const note = data.result.match(/NOTES:\n([\s\S]*)/)?.[1]?.trim() || ''
      setResult(translation)
      setNotes(note === 'None.' ? '' : note)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Something went wrong') }
    setLoading(false)
  }

  const copy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <AIToolLayout title="AI Text Translator" description="Translate to 50+ languages instantly — powered by Google Gemini" icon="🌐">
      <div className="space-y-5">
        {/* Quick language buttons */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Translate to</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_LANGS.map(l => (
              <button key={l} onClick={() => setTargetLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${targetLang === l ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {l}
              </button>
            ))}
          </div>
          <select className="input-base" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Source language */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Source language (optional)</label>
          <select className="input-base" value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
            <option value="auto">Auto-detect</option>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Input / output side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Original text</label>
            <textarea className="textarea-base h-44" placeholder="Enter text to translate..." value={text} onChange={e => setText(e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Translation ({targetLang})</label>
              {result && <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy'}</button>}
            </div>
            <div className={`h-44 rounded-xl border p-4 text-sm leading-relaxed overflow-auto ${result ? 'bg-gray-50 border-gray-100 text-gray-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              {result || 'Translation will appear here...'}
            </div>
          </div>
        </div>

        <button onClick={run} disabled={loading || !text.trim()} className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Translating...</span>
            : `Translate to ${targetLang}`}
        </button>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        {notes && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">Translator note</p>
            <p className="text-sm text-amber-800">{notes}</p>
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}
