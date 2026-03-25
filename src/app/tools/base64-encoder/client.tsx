'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

type Mode = 'encode' | 'decode'

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [urlSafe, setUrlSafe] = useState(false)

  const process = () => {
    setError('')
    setOutput('')
    if (!input.trim()) return
    try {
      if (mode === 'encode') {
        let result = btoa(unescape(encodeURIComponent(input)))
        if (urlSafe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        setOutput(result)
      } else {
        let sanitized = input.trim()
        if (urlSafe) sanitized = sanitized.replace(/-/g, '+').replace(/_/g, '/')
        const padding = sanitized.length % 4 ? '='.repeat(4 - sanitized.length % 4) : ''
        setOutput(decodeURIComponent(escape(atob(sanitized + padding))))
      }
    } catch {
      setError(mode === 'encode' ? 'Could not encode input.' : 'Invalid Base64 string. Check your input.')
    }
  }

  const swap = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
    setError('')
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => { setInput(''); setOutput(''); setError('') }

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to plain text"
      icon="⇄"
      category="Dev Tools"
    >
      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-5">
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError('') }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              mode === m ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {m}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={e => setUrlSafe(e.target.checked)}
              className="accent-brand w-4 h-4"
            />
            <span className="text-sm text-gray-600">URL-safe</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {mode === 'encode' ? 'Plain text' : 'Base64 input'}
            </label>
            <button onClick={clear} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <textarea
            className="textarea-base h-52"
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
            </label>
            {output && (
              <button onClick={copy} className="text-xs text-brand hover:text-brand-dark font-medium">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {error ? (
            <div className="h-52 rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-medium text-red-700 mb-1">Error</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          ) : (
            <textarea
              className="textarea-base h-52 bg-gray-50"
              readOnly
              value={output}
              placeholder="Result will appear here..."
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={process} className="btn-brand">
          {mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
        </button>
        {output && !error && (
          <button onClick={swap} className="btn-outline">
            ⇄ Swap & reverse
          </button>
        )}
      </div>

      {/* Character count */}
      {input && (
        <p className="mt-3 text-xs text-gray-400">
          Input: {input.length} chars
          {output && ` → Output: ${output.length} chars`}
          {output && mode === 'encode' && ` (${Math.round((output.length / input.length) * 100)}% of original)`}
        </p>
      )}
    </ToolLayout>
  )
}
