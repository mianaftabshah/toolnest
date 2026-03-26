'use client'

import { useState, useRef } from 'react'

type Tool = 'select' | 'text' | 'highlight' | 'draw' | 'rectangle' | 'signature'

type Annotation = {
  id: string
  type: Tool
  page: number
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
  size?: number
  points?: { x: number; y: number }[]
  opacity?: number
}

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']
const HIGHLIGHT_COLORS = ['#fef08a', '#86efac', '#93c5fd', '#f9a8d4', '#fed7aa']

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [tool, setTool] = useState<Tool>('select')
  const [color, setColor] = useState('#000000')
  const [highlightColor, setHighlightColor] = useState('#fef08a')
  const [fontSize, setFontSize] = useState(16)
  const [brushSize, setBrushSize] = useState(3)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [drawing, setDrawing] = useState(false)
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number }[]>([])
  const [editingText, setEditingText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const loadPDF = async (f: File) => {
    setLoading(true)
    setFile(f)
    setAnnotations([])
    setPages([])

    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

      console.log('PDFJS version:', pdfjsLib.version)

      pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

      const bytes = await f.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: bytes })
      const pdf = await loadingTask.promise
      const rendered: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
          throw new Error('Canvas context not available')
        }

        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)

        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        rendered.push(canvas.toDataURL('image/png'))
      }

      setPages(rendered)
      setCurrentPage(0)
    } catch (error: any) {
      console.error('FULL PDF ERROR:', error)
      alert(`Error loading PDF: ${error?.message || error || 'Unknown error'}`)
      setFile(null)
      setPages([])
    } finally {
      setLoading(false)
    }
  }

  const getPos = (e: React.MouseEvent) => {
    const rect = overlayRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e)

    if (tool === 'draw' || tool === 'signature') {
      setDrawing(true)
      setCurrentDraw([pos])
    } else if (tool === 'text') {
      const id = Date.now().toString()
      setAnnotations(a => [
        ...a,
        {
          id,
          type: 'text',
          page: currentPage,
          x: pos.x,
          y: pos.y,
          text: 'Click to edit',
          color,
          size: fontSize,
          opacity: 1,
        },
      ])
      setEditingText(id)
    } else if (tool === 'highlight' || tool === 'rectangle') {
      const id = Date.now().toString()
      setAnnotations(a => [
        ...a,
        {
          id,
          type: tool,
          page: currentPage,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          color: tool === 'highlight' ? highlightColor : color,
          opacity: tool === 'highlight' ? 0.4 : 0.15,
        },
      ])
      setDrawing(true)
      setCurrentDraw([pos])
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return

    const pos = getPos(e)

    if (tool === 'draw' || tool === 'signature') {
      setCurrentDraw(d => [...d, pos])
    } else if (tool === 'highlight' || tool === 'rectangle') {
      const start = currentDraw[0]
      if (!start) return

      setAnnotations(a => {
        const last = a[a.length - 1]
        if (!last) return a

        return [
          ...a.slice(0, -1),
          {
            ...last,
            width: pos.x - start.x,
            height: pos.y - start.y,
          },
        ]
      })
    }
  }

  const handleMouseUp = () => {
    if (!drawing) return

    setDrawing(false)

    if ((tool === 'draw' || tool === 'signature') && currentDraw.length > 1) {
      const id = Date.now().toString()
      setAnnotations(a => [
        ...a,
        {
          id,
          type: tool,
          page: currentPage,
          x: 0,
          y: 0,
          color: tool === 'signature' ? '#1d4ed8' : color,
          size: brushSize,
          points: currentDraw,
          opacity: 1,
        },
      ])
    }

    setCurrentDraw([])
  }

  const deleteAnnotation = (id: string) => {
    setAnnotations(a => a.filter(ann => ann.id !== id))
  }

  const download = async () => {
    if (!pages.length || !file) return

    setSaving(true)

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)

      const parseColor = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255
        const g = parseInt(hex.slice(3, 5), 16) / 255
        const b = parseInt(hex.slice(5, 7), 16) / 255
        return rgb(r, g, b)
      }

      const font = await pdf.embedFont(StandardFonts.Helvetica)

      for (const ann of annotations) {
        const page = pdf.getPages()[ann.page]
        if (!page) continue

        const { height } = page.getSize()
        const scale = 1 / 1.5

        if (ann.type === 'text' && ann.text) {
          page.drawText(ann.text, {
            x: ann.x * scale,
            y: height - ann.y * scale,
            size: (ann.size || 16) * scale,
            color: parseColor(ann.color),
            font,
          })
        } else if (
          (ann.type === 'highlight' || ann.type === 'rectangle') &&
          ann.width !== undefined &&
          ann.height !== undefined
        ) {
          page.drawRectangle({
            x: ann.x * scale,
            y: height - (ann.y + ann.height) * scale,
            width: ann.width * scale,
            height: ann.height * scale,
            color: parseColor(ann.color),
            opacity: ann.opacity || 0.4,
          })
        } else if (
          (ann.type === 'draw' || ann.type === 'signature') &&
          ann.points &&
          ann.points.length > 1
        ) {
          for (let i = 0; i < ann.points.length - 1; i++) {
            const p1 = ann.points[i]
            const p2 = ann.points[i + 1]

            page.drawLine({
              start: { x: p1.x * scale, y: height - p1.y * scale },
              end: { x: p2.x * scale, y: height - p2.y * scale },
              color: parseColor(ann.color),
              thickness: (ann.size || 2) * scale,
            })
          }
        }
      }

      const pdfBytes = await pdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `edited-${file.name}`
      a.click()

      URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('PDF save error:', error)
      alert(`Error saving PDF: ${error?.message || error || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const pageAnnotations = annotations.filter(a => a.page === currentPage)

  const tools_list: { id: Tool; icon: string; label: string }[] = [
    { id: 'select', icon: '↖', label: 'Select' },
    { id: 'text', icon: 'T', label: 'Add text' },
    { id: 'highlight', icon: '▬', label: 'Highlight' },
    { id: 'rectangle', icon: '□', label: 'Rectangle' },
    { id: 'draw', icon: '✏️', label: 'Draw' },
    { id: 'signature', icon: '✍', label: 'Signature' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
          ✏️
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold text-3xl text-gray-900">PDF Editor</h1>
            <span className="text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
              PDF
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Add text, highlight, draw and annotate PDFs — all in your browser
          </p>
        </div>
      </div>

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
          }`}
          onClick={() => document.getElementById('pdf-editor-input')?.click()}
          onDragOver={e => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile?.type === 'application/pdf') {
              loadPDF(droppedFile)
            } else {
              alert('Please upload a valid PDF file.')
            }
          }}
        >
          <div className="text-6xl mb-4">📄</div>
          <p className="font-display font-bold text-xl text-gray-700 mb-2">Drop your PDF here</p>
          <p className="text-sm text-gray-400 mb-6">
            or click to browse — your file never leaves your device
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
            {['Add text', 'Highlight', 'Draw', 'Sign', 'Rectangle'].map(label => (
              <span key={label} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                {label}
              </span>
            ))}
          </div>
          <input
            id="pdf-editor-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={e => {
              const selectedFile = e.target.files?.[0]
              if (!selectedFile) return

              if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
                alert('Please upload a valid PDF file.')
                return
              }

              loadPDF(selectedFile)
            }}
          />
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Loading PDF pages...</p>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="w-56 shrink-0 space-y-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                Tools
              </p>
              <div className="space-y-1">
                {tools_list.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      tool === t.id ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={
                      tool === t.id
                        ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
                        : {}
                    }
                  >
                    <span className="text-base w-5 text-center">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {(tool === 'text' ||
              tool === 'draw' ||
              tool === 'signature' ||
              tool === 'rectangle') && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                  Color
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${
                        color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {tool === 'highlight' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                  Highlight color
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {HIGHLIGHT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setHighlightColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${
                        highlightColor === c ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {tool === 'text' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <div className="flex justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Font size
                  </p>
                  <span className="text-xs font-bold text-indigo-500">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={48}
                  value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}

            {(tool === 'draw' || tool === 'signature') && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <div className="flex justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Brush size
                  </p>
                  <span className="text-xs font-bold text-indigo-500">{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={brushSize}
                  onChange={e => setBrushSize(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}

            {pages.length > 1 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                  Pages
                </p>
                <div className="space-y-1">
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        currentPage === i
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Page {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={download}
                disabled={saving}
                className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                {saving ? 'Saving...' : '⬇ Download PDF'}
              </button>

              <button
                onClick={() => {
                  setFile(null)
                  setPages([])
                  setAnnotations([])
                  setCurrentPage(0)
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Open new PDF
              </button>

              {annotations.filter(a => a.page === currentPage).length > 0 && (
                <button
                  onClick={() => setAnnotations(a => a.filter(ann => ann.page !== currentPage))}
                  className="w-full py-2 text-sm text-red-500 hover:text-red-700 border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                >
                  Clear page
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 bg-gray-100 rounded-2xl overflow-auto p-4 flex justify-center">
            <div
              className="relative inline-block shadow-2xl"
              style={{
                cursor:
                  tool === 'text'
                    ? 'text'
                    : tool === 'draw' || tool === 'signature'
                    ? 'crosshair'
                    : tool === 'highlight' || tool === 'rectangle'
                    ? 'crosshair'
                    : 'default',
              }}
            >
              <img
                ref={imgRef}
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="block max-w-full"
                draggable={false}
              />

              <div
                ref={overlayRef}
                className="absolute inset-0"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                  {pageAnnotations.map(ann => {
                    if (ann.type === 'highlight' || ann.type === 'rectangle') {
                      return (
                        <rect
                          key={ann.id}
                          x={ann.x}
                          y={ann.y}
                          width={ann.width || 0}
                          height={ann.height || 0}
                          fill={ann.color}
                          fillOpacity={ann.opacity || 0.4}
                          stroke={ann.type === 'rectangle' ? ann.color : 'none'}
                          strokeWidth={1}
                          strokeOpacity={0.6}
                        />
                      )
                    }

                    if (
                      (ann.type === 'draw' || ann.type === 'signature') &&
                      ann.points &&
                      ann.points.length > 1
                    ) {
                      const d = ann.points
                        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                        .join(' ')

                      return (
                        <path
                          key={ann.id}
                          d={d}
                          stroke={ann.color}
                          strokeWidth={ann.size || 2}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )
                    }

                    return null
                  })}

                  {drawing &&
                    (tool === 'draw' || tool === 'signature') &&
                    currentDraw.length > 1 && (
                      <path
                        d={currentDraw
                          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                          .join(' ')}
                        stroke={tool === 'signature' ? '#1d4ed8' : color}
                        strokeWidth={brushSize}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                </svg>

                {pageAnnotations
                  .filter(a => a.type === 'text')
                  .map(ann => (
                    <div
                      key={ann.id}
                      className="absolute group"
                      style={{
                        left: ann.x,
                        top: ann.y,
                        color: ann.color,
                        fontSize: ann.size,
                        fontFamily: 'Arial',
                        cursor: 'move',
                        userSelect: 'none',
                      }}
                    >
                      {editingText === ann.id ? (
                        <input
                          autoFocus
                          className="border-b border-dashed border-gray-400 bg-transparent focus:outline-none min-w-20"
                          style={{ color: ann.color, fontSize: ann.size }}
                          value={ann.text || ''}
                          onChange={e =>
                            setAnnotations(a =>
                              a.map(x => (x.id === ann.id ? { ...x, text: e.target.value } : x))
                            )
                          }
                          onBlur={() => setEditingText(null)}
                        />
                      ) : (
                        <span onClick={() => setEditingText(ann.id)} className="cursor-text">
                          {ann.text}
                        </span>
                      )}

                      <button
                        onClick={() => deleteAnnotation(ann.id)}
                        className="ml-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        All processing happens in your browser · Your PDF never leaves your device · Free forever
      </p>
    </div>
  )
}