import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Grammar Checker', description: 'Check and fix grammar, spelling, and style issues instantly with AI.' }
export default function Page() { return <Client /> }
