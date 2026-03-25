'use client'
import { useState, useCallback } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

function formatBytes(b: number) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(2) + ' MB'
}

export default function Client() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [done, setDone] = useState(false)

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfs])
    setDone(false)
  }

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const moveUp = (i: number) => {
    if (i === 0) return
    setFiles(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a })
  }

  const moveDown = (i: number) => {
    setFiles(prev => { if (i >= prev.length - 1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a })
  }

  const merge = async () => {
    if (files.length < 2) return
    setLoading(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const pdfBytes = await merged.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'merged.pdf'; a.click()
      setDone(true)
    } catch (e) { alert('Error merging PDFs. Make sure all files are valid PDFs.') }
    setLoading(false)
  }

  return (
    <PDFToolLayout title="Merge PDFs" description="Combine multiple PDF files into one — drag to reorder" icon="🔗">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${dragging ? 'border-brand bg-brand-light' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => document.getElementById('pdf-input')?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
      >
        <div className="text-4xl mb-3">📄</div>
        <p className="font-medium text-gray-700 mb-1">Drop PDFs here or click to upload</p>
        <p className="text-sm text-gray-400">Select multiple PDF files</p>
        <input id="pdf-input" type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Files to merge ({files.length}) — drag to reorder</p>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <span className="text-gray-400 text-sm font-mono w-5">{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => moveUp(i)} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 hover:border-gray-300 text-gray-500">↑</button>
                <button onClick={() => moveDown(i)} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 hover:border-gray-300 text-gray-500">↓</button>
                <button onClick={() => removeFile(i)} className="text-xs px-2 py-1 rounded bg-white border border-red-200 hover:bg-red-50 text-red-500">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {done && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-medium">✓ PDFs merged successfully! Check your downloads.</div>
      )}

      <div className="flex gap-3">
        <button onClick={merge} disabled={files.length < 2 || loading}
          className={`btn-brand flex-1 py-3 ${(files.length < 2 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Merging...</span> : `Merge ${files.length} PDFs`}
        </button>
        {files.length > 0 && <button onClick={() => { setFiles([]); setDone(false) }} className="btn-outline">Clear all</button>}
      </div>
      {files.length < 2 && <p className="text-xs text-gray-400 mt-2 text-center">Add at least 2 PDF files to merge</p>}
    </PDFToolLayout>
  )
}
