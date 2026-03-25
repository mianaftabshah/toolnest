import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Code Explainer', description: 'Paste any code and get a plain English explanation instantly with AI.' }
export default function Page() { return <Client /> }
