import Link from 'next/link'
import type { Tool } from '@/lib/tools'

const badgeConfig: Record<string, { bg: string; text: string }> = {
  Popular: { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-700' },
  New:     { bg: 'bg-green-50 border border-green-200', text: 'text-green-700' },
  AI:      { bg: 'bg-violet-50 border border-violet-200', text: 'text-violet-700' },
  PDF:     { bg: 'bg-rose-50 border border-rose-200', text: 'text-rose-700' },
}

const categoryStyles: Record<string, { icon: string; hover: string }> = {
  ai:      { icon: 'bg-violet-50 border-violet-100 group-hover:bg-violet-100', hover: 'hover:border-violet-200 hover:shadow-violet-50' },
  pdf:     { icon: 'bg-rose-50 border-rose-100 group-hover:bg-rose-100',       hover: 'hover:border-rose-200 hover:shadow-rose-50' },
  dev:     { icon: 'bg-blue-50 border-blue-100 group-hover:bg-blue-100',       hover: 'hover:border-blue-200 hover:shadow-blue-50' },
  util:    { icon: 'bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100', hover: 'hover:border-indigo-200 hover:shadow-indigo-50' },
  convert: { icon: 'bg-teal-50 border-teal-100 group-hover:bg-teal-100',       hover: 'hover:border-teal-200 hover:shadow-teal-50' },
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const badge = tool.badge ? badgeConfig[tool.badge] : null
  const style = categoryStyles[tool.category] || categoryStyles.util

  return (
    <Link href={tool.href}
      className={`group relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${style.hover}`}>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 border rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${style.icon}`}>
          {tool.icon}
        </div>
        {badge && (
          <span className={`badge ${badge.bg} ${badge.text}`}>{tool.badge}</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-[15px] text-gray-900 mb-1 leading-snug">{tool.name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{tool.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300 font-medium">{tool.categoryLabel}</span>
        <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
