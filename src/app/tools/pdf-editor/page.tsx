import type { Metadata } from 'next'
import Client from './client'

export const metadata: Metadata = {
  title: 'PDF Editor — Add Text, Highlight & Annotate',
  description: 'Edit PDF files online. Add text, highlight, draw, and annotate PDFs directly in your browser. Free, private, no uploads.',
}

export default function Page() { return <Client /> }
