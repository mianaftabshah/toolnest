'use client'
import { useState } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg')
  const [scale, setScale] = useState(2)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const convert = async (f: File) => {
    setFile(f); setImages([]); setLoading(true); setProgress(0)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

      const bytes = await f.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const total = pdf.numPages
      const imgs: string[] = []

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport }).promise
        imgs.push(canvas.toDataURL(`image/${format}`, 0.92))
        setProgress(Math.round((i / total) * 100))
      }
      setImages(imgs)
    } catch { alert('Error converting PDF. Make sure it is a valid PDF file.') }
    setLoading(false)
  }

  const downloadAll = () => {
    images.forEach((img, i) => {
      const a = document.createElement('a')
      a.href = img; a.download = `page-${i + 1}.${format}`; a.click()
    })
  }

  return (
    <PDFToolLayout title="PDF to Images" description="Convert every PDF page to a JPG or PNG image" icon="🖼️">
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Format</label>
          <div className="flex gap-2">
            {(['jpeg', 'png'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium uppercase transition-all ${format === f ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality</label>
            <span className="text-xs text-brand font-medium">{scale === 1 ? 'Normal' : scale === 2 ? 'High' : 'Ultra'}</span>
          </div>
          <input type="range" min={1} max={3} value={scale} onChange={e => setScale(Number(e.target.value))} className="w-full accent-brand" />
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${dragging ? 'border-brand bg-brand-light' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => document.getElementById('pdf-img-input')?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') convert(f) }}
      >
        <div className="text-4xl mb-3">📄</div>
        <p className="font-medium text-gray-700 mb-1">Drop a PDF here or click to upload</p>
        <p className="text-sm text-gray-400">Each page will be converted to a {format.toUpperCase()} image</p>
        <input id="pdf-img-input" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && convert(e.target.files[0])} />
      </div>

      {loading && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Converting pages...</span><span>{progress}%</span></div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-700">{images.length} pages converted</p>
            <button onClick={downloadAll} className="btn-brand">Download all ({images.length})</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative">
                <img src={img} alt={`Page ${i+1}`} className="w-full rounded-xl border border-gray-100 shadow-sm" />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={img} download={`page-${i+1}.${format}`} className="bg-white text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg">Download</a>
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">Page {i+1}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PDFToolLayout>
  )
}
