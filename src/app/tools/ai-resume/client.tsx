'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales', 'Operations', 'Education', 'Engineering', 'Design', 'Other']

export default function Client() {
  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!description.trim() || !role.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, description, industry })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Something went wrong') }
    setLoading(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const bullets = result ? result.split('\n').filter(l => l.trim().startsWith('•')) : []

  return (
    <AIToolLayout title="AI Resume Bullet Writer" description="Turn job tasks into powerful, ATS-friendly resume bullet points" icon="📄">
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Your job title / role</label>
            <input className="input-base" placeholder="e.g. Software Engineer, Project Manager" value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Industry</label>
            <select className="input-base" value={industry} onChange={e => setIndustry(e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">What did you do in this role?</label>
          <textarea
            className="textarea-base h-36"
            placeholder="e.g. I managed a team of 5 developers, built REST APIs, reduced server costs by migrating to cloud, and improved app performance. I also mentored junior developers and led daily standups."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">Don't worry about metrics — AI will add them. Just describe what you did.</p>
        </div>

        <button onClick={run} disabled={loading || !description.trim() || !role.trim()} className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Writing bullets...</span>
            : 'Generate resume bullets'}
        </button>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

        {bullets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your resume bullets</label>
              <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied all!' : 'Copy all'}</button>
            </div>
            <div className="space-y-2">
              {bullets.map((bullet, i) => {
                return (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 group">
                    <p className="text-sm text-gray-800 leading-relaxed flex-1">{bullet}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(bullet)}
                      className="shrink-0 text-xs text-gray-400 hover:text-brand opacity-0 group-hover:opacity-100 transition-all mt-0.5">
                      Copy
                    </button>
                  </div>
                )
              })}
            </div>
            <button onClick={copy} className="btn-brand w-full mt-4">{copied ? '✓ Copied to clipboard!' : 'Copy all bullets'}</button>
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}
