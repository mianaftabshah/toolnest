import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { context, tone, type } = await req.json()
    if (!context?.trim()) return NextResponse.json({ error: 'No context provided' }, { status: 400 })

    const result = await callGemini(
      `Write a professional ${type} email with a ${tone} tone based on this context: ${context}

Format your response as:
Subject: [subject line]

[email body]

Keep it concise, clear, and appropriate for the tone. Only return the subject and body, nothing else.`
    )
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
