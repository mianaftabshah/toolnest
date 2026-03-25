import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Text Summarizer', description: 'Summarize any text instantly with AI. Get brief, bullet point, detailed or simple summaries.' }
export default function Page() { return <Client /> }
