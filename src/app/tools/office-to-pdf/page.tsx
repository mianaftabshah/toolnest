import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Word / Excel / PPT to PDF', description: 'Convert Word, Excel and PowerPoint files to PDF instantly in your browser.' }
export default function Page() { return <Client /> }
