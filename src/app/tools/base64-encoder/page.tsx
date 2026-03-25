import type { Metadata } from 'next'
import Base64Client from './client'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder',
  description: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 strings back to plain text instantly.',
}

export default function Base64Page() { return <Base64Client /> }
