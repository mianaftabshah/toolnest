import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Chat', description: 'Chat with AI and get instant answers to any question — powered by Google Gemini.' }
export default function Page() { return <Client /> }
