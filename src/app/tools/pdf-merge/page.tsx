import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Merge PDF', description: 'Combine multiple PDF files into one. Free, fast, and secure — all in your browser.' }
export default function Page() { return <Client /> }
