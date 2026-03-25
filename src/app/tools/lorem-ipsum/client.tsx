'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

function generateWords(n: number): string {
  const result: string[] = []
  for (let i = 0; i < n; i++) result.push(WORDS[Math.floor(Math.random() * WORDS.length)])
  return result.join(' ')
}

function generateSentence(): string {
  const len = Math.floor(Math.random() * 10) + 8
  return capitalize(generateWords(len)) + '.'
}

function generateParagraph(): string {
  const len = Math.floor(Math.random() * 4) + 4
  return Array.from({ length: len }, generateSentence).join(' ')
}

type GenType = 'paragraphs' | 'sentences' | 'words'

export default function LoremClient() {
  const [type, setType] = useState<GenType>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [startWithLorem, setStartWithLorem] = useState(true)

  const generate = () => {
    let result = ''
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, generateParagraph)
      if (startWithLorem) paras[0] = 'Lorem ipsum dolor sit amet, ' + paras[0].charAt(0).toLowerCase() + paras[0].slice(1)
      result = paras.join('\n\n')
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, generateSentence)
      if (startWithLorem) sentences[0] = 'Lorem ipsum dolor sit amet.'
      result = sentences.join(' ')
    } else {
      result = generateWords(count)
      if (startWithLorem) result = 'lorem ipsum dolor sit amet ' + result
    }
    setOutput(result)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maxCount = type === 'paragraphs' ? 20 : type === 'sentences' ? 50 : 500

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text instantly" icon="¶" category="Utilities">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {(['paragraphs', 'sentences', 'words'] as GenType[]).map(t => (
          <button key={t} onClick={() => { setType(t); setCount(t === 'words' ? 50 : 3) }}
            className={`py-3 rounded-xl text-sm font-medium transition-all capitalize ${type === t ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-48">
          <label className="text-sm text-gray-600 shrink-0">Count:</label>
          <input type="range" min={1} max={maxCount} value={count} onChange={e => setCount(Number(e.target.value))} className="flex-1 accent-brand" />
          <span className="font-syne font-bold text-brand min-w-8 text-right">{count}</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} className="accent-brand" />
          <span className="text-sm text-gray-600">Start with "Lorem ipsum"</span>
        </label>
      </div>

      <button onClick={generate} className="btn-brand mb-5">Generate</button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{output.split(/\s+/).length} words · {output.length} characters</span>
            <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy text'}</button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{output}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={copy} className="btn-brand">{copied ? '✓ Copied!' : 'Copy text'}</button>
            <button onClick={generate} className="btn-outline">Regenerate</button>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
