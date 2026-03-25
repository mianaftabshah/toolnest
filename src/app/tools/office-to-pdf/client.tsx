'use client'
import { useState, useRef } from 'react'
import PDFToolLayout from '@/components/PDFToolLayout'

export default function Client() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const ext = file?.name.split('.').pop()?.toLowerCase() || ''

  const loadFile = (f: File) => {
    setFile(f)
    setDone(false)
    setError('')
  }

  const convert = async () => {
    if (!file) return
    setLoading(true); setError(''); setDone(false)

    try {
      if (ext === 'txt') {
        const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
        const text = await file.text()
        const pdf = await PDFDocument.create()
        const font = await pdf.embedFont(StandardFonts.Courier)
        const fontSize = 11
        const lineHeight = fontSize * 1.5
        const margin = 50
        const pageWidth = 595
        const pageHeight = 842
        const maxChars = Math.floor((pageWidth - margin * 2) / (fontSize * 0.6))
        const rawLines = text.split('\n')
        const lines: string[] = []
        for (const line of rawLines) {
          if (line.length <= maxChars) {
            lines.push(line || ' ')
          } else {
            for (let i = 0; i < line.length; i += maxChars) {
              lines.push(line.slice(i, i + maxChars))
            }
          }
        }
        let page = pdf.addPage([pageWidth, pageHeight])
        let y = pageHeight - margin
        for (const line of lines) {
          if (y < margin + lineHeight) {
            page = pdf.addPage([pageWidth, pageHeight])
            y = pageHeight - margin
          }
          page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
          y -= lineHeight
        }
        const bytes = await pdf.save()
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.\w+$/, '.pdf')
        a.click()
        setDone(true)

      } else if (ext === 'docx' || ext === 'doc') {
        const mammoth = await import('mammoth')
        const arrayBuffer = await file.arrayBuffer()
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer })

        const iframe = document.createElement('iframe')
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;'
        document.body.appendChild(iframe)

        const doc = iframe.contentDocument!
        doc.open()
        doc.write(`<!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; margin: 2cm; color: #111; }
              h1 { font-size: 20pt; margin: 1em 0 0.5em; }
              h2 { font-size: 16pt; margin: 1em 0 0.5em; }
              h3 { font-size: 14pt; margin: 0.8em 0 0.4em; }
              p { margin: 0.5em 0; }
              table { border-collapse: collapse; width: 100%; margin: 1em 0; }
              td, th { border: 1px solid #ccc; padding: 6px 10px; }
              ul, ol { padding-left: 1.5em; margin: 0.5em 0; }
              li { margin: 0.3em 0; }
            </style>
          </head>
          <body>${html}</body>
          </html>`)
        doc.close()

        setTimeout(() => {
          iframe.contentWindow!.focus()
          iframe.contentWindow!.print()
          setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe)
          }, 3000)
          setDone(true)
          setLoading(false)
        }, 1000)
        return

      } else {
        setError(`Direct conversion of .${ext} files is not yet supported. For Excel and PowerPoint, please use Google Drive.`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.')
    }
    setLoading(false)
  }

  const fileLabels: Record<string, string> = {
    docx: 'Word Document', doc: 'Word Document',
    xlsx: 'Excel Spreadsheet', xls: 'Excel Spreadsheet',
    pptx: 'PowerPoint', ppt: 'PowerPoint', txt: 'Text File',
  }

  return (
    <PDFToolLayout title="Office to PDF" description="Convert Word and TXT files to PDF directly in your browser" icon="📑">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[
          { ext: 'DOCX', icon: '📝', supported: true },
          { ext: 'TXT', icon: '📄', supported: true },
          { ext: 'XLSX', icon: '📊', supported: false },
          { ext: 'PPTX', icon: '📊', supported: false },
        ].map(f => (
          <div key={f.ext} className={`rounded-xl border p-3 text-center ${f.supported ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
            <p className="text-xl mb-1">{f.icon}</p>
            <p className={`text-xs font-bold ${f.supported ? 'text-green-700' : 'text-gray-500'}`}>{f.ext}</p>
            <p className={`text-xs ${f.supported ? 'text-green-600' : 'text-gray-400'}`}>{f.supported ? '✓ Supported' : 'Coming soon'}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm text-blue-800">
        <strong>💡 For Excel & PowerPoint:</strong> Upload to{' '}
        <a href="https://drive.google.com" target="_blank" rel="noopener" className="underline font-medium">Google Drive</a>
        {' '}→ Open with Google Sheets/Slides → File → Download → PDF
      </div>

      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all mb-6 ${dragging ? 'border-brand bg-brand-light' : file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand hover:bg-gray-50'}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f) }}
      >
        {file ? (
          <div>
            <p className="text-4xl mb-3">📄</p>
            <p className="font-semibold text-gray-800 text-lg">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{fileLabels[ext] || ext.toUpperCase()}</p>
            <button onClick={() => { setFile(null); setDone(false); setError('') }} className="text-xs text-red-500 mt-3 underline block mx-auto">Remove file</button>
          </div>
        ) : (
          <div>
            <div className="text-5xl mb-4">📑</div>
            <p className="font-medium text-gray-700 mb-2">Drop your file here</p>
            <p className="text-sm text-gray-400 mb-4">or click the button below to browse</p>
            <button onClick={() => inputRef.current?.click()} className="btn-outline px-6 py-2">Browse files</button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,.doc,.txt,.xlsx,.xls,.pptx,.ppt"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = '' }}
      />

      {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">{error}</div>}

      {done && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-medium">
          {ext === 'docx' || ext === 'doc'
            ? '✓ Print dialog opened! Set printer to "Save as PDF" then click Save.'
            : '✓ PDF downloaded! Check your downloads folder.'}
        </div>
      )}

      <button onClick={convert} disabled={!file || loading}
        className={`btn-brand w-full py-3 text-base ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {loading
          ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Converting...</span>
          : file ? `Convert ${ext.toUpperCase()} to PDF` : 'Select a file first'}
      </button>
    </PDFToolLayout>
  )
}
