'use client'
import { useState, useEffect, useRef } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function QRClient() {
  const [text, setText] = useState('https://toolnest.io')
  const [size, setSize] = useState(256)
  const [fg, setFg] = useState('#000000')
  const [bg, setBg] = useState('#ffffff')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!text.trim()) return
    generateQR()
  }, [text, size, fg, bg])

  const generateQR = async () => {
    try {
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
      })
      setQrDataUrl(dataUrl)
    } catch {
      // invalid input
    }
  }

  const download = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'qrcode.png'
    a.click()
  }

  const copyImage = async () => {
    if (!qrDataUrl) return
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: copy url
      await navigator.clipboard.writeText(qrDataUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const presets = [
    { label: 'URL', value: 'https://toolnest.io' },
    { label: 'Email', value: 'mailto:hello@example.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'Wi-Fi', value: 'WIFI:S:MyNetwork;T:WPA;P:password;;' },
  ]

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes for any URL or text — download as PNG"
      icon="▦"
      category="Utilities"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: controls */}
        <div className="space-y-5">
          {/* Presets */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Quick presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => setText(p.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Content</label>
            <textarea
              className="textarea-base h-28"
              placeholder="Enter URL, text, email..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Size</label>
              <span className="text-sm font-medium text-brand">{size}×{size}px</span>
            </div>
            <input
              type="range" min={128} max={512} step={64} value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>

          {/* Colors */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={e => setFg(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <code className="text-sm text-gray-600">{fg}</code>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <code className="text-sm text-gray-600">{bg}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex items-center justify-center w-full">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="rounded-lg" style={{ width: 200, height: 200 }} />
            ) : (
              <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">▦</div>
            )}
          </div>
          <div className="flex gap-2 w-full">
            <button onClick={download} disabled={!qrDataUrl} className="btn-brand flex-1">
              Download PNG
            </button>
            <button onClick={copyImage} disabled={!qrDataUrl} className="btn-outline">
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </ToolLayout>
  )
}
