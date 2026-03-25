import type { Metadata } from 'next'
import HashClient from './client'
export const metadata: Metadata = {
  title: 'Hash Generator — MD5, SHA-1, SHA-256',
  description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text instantly.',
}
export default function Page() { return <HashClient /> }
