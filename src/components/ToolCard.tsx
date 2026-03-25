import Link from 'next/link'
import type { Tool } from '@/lib/tools'

const badgeConfig: Record<string, { bg: string; text: string; label: string }> = {
  Popular: { bg: 'bg-orange-50 border border-orange-200', text: 'text-orange-700', label: 'Popular' },
  New:     { bg: 'bg-green-50 border border-green-200',  text: 'text-green-700',  label: 'New' },
  AI:      { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'AI' },
  PDF:     { bg: 'bg-red-50 border border-red-200',      text: 'text-red-700',    label: 'PDF' },
}

const categoryAccent: Record<string, string> = {
  ai:      'group-hover:bg-purple-50 group-hover:border-purple-200',
  pdf:     'group-hover:bg-red-50 group-hover:border-red-200',
  dev:     'group-hover:bg-blue-50 group-hover:border-blue-200',
  util:    'group-hover:bg-orange-50 group-hover:border-orange-200',
  convert: 'group-hover:bg-teal-50 group-hover:border-teal-200',
}

const categoryIconBg: Record<string, string> = {
  ai:      'bg-purple-50 border-purple-100 group-hover:bg-purple-100',
  pdf:     'bg-red-50 border-red-100 group-hover:bg-red-100',
  dev:     'bg-blue-50 border-blue-100 group-hover:bg-blue-100',
  util:    'bg-orange-50 border-orange-100 group-hover:bg-orange-100',
  convert: 'bg-teal-50 border-teal-100 group-hover:bg-teal-100',
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const badge = tool.badge ? badgeConfig[tool.badge] : null
  const accent = categoryAccent[tool.category] || 'group-hover:bg-orange-50 group-hover:border-orange-200'
  const iconBg = categoryIconBg[tool.category] || 'bg-orange-50 border-orange-100'

  return (
    <Link href={tool.href}
      className={`group relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-100/80 ${accent}`}>

      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 border rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${iconBg}`}>
          {tool.icon}
        </div>
        {badge && (
          <span className={`badge ${badge.bg} ${badge.text}`}>{badge.label}</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-display font-bold text-[15px] text-gray-900 mb-1 leading-snug">{tool.name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{tool.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300 font-medium">{tool.categoryLabel}</span>
        <span className="text-brand opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
