'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

const TONES = ['Professional', 'Friendly', 'Formal', 'Casual', 'Assertive', 'Apologetic']
const TYPES = ['Request', 'Follow-up', 'Thank you', 'Complaint', 'Introduction', 'Decline', 'Proposal', 'Apology']

export default function Client() {
  const [context, setContext] = useState('')
  const [tone, setTone] = useState('Professional')
  const [type, setType] = useState('Request')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!context.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context, tone, type }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Something went wrong') }
    setLoading(false)
  }

  const copy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const subject = result.match(/Subject: (.+)/)?.[1] || ''
  const body = result.replace(/Subject: .+\n\n?/, '').trim()

  return (
    <AIToolLayout title="AI Email Writer" description="Write professional emails in seconds — just describe what you need" icon="📧">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Email type</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${type === t ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tone === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">What is the email about?</label>
          <textarea className="textarea-base h-32" placeholder="e.g. Following up on a job application I sent last week to ABC Company for the Software Engineer role. I want to politely check the status." value={context} onChange={e => setContext(e.target.value)} />
        </div>

        <button onClick={run} disabled={loading || !context.trim()} className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Writing email...</span> : 'Write email with AI'}
        </button>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your email</label>
              <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy email'}</button>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              {subject && (
                <div className="px-5 py-3 border-b border-gray-200 bg-white">
                  <p className="text-xs text-gray-400 mb-0.5">Subject</p>
                  <p className="text-sm font-medium text-gray-900">{subject}</p>
                </div>
              )}
              <div className="p-5">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{body}</p>
              </div>
            </div>
            <button onClick={copy} className="btn-brand w-full mt-3">{copied ? '✓ Copied to clipboard!' : 'Copy email'}</button>
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}
