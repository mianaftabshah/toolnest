import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | ToolNest',
  description: 'Learn about ToolNest — the free online toolbox built for developers, designers, and everyone.',
}

const stats = [
  { num: '31+', label: 'Free tools' },
  { num: '8', label: 'AI-powered tools' },
  { num: '8', label: 'PDF tools' },
  { num: '0', label: 'Sign-ups required' },
]

const values = [
  {
    icon: '⚡',
    title: 'Instant & fast',
    desc: 'Every tool runs directly in your browser. No waiting for server uploads or processing delays.',
  },
  {
    icon: '🔒',
    title: 'Private by design',
    desc: 'Your files and data never leave your device. We process everything locally — nothing is uploaded to our servers.',
  },
  {
    icon: '🆓',
    title: 'Free forever',
    desc: 'All core tools are completely free, no credit card required, no hidden paywalls.',
  },
  {
    icon: '🤖',
    title: 'AI-powered',
    desc: 'Our AI tools are powered by Google Gemini — giving you instant intelligent assistance for writing, coding, and more.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">About us</p>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-gray-950 tracking-tight mb-6">
          Tools for everyone,<br />
          <span className="text-brand">free forever</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          ToolNest is a free online toolbox built for developers, designers, writers, and anyone who needs fast, reliable tools without the friction.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <p className="font-display font-black text-3xl text-brand mb-1">{s.num}</p>
            <p className="text-sm text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 mb-12">
        <h2 className="font-display font-black text-3xl text-gray-950 mb-6">Our story</h2>
        <div className="space-y-4 text-gray-500 leading-relaxed">
          <p>
            ToolNest was built out of frustration with existing online tools — sites cluttered with ads, paywalls behind basic features, and tools that upload your sensitive files to unknown servers.
          </p>
          <p>
            We believe that everyday tools should be free, fast, and private. Whether you need to format JSON, compress a PDF, check your grammar with AI, or generate a QR code — it should take seconds, not minutes, and should never cost you anything.
          </p>
          <p>
            Every tool on ToolNest runs entirely in your browser. Your files, your text, your data — none of it ever touches our servers. What happens in your browser, stays in your browser.
          </p>
        </div>
      </div>

      {/* Values */}
      <h2 className="font-display font-black text-3xl text-gray-950 mb-6">What we stand for</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {values.map(v => (
          <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="w-11 h-11 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-xl mb-4">
              {v.icon}
            </div>
            <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{v.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gray-950 rounded-3xl p-10 text-center text-white">
        <h2 className="font-display font-black text-3xl mb-3">Start using ToolNest</h2>
        <p className="text-gray-400 mb-6">31+ free tools waiting for you. No account needed.</p>
        <Link href="/" className="btn-brand px-8 py-3 text-base">Explore all tools →</Link>
      </div>
    </div>
  )
}
