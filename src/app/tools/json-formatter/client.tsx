'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function JSONFormatterClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'format' | 'minify'>('format')

  const process = () => {
    setError('')
    setOutput('')
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(mode === 'format'
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => { setInput(''); setOutput(''); setError('') }

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Beautify, validate & minify JSON instantly"
      icon="{ }"
      category="Dev Tools"
    >
      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-5">
        {(['format', 'minify'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              mode === m ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {m === 'format' ? 'Beautify' : 'Minify'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Input JSON</label>
            <button onClick={clear} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <textarea
            className="textarea-base h-64"
            placeholder={'{\n  "example": "paste your JSON here"\n}'}
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Output</label>
            {output && (
              <button onClick={copy} className="text-xs text-brand hover:text-brand-dark font-medium">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {error ? (
            <div className="h-64 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-2">
              <span className="text-red-500 text-sm mt-0.5">⚠</span>
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Invalid JSON</p>
                <p className="text-xs text-red-500 font-mono">{error}</p>
              </div>
            </div>
          ) : (
            <textarea
              className="textarea-base h-64 bg-gray-50"
              readOnly
              value={output}
              placeholder="Formatted JSON will appear here..."
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={process} className="btn-brand">
          {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
        </button>
        {output && (
          <button onClick={copy} className="btn-outline">
            {copied ? '✓ Copied!' : 'Copy result'}
          </button>
        )}
      </div>
    </ToolLayout>
  )
}
