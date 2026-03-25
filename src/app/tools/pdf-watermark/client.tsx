'use client'
import { useState } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [watermark, setWatermark] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(0.2)
  const [fontSize, setFontSize] = useState(60)
  const [rotation, setRotation] = useState(45)
  const [color, setColor] = useState('#ff0000')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const addWatermark = async () => {
    if (!file || !watermark.trim()) return
    setLoading(true)
    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)
      const pages = pdf.getPages()

      // Parse hex color
      const r = parseInt(color.slice(1, 3), 16) / 255
      const g = parseInt(color.slice(3, 5), 16) / 255
      const b = parseInt(color.slice(5, 7), 16) / 255

      pages.forEach(page => {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(watermark, fontSize)
        page.drawText(watermark, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(rotation),
        })
      })

      const pdfBytes = await pdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `watermarked-${file.name}`; a.click()
      setDone(true)
    } catch { alert('Error adding watermark.') }
    setLoading(false)
  }

  const presets = ['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'SAMPLE', 'APPROVED', 'TOP SECRET']

  return (
    <PDFToolLayout title="Watermark PDF" description="Add a custom text watermark to every page of your PDF" icon="💧">
      <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onClick={() => !file && document.getElementById('wm-input')?.click()}>
        {file ? (
          <div><p className="text-2xl mb-2">📄</p><p className="font-medium text-gray-800">{file.name}</p>
            <button onClick={e => { e.stopPropagation(); setFile(null); setDone(false) }} className="text-xs text-red-500 mt-2">Remove</button></div>
        ) : (
          <div><div className="text-4xl mb-3">📄</div><p className="font-medium text-gray-700">Drop a PDF here or click to upload</p></div>
        )}
        <input id="wm-input" type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setDone(false) } }} />
      </div>

      <div className="space-y-5 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Watermark text</label>
          <input className="input-base font-mono uppercase" placeholder="CONFIDENTIAL" value={watermark} onChange={e => setWatermark(e.target.value.toUpperCase())} />
          <div className="flex flex-wrap gap-2 mt-2">
            {presets.map(p => (
              <button key={p} onClick={() => setWatermark(p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono ${watermark === p ? 'border-brand bg-brand-light text-brand' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Opacity</label>
              <span className="text-xs text-brand font-medium">{Math.round(opacity * 100)}%</span>
            </div>
            <input type="range" min={5} max={80} value={Math.round(opacity * 100)} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full accent-brand" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rotation</label>
              <span className="text-xs text-brand font-medium">{rotation}°</span>
            </div>
            <input type="range" min={0} max={90} value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-full accent-brand" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Font size</label>
              <span className="text-xs text-brand font-medium">{fontSize}pt</span>
            </div>
            <input type="range" min={20} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-brand" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <code className="text-sm text-gray-600">{color.toUpperCase()}</code>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center" style={{ minHeight: 120 }}>
          <p style={{ color, opacity, fontSize: Math.min(fontSize * 0.4, 40), fontWeight: 'bold', transform: `rotate(-${rotation}deg)`, letterSpacing: 2 }}>
            {watermark || 'WATERMARK'}
          </p>
        </div>
      </div>

      {done && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-medium">✓ Watermark added! Check your downloads.</div>}

      <button onClick={addWatermark} disabled={!file || loading || !watermark.trim()}
        className={`btn-brand w-full py-3 ${(!file || loading || !watermark.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding watermark...</span> : 'Add Watermark & Download'}
      </button>
    </PDFToolLayout>
  )
}
