import type { Metadata } from 'next'
import JSONFormatterClient from './client'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'Free online JSON formatter, beautifier, and validator. Paste your JSON to instantly format, validate, and minify it.',
}

export default function JSONFormatterPage() {
  return <JSONFormatterClient />
}
