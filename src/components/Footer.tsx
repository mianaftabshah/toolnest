import Link from 'next/link'
import { tools } from '@/lib/tools'

export default function Footer() {
  const aiTools = tools.filter(t => t.category === 'ai').slice(0, 5)
  const pdfTools = tools.filter(t => t.category === 'pdf').slice(0, 5)
  const devTools = tools.filter(t => t.category === 'dev').slice(0, 5)

  return (
    <footer className="bg-gray-950 text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-black text-sm">T</span>
              </div>
              <span className="font-display font-black text-xl tracking-tight">ToolNest</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Free online tools for developers, designers, and everyone. No login. No ads. Just tools.
            </p>
            <div className="flex items-center gap-2 bg-gray-900 rounded-xl p-1 max-w-xs">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 px-3 py-2 focus:outline-none" />
              <button className="bg-brand text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors shrink-0">
                Notify me
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">Get notified when new tools drop</p>
          </div>

          {/* AI Tools */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">AI Tools</p>
            <ul className="space-y-2.5">
              {aiTools.map(t => (
                <li key={t.slug}>
                  <Link href={t.href} className="text-sm text-gray-400 hover:text-white transition-colors">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">PDF Tools</p>
            <ul className="space-y-2.5">
              {pdfTools.map(t => (
                <li key={t.slug}>
                  <Link href={t.href} className="text-sm text-gray-400 hover:text-white transition-colors">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dev Tools */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Dev Tools</p>
            <ul className="space-y-2.5">
              {devTools.map(t => (
                <li key={t.slug}>
                  <Link href={t.href} className="text-sm text-gray-400 hover:text-white transition-colors">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} ToolNest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/contact" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Contact</Link>
            <Link href="/about" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">About</Link>
          </div>
          <p className="text-xs text-gray-600">Built with Next.js · Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  )
}
