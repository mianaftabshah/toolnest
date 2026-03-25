import type { Metadata } from 'next'
import MarkdownClient from './client'
export const metadata: Metadata = { title: 'Markdown Preview', description: 'Write Markdown and see a live rendered preview. Copy HTML output with one click.' }
export default function Page() { return <MarkdownClient /> }
