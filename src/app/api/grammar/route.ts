import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const result = await callGemini(`
You are a professional grammar and writing editor.

Fix the text for grammar, spelling, punctuation, capitalization, and clarity.

Return your response in this exact format only:

CORRECTED_TEXT:
[the fully corrected text]

CHANGES:
- [change 1]
- [change 2]
- [change 3]

Do not include a score.
Do not include an assessment.
Do not include any extra explanation.
Do not include anything outside this format.

Text to check:
${text}
`)

    const correctedText =
      result.match(/CORRECTED_TEXT:\s*([\s\S]*?)\nCHANGES:/)?.[1]?.trim() || ''

    const changes =
      result.match(/CHANGES:\s*([\s\S]*)/)?.[1]?.trim() || ''

    return NextResponse.json({
      correctedText,
      changes,
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 500 }
    )
  }
}