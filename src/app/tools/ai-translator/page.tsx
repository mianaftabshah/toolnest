import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'AI Text Translator', description: 'Translate text to any language instantly with AI. Supports 50+ languages.' }
export default function Page() { return <Client /> }
