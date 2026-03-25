import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages?.length) return NextResponse.json({ error: 'No messages provided' }, { status: 400 })

    const history = messages
      .map((m: { role: string; content: string }) =>
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
      )
      .join('\n\n')

    const systemPrompt = 'You are a helpful, knowledgeable AI assistant. Be concise but thorough. Use markdown formatting when helpful (bullet points, bold, code blocks). Conversation so far:'

    const result = await callGemini(`${systemPrompt}\n\n${history}\n\nRespond to the last user message.`)
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
