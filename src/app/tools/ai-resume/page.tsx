import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Resume Bullet Writer', description: 'Turn job descriptions into powerful ATS-friendly resume bullet points with AI.' }
export default function Page() { return <Client /> }
