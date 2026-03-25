'use client'
import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'

function analyze(text: string) {
  if (!text.trim()) return { words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0, topWords: [] as { word: string; count: number }[] }

  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const readingTime = Math.ceil(words.length / 200)
  const speakingTime = Math.ceil(words.length / 130)

  // Top words
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'it', 'its', 'this', 'that', 'i', 'you', 'he', 'she', 'we', 'they'])
  const freq: Record<string, number> = {}
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '')
    if (clean.length > 2 && !stopWords.has(clean)) freq[clean] = (freq[clean] || 0) + 1
  })
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([word, count]) => ({ word, count }))

  return {
    words: words.length,
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    readingTime,
    speakingTime,
    topWords,
  }
}

export default function WordCounterClient() {
  const [text, setText] = useState('')
  const stats = useMemo(() => analyze(text), [text])

  const statCards = [
    { label: 'Words', value: stats.words.toLocaleString() },
    { label: 'Characters', value: stats.chars.toLocaleString() },
    { label: 'No spaces', value: stats.charsNoSpace.toLocaleString() },
    { label: 'Sentences', value: stats.sentences.toLocaleString() },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
    { label: 'Read time', value: stats.readingTime <= 1 ? `${stats.readingTime} min` : `${stats.readingTime} mins` },
    { label: 'Speak time', value: stats.speakingTime <= 1 ? `${stats.speakingTime} min` : `${stats.speakingTime} mins` },
  ]

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, paragraphs & reading time"
      icon="📝"
      category="Utilities"
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-5">
        {statCards.map(s => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <p className="font-syne font-bold text-lg text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Text area */}
      <div className="relative">
        <textarea
          className="textarea-base h-64"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ fontFamily: 'inherit' }}
        />
        {text && (
          <button
            onClick={() => setText('')}
            className="absolute top-3 right-3 text-xs text-gray-400 hover:text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Top words */}
      {stats.topWords.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Top words</p>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map(({ word, count }) => (
              <div key={word} className="flex items-center gap-1.5 bg-brand-light border border-brand/15 rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-gray-700">{word}</span>
                <span className="text-xs text-brand font-bold">×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Density bar */}
      {stats.words > 0 && (
        <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Character density</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${Math.min((stats.charsNoSpace / stats.chars) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 shrink-0">
              {stats.chars > 0 ? Math.round((stats.charsNoSpace / stats.chars) * 100) : 0}% non-space
            </span>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
