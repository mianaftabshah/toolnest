'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/;}/g, '}')
    .trim()
}

function beautifyCSS(css: string): string {
  let result = ''
  let indent = 0
  const minified = minifyCSS(css)
  for (let i = 0; i < minified.length; i++) {
    const char = minified[i]
    if (char === '{') {
      result += ' {\n' + '  '.repeat(++indent)
    } else if (char === '}') {
      indent = Math.max(0, indent - 1)
      result += '\n' + '  '.repeat(indent) + '}\n' + (indent > 0 ? '  '.repeat(indent) : '\n')
    } else if (char === ';') {
      result += ';\n' + '  '.repeat(indent)
    } else {
      result += char
    }
  }
  return result.replace(/\n{3,}/g, '\n\n').trim()
}

export default function CSSClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify')
  const [copied, setCopied] = useState(false)

  const process = () => {
    if (!input.trim()) return
    setOutput(mode === 'minify' ? minifyCSS(input) : beautifyCSS(input))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const savings = input && output && mode === 'minify'
    ? Math.round((1 - output.length / input.length) * 100)
    : null

  return (
    <ToolLayout title="CSS Minifier" description="Minify & beautify CSS code instantly" icon="✦" category="Dev Tools">
      <div className="flex items-center gap-2 mb-5">
        {(['minify', 'beautify'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput('') }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize ${mode === m ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {m}
          </button>
        ))}
        {savings !== null && savings > 0 && (
          <span className="ml-auto text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
            -{savings}% smaller
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Input CSS</label>
            <button onClick={() => { setInput(''); setOutput('') }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <textarea className="textarea-base h-72" placeholder={`.container {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n}`} value={input} onChange={e => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Output</label>
            {output && <button onClick={copy} className="text-xs text-brand font-medium">{copied ? '✓ Copied!' : 'Copy'}</button>}
          </div>
          <textarea className="textarea-base h-72 bg-gray-50" readOnly value={output} placeholder="Result will appear here..." />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={process} className="btn-brand">{mode === 'minify' ? 'Minify CSS' : 'Beautify CSS'}</button>
        {output && <button onClick={copy} className="btn-outline">{copied ? '✓ Copied!' : 'Copy result'}</button>}
      </div>

      {input && output && (
        <p className="mt-3 text-xs text-gray-400">
          Input: {input.length.toLocaleString()} chars → Output: {output.length.toLocaleString()} chars
          {savings !== null && ` (saved ${(input.length - output.length).toLocaleString()} chars)`}
        </p>
      )}
    </ToolLayout>
  )
}
