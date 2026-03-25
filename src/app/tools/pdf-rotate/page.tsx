import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'Rotate PDF', description: 'Rotate PDF pages 90, 180, or 270 degrees. Free and private.' }
export default function Page() { return <Client /> }
