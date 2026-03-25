'use client'
import { useState } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [rotation, setRotation] = useState(90)
  const [applyTo, setApplyTo] = useState<'all' | 'range'>('all')
  const [rangeFrom, setRangeFrom] = useState(1)
  const [rangeTo, setRangeTo] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const loadFile = async (f: File) => {
    setFile(f); setDone(false)
    const { PDFDocument } = await import('pdf-lib')
    const bytes = await f.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    const count = pdf.getPageCount()
    setPageCount(count); setRangeTo(count)
  }

  const rotate = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { PDFDocument, degrees } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pages = pdf.getPages()
      const indices = applyTo === 'all'
        ? pages.map((_, i) => i)
        : Array.from({ length: rangeTo - rangeFrom + 1 }, (_, i) => rangeFrom - 1 + i)

      indices.forEach(i => {
        if (i < pages.length) {
          const current = pages[i].getRotation().angle
          pages[i].setRotation(degrees((current + rotation) % 360))
        }
      })

      const pdfBytes = await pdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `rotated-${file.name}`; a.click()
      setDone(true)
    } catch { alert('Error rotating PDF.') }
    setLoading(false)
  }

  const rotations = [
    { deg: 90, label: '90° →', icon: '↻' },
    { deg: 180, label: '180°', icon: '↕' },
    { deg: 270, label: '90° ←', icon: '↺' },
  ]

  return (
    <PDFToolLayout title="Rotate PDF" description="Rotate PDF pages 90°, 180°, or 270° instantly" icon="🔄">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => !file && document.getElementById('rotate-input')?.click()}
      >
        {file ? (
          <div>
            <p className="text-2xl mb-2">📄</p>
            <p className="font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-brand mt-1">{pageCount} pages</p>
            <button onClick={e => { e.stopPropagation(); setFile(null); setDone(false) }} className="text-xs text-red-500 mt-2">Remove</button>
          </div>
        ) : (
          <div><div className="text-4xl mb-3">📄</div><p className="font-medium text-gray-700">Drop a PDF here or click to upload</p></div>
        )}
        <input id="rotate-input" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {pageCount > 0 && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Rotation</label>
            <div className="grid grid-cols-3 gap-2">
              {rotations.map(r => (
                <button key={r.deg} onClick={() => setRotation(r.deg)}
                  className={`p-4 rounded-xl border text-center transition-all ${rotation === r.deg ? 'border-brand bg-brand-light' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                  <p className={`text-2xl mb-1 ${rotation === r.deg ? 'text-brand' : ''}`}>{r.icon}</p>
                  <p className={`text-sm font-medium ${rotation === r.deg ? 'text-brand' : 'text-gray-700'}`}>{r.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Apply to</label>
            <div className="flex gap-2">
              {(['all', 'range'] as const).map(a => (
                <button key={a} onClick={() => setApplyTo(a)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${applyTo === a ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {a === 'all' ? 'All pages' : 'Page range'}
                </button>
              ))}
            </div>
            {applyTo === 'range' && (
              <div className="flex items-center gap-3 mt-3 bg-gray-50 rounded-xl p-4">
                <label className="text-sm text-gray-600">From</label>
                <input type="number" min={1} max={pageCount} value={rangeFrom} onChange={e => setRangeFrom(Number(e.target.value))} className="input-base w-20 text-center" />
                <label className="text-sm text-gray-600">to</label>
                <input type="number" min={1} max={pageCount} value={rangeTo} onChange={e => setRangeTo(Number(e.target.value))} className="input-base w-20 text-center" />
              </div>
            )}
          </div>
        </div>
      )}

      {done && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-medium">✓ PDF rotated! Check your downloads.</div>}

      <button onClick={rotate} disabled={!file || loading}
        className={`btn-brand w-full py-3 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Rotating...</span> : 'Rotate & Download PDF'}
      </button>
    </PDFToolLayout>
  )
}
