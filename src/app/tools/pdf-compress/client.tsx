'use client'
import { useState } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

function formatBytes(b: number) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(2) + ' MB'
}

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number; url: string } | null>(null)
  const [dragging, setDragging] = useState(false)

  const loadFile = (f: File) => { setFile(f); setResult(null) }

  const compress = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { updateMetadata: false })

      // Remove unused objects and compress
      const compressed = await pdf.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 })

      const blob = new Blob([compressed], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResult({ originalSize: file.size, compressedSize: compressed.length, url })
    } catch { alert('Error compressing PDF.') }
    setLoading(false)
  }

  const savings = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0

  return (
    <PDFToolLayout title="Compress PDF" description="Reduce PDF file size while keeping quality" icon="🗜️">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${dragging ? 'border-brand bg-brand-light' : file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => !file && document.getElementById('compress-input')?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') loadFile(f) }}
      >
        {file ? (
          <div>
            <p className="text-2xl mb-2">📄</p>
            <p className="font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(file.size)}</p>
            <button onClick={e => { e.stopPropagation(); setFile(null); setResult(null) }} className="text-xs text-red-500 mt-2">Remove</button>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">📄</div>
            <p className="font-medium text-gray-700">Drop a PDF here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">Supports any PDF file</p>
          </div>
        )}
        <input id="compress-input" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {result && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Original</p>
            <p className="font-syne font-bold text-lg text-gray-900">{formatBytes(result.originalSize)}</p>
          </div>
          <div className={`rounded-xl p-4 text-center border ${savings > 0 ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`text-xs mb-1 ${savings > 0 ? 'text-green-600' : 'text-gray-400'}`}>Saved</p>
            <p className={`font-syne font-bold text-lg ${savings > 0 ? 'text-green-700' : 'text-gray-500'}`}>{savings > 0 ? `-${savings}%` : '~0%'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Compressed</p>
            <p className="font-syne font-bold text-lg text-gray-900">{formatBytes(result.compressedSize)}</p>
          </div>
        </div>
      )}

      {result ? (
        <div className="flex gap-3">
          <a href={result.url} download={`compressed-${file?.name}`} className="btn-brand flex-1 py-3 text-center">Download compressed PDF</a>
          <button onClick={() => { setFile(null); setResult(null) }} className="btn-outline">New file</button>
        </div>
      ) : (
        <button onClick={compress} disabled={!file || loading}
          className={`btn-brand w-full py-3 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Compressing...</span> : 'Compress PDF'}
        </button>
      )}
      <p className="text-xs text-gray-400 text-center mt-3">Note: Compression works best on PDFs with many images or unoptimized content</p>
    </PDFToolLayout>
  )
}
