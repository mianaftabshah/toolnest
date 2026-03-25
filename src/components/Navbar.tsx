'use client'
import Link from 'next/link'
import { useState } from 'react'
import { tools } from '@/lib/tools'

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const results = search.length > 1
    ? tools.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.keywords.some(k => k.includes(search.toLowerCase()))
      ).slice(0, 6)
    : []

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-black text-sm">T</span>
          </div>
          <span className="font-display font-black text-xl tracking-tight">
            Tool<span className="text-brand">Nest</span>
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search 31+ tools..."
              value={search}
              onChange={e => { setSearch(e.target.value); setOpen(true) }}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onFocus={() => setOpen(true)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-orange-100 transition-all"
            />
            {search && (
              <button onClick={() => { setSearch(''); setOpen(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
              {results.map(t => (
                <Link key={t.slug} href={t.href} onClick={() => { setSearch(''); setOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm group-hover:bg-orange-50 transition-colors shrink-0">
                    {t.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.categoryLabel}</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'AI Tools', href: '/#tools' },
            { label: 'PDF Tools', href: '/#tools' },
            { label: 'Dev Tools', href: '/#tools' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <div className="relative mb-3">
            <input type="text" placeholder="Search tools..." value={search}
              onChange={e => { setSearch(e.target.value); setOpen(true) }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
          </div>
          {['AI Tools', 'PDF Tools', 'Dev Tools', 'Utilities'].map(label => (
            <Link key={label} href="/#tools" onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-600 hover:text-brand px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
