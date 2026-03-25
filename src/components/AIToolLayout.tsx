'use client'
import Link from 'next/link'

interface Props {
  title: string
  description: string
  icon: string
  children: React.ReactNode
}

export default function AIToolLayout({ title, description, icon, children }: Props) {
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

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">{title}</h1>
            <span className="text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">AI</span>
          </div>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
        {children}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Powered by Google Gemini AI · Your data is not stored
      </p>
    </div>
  )
}
