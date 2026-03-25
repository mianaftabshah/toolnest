'use client'
import { useState, useRef, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'

interface Result {
  originalSize: number
  compressedSize: number
  originalUrl: string
  compressedUrl: string
  name: string
  width: number
  height: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

export default function ImageClient() {
  const [quality, setQuality] = useState(80)
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const compress = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setLoading(true)
    const originalUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      canvas.toBlob(blob => {
        if (!blob) return
        const compressedUrl = URL.createObjectURL(blob)
        setResult({
          originalSize: file.size,
          compressedSize: blob.size,
          originalUrl,
          compressedUrl,
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
        setLoading(false)
      }, mimeType, quality / 100)
    }
    img.src = originalUrl
  }, [quality])

  const handleFile = (f: File) => compress(f)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const savings = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0

  return (
    <ToolLayout title="Image Compressor" description="Compress images in your browser — no uploads, fully private" icon="🗜️" category="Converters">
      {/* Quality slider */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-gray-600 shrink-0">Quality:</label>
        <input type="range" min={10} max={100} value={quality} onChange={e => { setQuality(Number(e.target.value)); setResult(null) }} className="flex-1 accent-brand" />
        <span className="font-syne font-bold text-brand w-12 text-right">{quality}%</span>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${dragging ? 'border-brand bg-brand-light' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-3">🖼️</div>
        <p className="font-medium text-gray-700 mb-1">Drop an image here or click to upload</p>
        <p className="text-sm text-gray-400">Supports JPEG, PNG, WebP · Processed entirely in your browser</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-sm text-gray-400">Compressing...</p>
        </div>
      )}

      {result && !loading && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Original</p>
              <p className="font-syne font-bold text-lg text-gray-900">{formatBytes(result.originalSize)}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <p className="text-xs text-green-600 mb-1">Saved</p>
              <p className="font-syne font-bold text-lg text-green-700">{savings}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Compressed</p>
              <p className="font-syne font-bold text-lg text-gray-900">{formatBytes(result.compressedSize)}</p>
            </div>
          </div>

          {/* Preview */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Original</p>
              <img src={result.originalUrl} alt="Original" className="w-full rounded-xl border border-gray-100 object-cover" style={{ maxHeight: 200 }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compressed</p>
              <img src={result.compressedUrl} alt="Compressed" className="w-full rounded-xl border border-gray-100 object-cover" style={{ maxHeight: 200 }} />
            </div>
          </div>

          <div className="flex gap-2">
            <a href={result.compressedUrl} download={`compressed-${result.name}`} className="btn-brand inline-block text-center flex-1">
              Download compressed image
            </a>
            <button onClick={() => { setResult(null); if (inputRef.current) inputRef.current.value = '' }} className="btn-outline">
              New image
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            {result.width} × {result.height}px · Your image never leaves your device
          </p>
        </div>
      )}
    </ToolLayout>
  )
}
