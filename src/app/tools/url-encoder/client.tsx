'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

type Mode = 'encode' | 'decode'
type EncType = 'component' | 'full'

export default function URLClient() {
  const [mode, setMode] = useState<Mode>('encode')
  const [encType, setEncType] = useState<EncType>('component')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const process = () => {
    setError(''); setOutput('')
    if (!input.trim()) return
    try {
      if (mode === 'encode') {
        setOutput(encType === 'component' ? encodeURIComponent(input) : encodeURI(input))
      } else {
        setOutput(encType === 'component' ? decodeURIComponent(input) : decodeURI(input))
      }
    } catch {
      setError('Invalid input for decoding. Please check your URL.')
    }
  }

  const swap = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode')
    setInput(output); setOutput(''); setError('')
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const examples = [
    { label: 'Query string', value: 'name=John Doe&city=New York&lang=C++' },
    { label: 'URL with params', value: 'https://example.com/search?q=hello world&category=dev tools' },
    { label: 'Special chars', value: 'price=$19.99 (50% off!) & available=true' },
  ]

  return (
    <ToolLayout title="URL Encoder / Decoder" description="Encode or decode URLs and query strings" icon="🔗" category="Dev Tools">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2">
          {(['encode', 'decode'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setOutput(''); setError('') }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize ${mode === m ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{m}</button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {(['component', 'full'] as EncType[]).map(t => (
            <button key={t} onClick={() => setEncType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${encType === t ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {t === 'component' ? 'encodeURIComponent' : 'encodeURI'}
            </button>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map(e => (
            <button key={e.label} onClick={() => { setInput(e.value); setOutput(''); setError('') }}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand transition-colors">
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{mode === 'encode' ? 'Plain text / URL' : 'Encoded URL'}</label>
            <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <textarea className="textarea-base h-40" placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com%2F...'} value={input} onChange={e => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{mode === 'encode' ? 'Encoded output' : 'Decoded output'}</label>
            {output && <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy'}</button>}
          </div>
          {error
            ? <div className="h-40 rounded-xl bg-red-50 border border-red-200 p-4"><p className="text-sm text-red-700 font-medium mb-1">Error</p><p className="text-xs text-red-500">{error}</p></div>
            : <textarea className="textarea-base h-40 bg-gray-50" readOnly value={output} placeholder="Result will appear here..." />
          }
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={process} className="btn-brand">{mode === 'encode' ? 'Encode URL' : 'Decode URL'}</button>
        {output && !error && <button onClick={swap} className="btn-outline">⇄ Swap & reverse</button>}
      </div>
    </ToolLayout>
  )
}
