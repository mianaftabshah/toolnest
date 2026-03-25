import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Add Page Numbers to PDF', description: 'Add page numbers to your PDF. Choose position, format and style. Free and private.' }
export default function Page() { return <Client /> }
