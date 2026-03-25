'use client'
import { useState } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

type Mode = 'all' | 'range' | 'every'

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState<Mode>('all')
  const [rangeFrom, setRangeFrom] = useState(1)
  const [rangeTo, setRangeTo] = useState(1)
  const [everyN, setEveryN] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const loadFile = async (f: File) => {
    setFile(f); setDone(false)
    const { PDFDocument } = await import('pdf-lib')
    const bytes = await f.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    const count = pdf.getPageCount()
    setPageCount(count)
    setRangeTo(count)
  }

  const split = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const srcPdf = await PDFDocument.load(bytes)

      const downloadPdf = async (indices: number[], name: string) => {
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(srcPdf, indices)
        pages.forEach(p => newPdf.addPage(p))
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = name; a.click()
        await new Promise(r => setTimeout(r, 300))
      }

      if (mode === 'all') {
        for (let i = 0; i < pageCount; i++) {
          await downloadPdf([i], `page-${i + 1}.pdf`)
        }
      } else if (mode === 'range') {
        const indices = Array.from({ length: rangeTo - rangeFrom + 1 }, (_, i) => rangeFrom - 1 + i)
        await downloadPdf(indices, `pages-${rangeFrom}-${rangeTo}.pdf`)
      } else {
        for (let start = 0; start < pageCount; start += everyN) {
          const indices = Array.from({ length: Math.min(everyN, pageCount - start) }, (_, i) => start + i)
          await downloadPdf(indices, `pages-${start+1}-${Math.min(start+everyN, pageCount)}.pdf`)
        }
      }
      setDone(true)
    } catch { alert('Error splitting PDF.') }
    setLoading(false)
  }

  return (
    <PDFToolLayout title="Split PDF" description="Extract pages or split a PDF into multiple files" icon="✂️">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${file ? 'border-brand bg-brand-light' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => !file && document.getElementById('split-input')?.click()}
      >
        {file ? (
          <div>
            <p className="font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-brand mt-1">{pageCount} pages detected</p>
            <button onClick={e => { e.stopPropagation(); setFile(null); setPageCount(0); setDone(false) }} className="text-xs text-red-500 mt-2">Remove</button>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">📄</div>
            <p className="font-medium text-gray-700">Drop a PDF here or click to upload</p>
          </div>
        )}
        <input id="split-input" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {pageCount > 0 && (
        <div className="space-y-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Split mode</p>
          <div className="grid grid-cols-3 gap-2">
            {([['all', 'All pages', 'One PDF per page'], ['range', 'Page range', 'Extract specific pages'], ['every', 'Every N pages', 'Split into equal parts']] as const).map(([id, label, desc]) => (
              <button key={id} onClick={() => setMode(id)}
                className={`p-3 rounded-xl border text-left transition-all ${mode === id ? 'border-brand bg-brand-light' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                <p className={`text-sm font-medium ${mode === id ? 'text-brand' : 'text-gray-700'}`}>{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          {mode === 'range' && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600">From page</label>
              <input type="number" min={1} max={pageCount} value={rangeFrom} onChange={e => setRangeFrom(Number(e.target.value))} className="input-base w-20 text-center" />
              <label className="text-sm text-gray-600">to</label>
              <input type="number" min={1} max={pageCount} value={rangeTo} onChange={e => setRangeTo(Number(e.target.value))} className="input-base w-20 text-center" />
              <span className="text-xs text-gray-400">of {pageCount}</span>
            </div>
          )}

          {mode === 'every' && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600">Split every</label>
              <input type="number" min={1} max={pageCount} value={everyN} onChange={e => setEveryN(Number(e.target.value))} className="input-base w-20 text-center" />
              <label className="text-sm text-gray-600">pages</label>
              <span className="text-xs text-gray-400">= {Math.ceil(pageCount / everyN)} files</span>
            </div>
          )}
        </div>
      )}

      {done && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-medium">✓ PDF split successfully! Check your downloads.</div>}

      <button onClick={split} disabled={!file || loading}
        className={`btn-brand w-full py-3 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Splitting...</span> : 'Split PDF'}
      </button>
    </PDFToolLayout>
  )
}
