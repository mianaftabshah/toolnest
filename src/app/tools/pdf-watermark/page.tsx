import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Watermark PDF', description: 'Add a text watermark to your PDF. Customize text, opacity, rotation and position. Free.' }
export default function Page() { return <Client /> }
