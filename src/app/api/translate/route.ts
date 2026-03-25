import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

    const result = await callGemini(
      `Translate the following text ${sourceLang && sourceLang !== 'auto' ? `from ${sourceLang}` : ''} to ${targetLang}.

Return your response in this format:
TRANSLATION:
[translated text]

NOTES:
[any important notes about the translation, alternative words, or cultural context — keep brief, max 2 lines. If none, write "None."]

Text to translate:
${text}`
    )
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
