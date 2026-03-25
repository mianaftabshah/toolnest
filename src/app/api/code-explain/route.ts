import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { code, level } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

    const levelMap: Record<string, string> = {
      beginner: 'Explain as if to a complete beginner with no coding experience. Use simple analogies.',
      intermediate: 'Explain as if to a developer with 1-2 years experience.',
      expert: 'Give a concise technical explanation focusing on patterns, complexity, and edge cases.',
    }

    const result = await callGemini(
      `${levelMap[level] || levelMap.intermediate}

Analyze this code and provide:
1. **What it does** — overall purpose
2. **How it works** — step by step breakdown
3. **Key concepts** — important patterns or techniques used
4. **Potential issues** — any bugs, inefficiencies, or improvements

Code:
\`\`\`
${code}
\`\`\``
    )
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
