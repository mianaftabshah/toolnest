import type { Metadata } from 'next'
import ContactForm from './form'

export const metadata: Metadata = {
  title: 'Contact | ToolNest',
  description: 'Get in touch with the ToolNest team — we\'d love to hear from you.',
}

const topics = [
  { icon: '🐛', title: 'Report a bug', desc: 'Found something broken? Let us know.' },
  { icon: '💡', title: 'Suggest a tool', desc: 'Have an idea for a new tool? We\'re listening.' },
  { icon: '🤝', title: 'Partnership', desc: 'Want to work with us? Reach out.' },
  { icon: '💬', title: 'General inquiry', desc: 'Anything else on your mind.' },
]

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">Get in touch</p>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-gray-950 tracking-tight mb-4">
          We'd love to<br />
          <span className="text-brand">hear from you</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          Bug report, tool suggestion, or just want to say hi — we read every message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — topics + info */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-bold text-xl text-gray-900 mb-2">What can we help with?</h2>
          {topics.map(t => (
            <div key={t.title} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-2xl mt-0.5">{t.icon}</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{t.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}

          <div className="bg-gray-950 rounded-2xl p-5 text-white mt-6">
            <p className="font-display font-bold text-base mb-2">Response time</p>
            <p className="text-sm text-gray-400">We typically respond within 24–48 hours on business days.</p>
          </div>
        </div>

        {/* Right — contact form */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
