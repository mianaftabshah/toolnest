'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15)
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function UUIDClient() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([generateUUID()])
  const [uppercase, setUppercase] = useState(false)
  const [noDashes, setNoDashes] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const generate = () => setUuids(Array.from({ length: count }, generateUUID))

  const format = (uuid: string) => {
    let u = uuid
    if (noDashes) u = u.replace(/-/g, '')
    if (uppercase) u = u.toUpperCase()
    return u
  }

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = () => copy(uuids.map(format).join('\n'), 'all')

  return (
    <ToolLayout title="UUID Generator" description="Generate unique UUIDs / GUIDs instantly" icon="⊞" category="Dev Tools">
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Count:</label>
          <input type="range" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} className="w-32 accent-brand" />
          <span className="font-syne font-bold text-brand w-8">{count}</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-brand" />
          <span className="text-sm text-gray-600">Uppercase</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={noDashes} onChange={e => setNoDashes(e.target.checked)} className="accent-brand" />
          <span className="text-sm text-gray-600">No dashes</span>
        </label>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={generate} className="btn-brand">Generate {count} UUID{count > 1 ? 's' : ''}</button>
        {uuids.length > 1 && (
          <button onClick={copyAll} className="btn-outline">{copied === 'all' ? '✓ Copied all!' : 'Copy all'}</button>
        )}
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => {
          const formatted = format(uuid)
          return (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 group">
              <code className="text-sm font-mono text-gray-800">{formatted}</code>
              <button
                onClick={() => copy(formatted, uuid)}
                className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-lg hover:border-brand hover:text-brand transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-3"
              >
                {copied === uuid ? '✓' : 'Copy'}
              </button>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-gray-400">All UUIDs are version 4 (random), generated using the Web Crypto API — cryptographically secure.</p>
    </ToolLayout>
  )
}
