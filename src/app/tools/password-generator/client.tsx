'use client'
import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generatePassword(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) {
  let chars = ''
  if (opts.upper) chars += UPPER
  if (opts.lower) chars += LOWER
  if (opts.numbers) chars += NUMBERS
  if (opts.symbols) chars += SYMBOLS
  if (!chars) return ''
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(n => chars[n % chars.length]).join('')
}

function getStrength(pw: string): { label: string; color: string; width: string } {
  const len = pw.length
  const has = (r: RegExp) => r.test(pw)
  const score = (len >= 12 ? 1 : 0) + (len >= 16 ? 1 : 0) +
    (has(/[A-Z]/) ? 1 : 0) + (has(/[a-z]/) ? 1 : 0) +
    (has(/[0-9]/) ? 1 : 0) + (has(/[^A-Za-z0-9]/) ? 1 : 0)
  if (score <= 2) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' }
  if (score <= 3) return { label: 'Fair', color: 'bg-orange-400', width: 'w-2/4' }
  if (score <= 4) return { label: 'Good', color: 'bg-yellow-400', width: 'w-3/4' }
  return { label: 'Strong', color: 'bg-green-400', width: 'w-full' }
}

export default function PasswordClient() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [passwords, setPasswords] = useState<string[]>([generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true })])
  const [copied, setCopied] = useState<number | null>(null)

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: 5 }, () => generatePassword(length, opts)))
  }, [length, opts])

  const copy = async (pw: string, idx: number) => {
    await navigator.clipboard.writeText(pw)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggle = (key: keyof typeof opts) => {
    setOpts(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (!Object.values(next).some(Boolean)) return prev
      return next
    })
  }

  const strength = passwords[0] ? getStrength(passwords[0]) : null

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure passwords instantly"
      icon="🔐"
      category="Utilities"
    >
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Length</label>
            <span className="font-syne font-bold text-brand">{length}</span>
          </div>
          <input
            type="range" min={6} max={64} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6</span><span>64</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Include</label>
          <div className="grid grid-cols-2 gap-2">
            {([['upper', 'A-Z'], ['lower', 'a-z'], ['numbers', '0-9'], ['symbols', '!@#']] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={opts[key]}
                  onChange={() => toggle(key)}
                  className="accent-brand w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-600 font-mono">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate} className="btn-brand mb-6">Generate passwords</button>

      {/* Password list */}
      <div className="space-y-2">
        {passwords.map((pw, i) => {
          const s = getStrength(pw)
          return (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 group">
              <code className="flex-1 text-sm font-mono text-gray-800 break-all">{pw}</code>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-medium ${s.label === 'Strong' ? 'text-green-600' : s.label === 'Good' ? 'text-yellow-600' : s.label === 'Fair' ? 'text-orange-600' : 'text-red-600'}`}>
                  {s.label}
                </span>
                <button
                  onClick={() => copy(pw, i)}
                  className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-lg hover:border-brand hover:text-brand transition-colors"
                >
                  {copied === i ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Strength bar */}
      {strength && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Strength</span>
            <span className="font-medium">{strength.label}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
