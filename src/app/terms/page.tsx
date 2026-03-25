import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | ToolNest',
  description: 'ToolNest terms of service — the rules for using our free online tools.',
}

const sections = [
  {
    title: 'Acceptance of terms',
    content: `By accessing and using ToolNest (toolnest-app.vercel.app), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.`,
  },
  {
    title: 'Description of service',
    content: `ToolNest provides a collection of free online tools including, but not limited to, PDF tools, AI-powered writing tools, developer utilities, and file converters. These tools are provided free of charge and are designed to run primarily in your web browser.`,
  },
  {
    title: 'Acceptable use',
    content: `You agree to use ToolNest only for lawful purposes. You must not:\n\n• Use our tools to process, create, or distribute illegal content\n• Attempt to reverse engineer, hack, or compromise our systems\n• Use our AI tools to generate harmful, abusive, or deceptive content\n• Attempt to overload our servers through automated or excessive requests\n• Violate any applicable local, national, or international laws or regulations`,
  },
  {
    title: 'Intellectual property',
    content: `The ToolNest name, logo, and website design are our intellectual property. The tools themselves are provided for your personal and commercial use. Content you create using our tools belongs to you — we claim no ownership over your output.`,
  },
  {
    title: 'AI-generated content',
    content: `Our AI tools generate content based on your inputs using Google Gemini. You are responsible for reviewing AI-generated output before use. AI outputs may be inaccurate, incomplete, or unsuitable — always verify important content. We are not liable for decisions made based on AI-generated content.`,
  },
  {
    title: 'Disclaimer of warranties',
    content: `ToolNest is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our tools will be available at all times, error-free, or that results will be accurate. We make no warranty that the service will meet your specific requirements.`,
  },
  {
    title: 'Limitation of liability',
    content: `To the fullest extent permitted by law, ToolNest and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our tools, including but not limited to loss of data, loss of profits, or business interruption.`,
  },
  {
    title: 'Third-party services',
    content: `Our AI tools use the Google Gemini API. By using our AI tools, you also agree to Google's terms of service. We are not responsible for the availability or accuracy of third-party services.`,
  },
  {
    title: 'Changes to service',
    content: `We reserve the right to modify, suspend, or discontinue any part of our service at any time without notice. We may also update these Terms of Service at any time. Continued use of ToolNest constitutes acceptance of updated terms.`,
  },
  {
    title: 'Governing law',
    content: `These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved in the appropriate courts.`,
  },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-gray-950 tracking-tight mb-4">Terms of Service</h1>
        <p className="text-gray-400">Last updated: March 2026</p>
      </div>

      {/* Intro box */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-10">
        <h2 className="font-display font-bold text-lg text-orange-800 mb-2">Summary</h2>
        <p className="text-sm text-orange-700 leading-relaxed">
          Use ToolNest for lawful purposes. Don't abuse our systems. AI output is not guaranteed to be accurate — always verify. We provide tools "as is" without warranties. Your content belongs to you.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
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
