'use client'
import { useState } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

export default function Client() {
  const [text, setText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [changes, setChanges] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError('')
    setCorrectedText('')
    setChanges('')

    try {
      const res = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Something went wrong')
      }

      setCorrectedText(data.correctedText || '')
      setChanges(data.changes || '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(correctedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AIToolLayout
      title="AI Grammar Checker"
      description="Fix grammar, spelling, punctuation and style issues instantly"
      icon="✍️"
    >
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Your text
            </label>
            <span className="text-xs text-gray-400">{text.length} characters</span>
          </div>

          <textarea
            className="textarea-base h-44"
            placeholder="Paste your text here to check for grammar and spelling errors..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        <button
          onClick={run}
          disabled={loading || !text.trim()}
          className={`btn-brand w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Checking...
            </span>
          ) : (
            'Check grammar with AI'
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {(correctedText || changes) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <span className="text-green-600 text-lg">✓</span>
              <p className="text-sm font-medium text-green-800">
                Grammar corrected successfully.
              </p>
            </div>

            {correctedText && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Corrected text
                  </label>
                  <button onClick={copy} className="text-xs text-brand font-medium">
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {correctedText}
                  </p>
                </div>
              </div>
            )}

            {changes && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                  Changes made
                </label>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {changes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}