'use client'
import { useState } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left'

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [position, setPosition] = useState<Position>('bottom-center')
  const [startFrom, setStartFrom] = useState(1)
  const [fontSize, setFontSize] = useState(12)
  const [format, setFormat] = useState('Page {n} of {total}')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const loadFile = async (f: File) => {
    setFile(f); setDone(false)
    const { PDFDocument } = await import('pdf-lib')
    const bytes = await f.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    setPageCount(pdf.getPageCount())
  }

  const addNumbers = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const pages = pdf.getPages()
      const total = pages.length

      pages.forEach((page, i) => {
        const { width, height } = page.getSize()
        const pageNum = i + startFrom
        const text = format.replace('{n}', String(pageNum)).replace('{total}', String(total))
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        const margin = 30

        let x = width / 2 - textWidth / 2
        let y = margin

        if (position.includes('right')) x = width - margin - textWidth
        if (position.includes('left')) x = margin
        if (position.includes('top')) y = height - margin - fontSize

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) })
      })

      const pdfBytes = await pdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `numbered-${file.name}`; a.click()
      setDone(true)
    } catch { alert('Error adding page numbers.') }
    setLoading(false)
  }

  const positions: { id: Position; label: string }[] = [
    { id: 'top-left', label: 'Top left' }, { id: 'top-center', label: 'Top center' }, { id: 'top-right', label: 'Top right' },
    { id: 'bottom-left', label: 'Bottom left' }, { id: 'bottom-center', label: 'Bottom center' }, { id: 'bottom-right', label: 'Bottom right' },
  ]

  const formats = ['Page {n}', '{n} / {total}', 'Page {n} of {total}', '{n}']

  return (
    <PDFToolLayout title="Add Page Numbers" description="Add page numbers to your PDF in any position and format" icon="🔢">
      <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => !file && document.getElementById('pn-input')?.click()}>
        {file ? (
          <div><p className="text-2xl mb-2">📄</p><p className="font-medium text-gray-800">{file.name}</p><p className="text-sm text-brand mt-1">{pageCount} pages</p>
            <button onClick={e => { e.stopPropagation(); setFile(null); setDone(false) }} className="text-xs text-red-500 mt-2">Remove</button></div>
        ) : (
          <div><div className="text-4xl mb-3">📄</div><p className="font-medium text-gray-700">Drop a PDF here or click to upload</p></div>
        )}
        <input id="pn-input" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {pageCount > 0 && (
        <div className="space-y-5 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map(p => (
                <button key={p.id} onClick={() => setPosition(p.id)}
                  className={`py-2 px-3 rounded-xl border text-sm transition-all ${position === p.id ? 'border-brand bg-brand-light text-brand font-medium' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Format</label>
            <div className="flex flex-wrap gap-2">
              {formats.map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-mono transition-all ${format === f ? 'border-brand bg-brand-light text-brand' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Start from number</label>
              <input type="number" min={1} value={startFrom} onChange={e => setStartFrom(Number(e.target.value))} className="input-base" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Font size</label>
                <span className="text-xs text-brand font-medium">{fontSize}pt</span>
              </div>
              <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-brand mt-2" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Preview</p>
            <p className="text-sm font-mono text-gray-700">{format.replace('{n}', String(startFrom)).replace('{total}', String(pageCount))}</p>
          </div>
        </div>
      )}

      {done && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-medium">✓ Page numbers added! Check your downloads.</div>}

      <button onClick={addNumbers} disabled={!file || loading}
        className={`btn-brand w-full py-3 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding numbers...</span> : 'Add Page Numbers'}
      </button>
    </PDFToolLayout>
  )
}
