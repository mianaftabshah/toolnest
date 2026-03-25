import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone } = await req.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'No topic provided' }, { status: 400 })

    const platformRules: Record<string, string> = {
      twitter: 'Twitter/X (max 280 chars, use 1-2 relevant hashtags, punchy and engaging)',
      linkedin: 'LinkedIn (professional, 150-300 words, story-driven, 3-5 hashtags at end)',
      instagram: 'Instagram (engaging caption, emojis, 5-10 hashtags at end)',
      facebook: 'Facebook (conversational, 100-200 words, no hashtags needed)',
    }

    const result = await callGemini(
      `Generate 3 different ${platformRules[platform] || platformRules.twitter} posts about: "${topic}"
Tone: ${tone}

Format as:
Option 1:
[post content]

Option 2:
[post content]

Option 3:
[post content]

Only return the 3 options, nothing else.`
    )
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
