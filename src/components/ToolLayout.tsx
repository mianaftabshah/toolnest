import Link from 'next/link'
import { tools } from '@/lib/tools'
import ToolCard from './ToolCard'

interface ToolLayoutProps {
  title: string
  description: string
  icon: string
  category: string
  children: React.ReactNode
}

export default function ToolLayout({ title, description, icon, category, children }: ToolLayoutProps) {
  const related = tools.filter(t => t.name !== title).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/#tools" className="hover:text-brand transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-gray-600">{title}</span>
      </div>

      {/* Tool header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-brand-light border border-brand/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>
        <div>
          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-1 text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      {/* Tool UI */}
      <div className="card p-6 sm:p-8 mb-10">
        {children}
      </div>

      {/* How to use */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-10">
        <h2 className="font-syne font-bold text-lg text-gray-900 mb-3">How to use</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Use the <strong>{title}</strong> above — no login or signup required. All processing happens in your browser, so your data never leaves your device.
        </p>
      </div>

      {/* Related tools */}
      <div>
        <h2 className="font-syne font-bold text-lg text-gray-900 mb-4">More tools you might like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </div>
    </div>
  )
}
