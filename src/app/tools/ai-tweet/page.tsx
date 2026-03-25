import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Social Media Post Generator', description: 'Generate engaging Twitter, LinkedIn, Instagram and Facebook posts instantly with AI.' }
export default function Page() { return <Client /> }
