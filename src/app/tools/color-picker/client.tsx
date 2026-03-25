'use client'
import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function isDark(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return false
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) < 128
}

function generateShades(hex: string): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return [90, 75, 60, 45, 30, 15].map(l => {
    const factor = l / 100
    const r = Math.round(rgb.r * factor + 255 * (1 - factor))
    const g = Math.round(rgb.g * factor + 255 * (1 - factor))
    const b = Math.round(rgb.b * factor + 255 * (1 - factor))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  })
}

export default function ColorPickerClient() {
  const [hex, setHex] = useState('#e8502a')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [hexInput, setHexInput] = useState('#e8502a')

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleHexInput = (val: string) => {
    setHexInput(val)
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setHex(val)
  }

  const handleColorPicker = (val: string) => {
    setHex(val)
    setHexInput(val)
  }

  const shades = generateShades(hex)

  const formats = rgb && hsl ? [
    { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'hsl', label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'rgba', label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { key: 'css', label: 'CSS var', value: `--color: ${hex.toUpperCase()};` },
    { key: 'tailwind', label: 'Tailwind', value: `bg-[${hex.toUpperCase()}]` },
  ] : []

  const recentColors = ['#e8502a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']

  return (
    <ToolLayout
      title="Color Picker"
      description="Pick any color and instantly get HEX, RGB, HSL, and CSS values"
      icon="🎨"
      category="Utilities"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: picker + preview */}
        <div className="space-y-5">
          {/* Color preview */}
          <div
            className="w-full h-36 rounded-2xl border border-gray-100 transition-colors duration-200 flex items-end p-4"
            style={{ background: hex }}
          >
            <span className={`font-syne font-bold text-xl tracking-tight ${isDark(hex) ? 'text-white/90' : 'text-black/70'}`}>
              {hex.toUpperCase()}
            </span>
          </div>

          {/* Color picker input */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={hex}
              onChange={e => handleColorPicker(e.target.value)}
              className="w-14 h-14 rounded-xl border border-gray-200 cursor-pointer p-1"
            />
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">HEX value</label>
              <input
                type="text"
                value={hexInput}
                onChange={e => handleHexInput(e.target.value)}
                className="input-base font-mono"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          </div>

          {/* Quick colors */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Quick pick</label>
            <div className="flex gap-2 flex-wrap">
              {recentColors.map(c => (
                <button
                  key={c}
                  onClick={() => handleColorPicker(c)}
                  title={c}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${hex === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Shades */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Shades</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-100">
              {shades.map((shade, i) => (
                <button
                  key={i}
                  onClick={() => handleColorPicker(shade)}
                  title={shade}
                  className="flex-1 h-10 transition-transform hover:scale-y-110 hover:z-10"
                  style={{ background: shade }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: format values */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">Color formats</label>
          <div className="space-y-2">
            {formats.map(f => (
              <div
                key={f.key}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 group"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">{f.label}</p>
                  <code className="text-sm text-gray-800">{f.value}</code>
                </div>
                <button
                  onClick={() => copy(f.value, f.key)}
                  className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:border-brand hover:text-brand transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copiedKey === f.key ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>

          {/* Copy all */}
          <button
            onClick={() => copy(formats.map(f => `${f.label}: ${f.value}`).join('\n'), 'all')}
            className="btn-outline w-full mt-4"
          >
            {copiedKey === 'all' ? '✓ Copied all!' : 'Copy all formats'}
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
