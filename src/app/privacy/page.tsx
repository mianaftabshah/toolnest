import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ToolNest',
  description: 'ToolNest privacy policy — learn how we handle your data.',
}

const sections = [
  {
    title: 'Overview',
    content: `ToolNest is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and tools at toolnest-app.vercel.app. The short version: we collect as little data as possible, and your files never leave your device.`,
  },
  {
    title: 'Data we do NOT collect',
    content: `We do not collect, store, or transmit any files you upload or process using our tools. All file processing (PDF merging, image compression, document conversion, etc.) happens entirely in your browser using client-side JavaScript. Your documents, images, and data never touch our servers.\n\nWe do not require you to create an account, and we do not collect any personal information such as your name, email address, or payment details to use our core tools.`,
  },
  {
    title: 'AI tools and data',
    content: `Our AI-powered tools (AI Summarizer, Grammar Checker, Email Writer, etc.) send your input text to the Google Gemini API to generate responses. This text is processed by Google according to their privacy policy. We do not store your prompts or AI responses on our servers. Please do not submit sensitive personal information through our AI tools.`,
  },
  {
    title: 'Analytics',
    content: `We may use basic, privacy-respecting analytics to understand how many people visit our site and which tools are most popular. This data is aggregated and anonymous — we cannot identify individual users from it.`,
  },
  {
    title: 'Cookies',
    content: `ToolNest uses minimal cookies necessary for the website to function correctly. We do not use advertising cookies or tracking cookies. We do not sell your data to any third parties.`,
  },
  {
    title: 'Third-party services',
    content: `Our website is hosted on Vercel. AI features use the Google Gemini API. These third-party services have their own privacy policies which govern how they handle data passed through their platforms.`,
  },
  {
    title: 'Children\'s privacy',
    content: `ToolNest is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us.`,
  },
  {
    title: 'Changes to this policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. Continued use of ToolNest after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: 'Contact us',
    content: `If you have questions about this Privacy Policy or how we handle your data, please contact us through our Contact page.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-gray-950 tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-gray-400">Last updated: March 2026</p>
      </div>

      {/* TL;DR box */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10">
        <h2 className="font-display font-bold text-lg text-green-800 mb-2">TL;DR — The short version</h2>
        <ul className="space-y-1.5 text-sm text-green-700">
          <li>✓ Your files never leave your browser — all processing is local</li>
          <li>✓ We don't require an account or collect personal information</li>
          <li>✓ We don't sell your data to anyone</li>
          <li>✓ AI tools send text to Google Gemini API — don't share sensitive info</li>
          <li>✓ We use minimal, anonymous analytics only</li>
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((s, i) => (
          <div key={s.title} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4">
              <span className="text-brand mr-2">{i + 1}.</span>{s.title}
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-line">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
