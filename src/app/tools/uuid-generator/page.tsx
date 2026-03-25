import type { Metadata } from 'next'
import UUIDClient from './client'
export const metadata: Metadata = { title: 'UUID Generator', description: 'Generate version 4 UUIDs (GUIDs) instantly. Bulk generate up to 100 at once.' }
export default function Page() { return <UUIDClient /> }
