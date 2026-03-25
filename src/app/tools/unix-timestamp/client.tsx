'use client'
import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function UnixClient() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now() / 1000)))
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16))
  const [tsResult, setTsResult] = useState('')
  const [dateResult, setDateResult] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])

  const convertTs = () => {
    const num = parseInt(tsInput)
    if (isNaN(num)) { setTsResult('Invalid timestamp'); return }
    const ms = num < 1e10 ? num * 1000 : num
    const d = new Date(ms)
    setTsResult(d.toUTCString() + '\n' + d.toLocaleString() + '\nISO: ' + d.toISOString())
  }

  const convertDate = () => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) { setDateResult('Invalid date'); return }
    setDateResult(String(Math.floor(d.getTime() / 1000)))
  }

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const formats = [
    { label: 'UTC', value: new Date(now * 1000).toUTCString() },
    { label: 'ISO 8601', value: new Date(now * 1000).toISOString() },
    { label: 'Local', value: new Date(now * 1000).toLocaleString() },
    { label: 'Date only', value: new Date(now * 1000).toLocaleDateString() },
    { label: 'Time only', value: new Date(now * 1000).toLocaleTimeString() },
  ]

  return (
    <ToolLayout title="Unix Timestamp Converter" description="Convert Unix timestamps to dates and back" icon="🕐" category="Dev Tools">
      {/* Live clock */}
      <div className="bg-gray-900 rounded-2xl p-6 text-center mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Current Unix Timestamp</p>
        <div className="font-syne font-bold text-4xl text-white tracking-tight mb-1">{now}</div>
        <p className="text-sm text-gray-400">{new Date(now * 1000).toUTCString()}</p>
        <button onClick={() => copy(String(now), 'live')} className="mt-3 text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg transition-colors">
          {copied === 'live' ? '✓ Copied!' : 'Copy current timestamp'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Timestamp → Date */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-syne font-bold text-sm text-gray-700 mb-3">Timestamp → Human date</h3>
          <input
            type="text"
            className="input-base mb-3"
            placeholder="e.g. 1711234567"
            value={tsInput}
            onChange={e => setTsInput(e.target.value)}
          />
          <button onClick={convertTs} className="btn-brand w-full mb-3">Convert</button>
          {tsResult && (
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{tsResult}</pre>
              <button onClick={() => copy(tsResult, 'ts')} className="mt-2 text-xs text-brand font-medium">
                {copied === 'ts' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Date → Timestamp */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-syne font-bold text-sm text-gray-700 mb-3">Human date → Timestamp</h3>
          <input
            type="datetime-local"
            className="input-base mb-3"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
          />
          <button onClick={convertDate} className="btn-brand w-full mb-3">Convert</button>
          {dateResult && (
            <div className="bg-white rounded-xl p-3 border border-gray-200 flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-gray-900">{dateResult}</code>
              <button onClick={() => copy(dateResult, 'date')} className="text-xs text-brand font-medium">
                {copied === 'date' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Current formats */}
      <div>
        <h3 className="font-syne font-bold text-sm text-gray-700 mb-3">Current time in all formats</h3>
        <div className="space-y-2">
          {formats.map(f => (
            <div key={f.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 group">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                <code className="text-sm text-gray-800">{f.value}</code>
              </div>
              <button onClick={() => copy(f.value, f.label)} className="text-xs text-brand opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                {copied === f.label ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
