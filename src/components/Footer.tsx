import Link from 'next/link'
import { tools } from '@/lib/tools'

export default function Footer() {
  const aiTools = tools.filter(t => t.category === 'ai').slice(0, 5)
  const pdfTools = tools.filter(t => t.category === 'pdf').slice(0, 5)
  const devTools = tools.filter(t => t.category === 'dev').slice(0, 5)

  return (
    <footer className="mt-24" style={{ background: '#0f0e1a' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <span className="text-white font-display font-black text-sm">K</span>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white">ToolKitPro</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: '#6b7280' }}>
              Your complete online toolkit. 32+ free tools for developers, designers, writers and everyone else.
            </p>
            <div className="flex items-center gap-2 rounded-xl p-1 max-w-xs" style={{ background: '#1a1828' }}>
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 px-3 py-2 focus:outline-none" />
              <button className="text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors shrink-0"
                style={{ background: '#4f46e5' }}>Notify me</button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>AI Tools</p>
            <ul className="space-y-2.5">
              {aiTools.map(t => (
                <li key={t.slug}><Link href={t.href} className="text-sm transition-colors hover:text-white" style={{ color: '#6b7280' }}>{t.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>PDF Tools</p>
            <ul className="space-y-2.5">
              {pdfTools.map(t => (
                <li key={t.slug}><Link href={t.href} className="text-sm transition-colors hover:text-white" style={{ color: '#6b7280' }}>{t.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Dev Tools</p>
            <ul className="space-y-2.5">
              {devTools.map(t => (
                <li key={t.slug}><Link href={t.href} className="text-sm transition-colors hover:text-white" style={{ color: '#6b7280' }}>{t.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Company</p>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(item => (
                <li key={item.label}><Link href={item.href} className="text-sm transition-colors hover:text-white" style={{ color: '#6b7280' }}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8" style={{ borderTop: '1px solid #1f1d2e' }}>
          <p className="text-xs" style={{ color: '#4b5563' }}>© {new Date().getFullYear()} ToolKitPro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {[{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Contact', href: '/contact' }].map(item => (
              <Link key={item.label} href={item.href} className="text-xs transition-colors hover:text-gray-400" style={{ color: '#4b5563' }}>{item.label}</Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: '#4b5563' }}>toolkitpro.site</p>
        </div>
      </div>
    </footer>
  )
}
