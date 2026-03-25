'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { tools, categories } from '@/lib/tools'
import ToolCard from '@/components/ToolCard'

const stats = [
  { num: '31+', label: 'Free tools' },
  { num: '0', label: 'Sign-ups needed' },
  { num: '8', label: 'AI-powered tools' },
  { num: '100%', label: 'Browser-based' },
]

const featuredTools = ['ai-chat', 'pdf-merge', 'json-formatter', 'ai-grammar', 'pdf-to-images', 'password-generator']

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = tools.filter(t => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.keywords.some(k => k.includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const featured = tools.filter(t => featuredTools.includes(t.slug))

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#1a1a18 1px, transparent 1px), linear-gradient(90deg, #1a1a18 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Orange accent blob */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full" style={{
          background: 'radial-gradient(circle, #e8502a 0%, transparent 70%)',
          transform: 'translate(30%, -30%)'
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-sm font-medium text-orange-700">31+ free tools — no login required</span>
            </div>

            {/* Headline */}
            <h1 className={`font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-gray-950 mb-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Every tool
              <br />
              you need.
              <br />
              <span className="text-brand">One place.</span>
            </h1>

            <p className={`text-lg text-gray-400 max-w-xl leading-relaxed mb-10 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              AI generators, PDF tools, developer utilities — all free, all instant, all running in your browser. No signup, no ads, no limits.
            </p>

            {/* CTA buttons */}
            <div className={`flex items-center gap-3 flex-wrap mb-16 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="#tools" className="btn-brand px-6 py-3 text-base font-semibold">
                Explore tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <Link href="/tools/ai-chat" className="btn-outline px-6 py-3 text-base font-semibold">
                Try AI Chat →
              </Link>
            </div>

            {/* Stats */}
            <div className={`flex flex-wrap gap-8 transition-all duration-500 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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

      {/* Featured tools strip */}
      <section className="bg-gray-950 py-5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 animate-marquee" style={{ whiteSpace: 'nowrap' }}>
          {[...featured, ...featured].map((t, i) => (
            <Link key={i} href={t.href}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all shrink-0">
              <span className="text-base">{t.icon}</span>
              {t.name}
            </Link>
          ))}
        </div>
        <style>{`
          @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          .animate-marquee { animation: marquee 20s linear infinite; display: flex; width: max-content; }
        `}</style>
      </section>

      {/* Tools section */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-2">All tools</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-950">Pick your tool</h2>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Filter tools..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-orange-100" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gray-950 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}>
              {cat.label}
              <span className={`ml-1.5 text-xs font-normal ${activeCategory === cat.id ? 'text-gray-400' : 'text-gray-400'}`}>
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
            <p className="text-sm mt-1">Try a different search term</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }}
              className="mt-4 btn-outline text-sm">Clear filters</button>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="relative bg-gray-950 rounded-3xl px-8 py-14 overflow-hidden text-center">
          {/* Background accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 opacity-20 rounded-full" style={{
            background: 'radial-gradient(circle, #e8502a 0%, transparent 70%)',
            transform: 'translateX(-50%) translateY(-30%)'
          }} />

          <div className="relative">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-4">More coming soon</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4 tracking-tight">
              New tools every week
            </h2>
            <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
              Image converter, regex tester, API tester, and many more. Drop your email to get notified.
            </p>
            <div className="flex items-center gap-2 max-w-sm mx-auto bg-white/5 border border-white/10 rounded-2xl p-2">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 px-3 py-2 focus:outline-none" />
              <button className="btn-brand shrink-0 py-2 px-4 text-sm">Notify me</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
