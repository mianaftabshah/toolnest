'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

function beautifyHTML(html: string): string {
  let result = ''
  let indent = 0
  const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])
  const inlineTags = new Set(['a','abbr','acronym','b','bdo','big','br','cite','code','dfn','em','i','img','input','kbd','label','map','object','output','q','samp','select','small','span','strong','sub','sup','textarea','time','tt','var'])

  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean)

  for (const token of tokens) {
    if (token.startsWith('</')) {
      // closing tag
      const tag = token.match(/<\/(\w+)/)?.[1] || ''
      if (!inlineTags.has(tag)) indent = Math.max(0, indent - 1)
      result += (inlineTags.has(tag) ? '' : '  '.repeat(indent)) + token.trim() + '\n'
    } else if (token.startsWith('<') && !token.startsWith('<!--')) {
      const tag = token.match(/<(\w+)/)?.[1]?.toLowerCase() || ''
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tag)
      result += '  '.repeat(indent) + token.trim() + '\n'
      if (!isSelfClosing && !inlineTags.has(tag)) indent++
    } else {
      const text = token.trim()
      if (text) result += '  '.repeat(indent) + text + '\n'
    }
  }

  return result.replace(/\n{3,}/g, '\n\n').trim()
}

function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

export default function HTMLClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify')
  const [copied, setCopied] = useState(false)

  const process = () => {
    if (!input.trim()) return
    setOutput(mode === 'beautify' ? beautifyHTML(input) : minifyHTML(input))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const savings = input && output && mode === 'minify' ? Math.round((1 - output.length / input.length) * 100) : null

  return (
    <ToolLayout title="HTML Formatter" description="Beautify & minify HTML code instantly" icon="</>" category="Dev Tools">
      <div className="flex items-center gap-2 mb-5">
        {(['beautify', 'minify'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput('') }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize ${mode === m ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {m}
          </button>
        ))}
        {savings !== null && savings > 0 && (
          <span className="ml-auto text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">-{savings}% smaller</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Input HTML</label>
            <button onClick={() => { setInput(''); setOutput('') }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <textarea className="textarea-base h-72" placeholder={'<div class="container"><p>Hello world</p></div>'} value={input} onChange={e => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Output</label>
            {output && <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy'}</button>}
          </div>
          <textarea className="textarea-base h-72 bg-gray-50" readOnly value={output} placeholder="Formatted HTML will appear here..." />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={process} className="btn-brand">{mode === 'beautify' ? 'Beautify HTML' : 'Minify HTML'}</button>
        {output && <button onClick={copy} className="btn-outline">{copied ? '✓ Copied!' : 'Copy result'}</button>}
      </div>
    </ToolLayout>
  )
}
