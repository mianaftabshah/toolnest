import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { role, description, industry } = await req.json()
    if (!description?.trim()) return NextResponse.json({ error: 'No description provided' }, { status: 400 })

    const result = await callGemini(
      `You are an expert resume writer. Convert this job description into 5 powerful resume bullet points for a ${role} in ${industry || 'the tech industry'}.

Rules:
- Start each bullet with a strong action verb (Achieved, Led, Built, Increased, Reduced, etc.)
- Include metrics and numbers wherever possible (estimate if not provided)
- Follow the format: Action verb + Task + Result/Impact
- Keep each bullet under 20 words
- Make them ATS-friendly

Job description: ${description}

Return only the 5 bullet points, each starting with •`
    )
    return NextResponse.json({ result })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
