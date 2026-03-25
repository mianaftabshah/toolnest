import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { text, style } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

    const styleMap: Record<string, string> = {
      brief: 'in 2-3 sentences',
      bullet: 'as 5 concise bullet points starting with •',
      detailed: 'in a detailed paragraph covering all key points',
      eli5: 'as if explaining to a 10-year-old, using simple language',
    }

    const result = await callGemini(
      `Summarize the following text ${styleMap[style] || styleMap.brief}. Only return the summary, no preamble.\n\nText:\n${text}`
    )
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
