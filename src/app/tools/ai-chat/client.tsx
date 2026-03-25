'use client'
import { useState, useRef, useEffect } from 'react'
import AIToolLayout from '@/components/AIToolLayout'

interface Message { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'Explain quantum computing in simple terms',
  'Write a Python function to reverse a string',
  'What are the best practices for REST APIs?',
  'Give me 5 productivity tips for remote work',
]

export default function Client() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')
    setError('')

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages([...newMessages, { role: 'assistant', content: data.result }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setMessages(newMessages)
    }
    setLoading(false)
  }

  const clear = () => { setMessages([]); setError('') }

  return (
    <AIToolLayout title="AI Chat" description="Ask anything — get instant, intelligent answers" icon="💬">
      {/* Chat window */}
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="py-6">
            <p className="text-center text-gray-400 text-sm mb-6">Start a conversation or try a suggestion:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTERS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-left px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-brand hover:bg-brand-light text-sm text-gray-600 hover:text-brand transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5">✦</div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gray-900 text-white rounded-tr-sm'
                    : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5">You</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center text-sm shrink-0">✦</div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

        {/* Input bar */}
        <div className="flex gap-2 mt-2">
          <textarea
            className="textarea-base flex-1 h-12 py-3 resize-none"
            placeholder="Ask anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={1}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="btn-brand px-5 shrink-0 disabled:opacity-50">
            Send
          </button>
        </div>

        {messages.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400">{messages.length} messages · Press Enter to send</p>
            <button onClick={clear} className="text-xs text-gray-400 hover:text-gray-600">Clear chat</button>
          </div>
        )}
      </div>
    </AIToolLayout>
  )
}
