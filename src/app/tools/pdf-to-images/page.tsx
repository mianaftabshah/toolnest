import type { Metadata } from 'next'
import Client from './client'
export const metadata: Metadata = { title: 'PDF to Images', description: 'Convert PDF pages to JPG or PNG images. Free, private, no uploads needed.' }
export default function Page() { return <Client /> }
