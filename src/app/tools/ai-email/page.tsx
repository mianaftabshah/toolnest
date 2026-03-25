import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Email Writer', description: 'Write professional emails instantly with AI. Choose tone, type and let AI do the writing.' }
export default function Page() { return <Client /> }
