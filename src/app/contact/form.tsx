'use client'
import { useState } from 'react'

const TOPICS = ['Report a bug', 'Suggest a tool', 'Partnership', 'General inquiry']

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'General inquiry', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')

    // Simulate sending (replace with actual email service like Resend/EmailJS)
    await new Promise(r => setTimeout(r, 1500))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="w-16 h-16 bg-green-100 border border-green-200 rounded-full flex items-center justify-center text-3xl mb-5">✓</div>
        <h3 className="font-display font-black text-2xl text-gray-900 mb-2">Message sent!</h3>
        <p className="text-gray-400 text-sm max-w-xs">Thanks for reaching out. We'll get back to you within 24–48 hours.</p>
        <button onClick={() => { setForm({ name: '', email: '', topic: 'General inquiry', message: '' }); setStatus('idle') }}
          className="mt-6 btn-outline text-sm">Send another message</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h2 className="font-display font-black text-2xl text-gray-950 mb-1">Send us a message</h2>
        <p className="text-sm text-gray-400">Fill in the form below and we'll get back to you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Your name</label>
          <input
            type="text" required placeholder="Aftab Shah"
            value={form.name} onChange={e => set('name', e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email address</label>
          <input
            type="email" required placeholder="you@example.com"
            value={form.email} onChange={e => set('email', e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Topic</label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button key={t} type="button" onClick={() => set('topic', t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                form.topic === t ? 'bg-brand text-white border-brand' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Message</label>
        <textarea
          required rows={5} placeholder="Tell us what's on your mind..."
          value={form.message} onChange={e => set('message', e.target.value)}
          className="textarea-base"
          style={{ fontFamily: 'inherit' }}
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again.
        </div>
      )}

      <button type="submit" disabled={status === 'sending' || !form.name || !form.email || !form.message}
        className={`btn-brand w-full py-3 text-base ${(status === 'sending' || !form.name || !form.email || !form.message) ? 'opacity-60 cursor-not-allowed' : ''}`}>
        {status === 'sending'
          ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</span>
          : 'Send message →'}
      </button>

      <p className="text-xs text-gray-400 text-center">We respect your privacy and will never share your information.</p>
    </form>
  )
}
