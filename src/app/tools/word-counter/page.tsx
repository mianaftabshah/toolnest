import type { Metadata } from 'next'
import WordCounterClient from './client'

export const metadata: Metadata = {
  title: 'Word Counter',
  description: 'Free online word counter. Count words, characters, sentences, paragraphs and reading time instantly.',
}

export default function WordCounterPage() { return <WordCounterClient /> }
