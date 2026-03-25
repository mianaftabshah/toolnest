import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Split PDF', description: 'Split a PDF into separate pages or extract a range of pages. Free and private.' }
export default function Page() { return <Client /> }
