import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Compress PDF', description: 'Reduce PDF file size online. Free, fast, and private — all in your browser.' }
export default function Page() { return <Client /> }
