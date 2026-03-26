'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { tools, categories } from '@/lib/tools'
import ToolCard from '@/components/ToolCard'

const stats = [
  { num: '32+', label: 'Free tools' },
  { num: '8', label: 'AI tools' },
  { num: '9', label: 'PDF tools' },
  { num: '0', label: 'Sign-ups' },
]

const highlights = [
  { icon: '⚡', text: 'Instant results' },
  { icon: '🔒', text: 'Privacy first' },
  { icon: '🤖', text: 'AI powered' },
  { icon: '🆓', text: 'Always free' },
  { icon: '🌐', text: 'Browser based' },
  { icon: '📄', text: 'PDF tools' },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = tools.filter(t => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.keywords.some(k => k.includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        {/* Gradient bg */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(79,70,229,0.08) 0%, transparent 60%)'
        }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: '#eef2ff', borderColor: '#c7d2fe' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4f46e5' }} />
              <span className="text-sm font-semibold" style={{ color: '#4338ca' }}>32+ free tools — no account needed</span>
            </div>

            {/* Headline */}
            <h1 className={`font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-gray-950 mb-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Your complete
              <br />
              online toolkit.
              <br />
              <span style={{ color: '#4f46e5' }}>Pro-level free.</span>
            </h1>

            <p className={`text-lg text-gray-400 max-w-xl leading-relaxed mb-10 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              AI writing tools, PDF editors, developer utilities and more — all free, all instant, all running in your browser. No signup, no limits.
            </p>

            {/* CTAs */}
            <div className={`flex items-center gap-3 flex-wrap mb-12 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="#tools" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl text-base font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                Browse all tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <Link href="/tools/ai-chat" className="btn-outline px-6 py-3 text-base font-semibold">
                Try AI Chat →
              </Link>
            </div>

            {/* Stats */}
            <div className={`flex flex-wrap gap-8 pb-8 transition-all duration-500 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              {stats.map(s => (
                <div key={s.label}>
                  <p className="font-display font-black text-2xl text-gray-950">{s.num}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling highlights strip */}
      <section className="py-4 overflow-hidden border-y border-gray-100 bg-gray-950">
        <div className="animate-marquee">
          {[...highlights, ...highlights, ...highlights].map((h, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm text-gray-400 px-6 shrink-0">
              <span className="text-base">{h.icon}</span>
              {h.text}
              <span className="text-gray-700 ml-4">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* Tools section */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#4f46e5' }}>All tools</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-950">What do you need today?</h2>
          </div>
          <div className="relative max-w-xs w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Filter tools..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              style={activeCategory === cat.id ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } : {}}>
              {cat.label}
              <span className="ml-1.5 text-xs font-normal opacity-70">
                {cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Tools grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-lg text-gray-600">No tools found</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }} className="mt-4 btn-outline text-sm">Clear filters</button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="relative rounded-3xl px-8 py-16 overflow-hidden text-center text-white"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 70% 50%, #4f46e5 0%, transparent 50%)'
          }} />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-indigo-300">Always growing</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl mb-4 tracking-tight">New tools added weekly</h2>
            <p className="text-indigo-200 text-base mb-8 max-w-md mx-auto">Drop your email to get notified when new tools launch.</p>
            <div className="flex items-center gap-2 max-w-sm mx-auto bg-white/10 border border-white/20 rounded-2xl p-2">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-indigo-300 px-3 py-2 focus:outline-none" />
              <button className="shrink-0 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: '#4f46e5' }}>Notify me</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
