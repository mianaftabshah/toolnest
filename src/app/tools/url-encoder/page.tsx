import type { Metadata } from 'next'
import URLClient from './client'
export const metadata: Metadata = { title: 'URL Encoder & Decoder', description: 'Encode or decode URLs and query strings instantly. Supports full URL and component encoding.' }
export default function Page() { return <URLClient /> }
