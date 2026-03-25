import type { Metadata } from 'next'
import LoremClient from './client'
export const metadata: Metadata = { title: 'Lorem Ipsum Generator', description: 'Generate Lorem Ipsum placeholder text by words, sentences, or paragraphs instantly.' }
export default function Page() { return <LoremClient /> }
