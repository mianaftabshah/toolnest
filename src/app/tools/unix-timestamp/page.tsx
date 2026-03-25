import type { Metadata } from 'next'
import UnixClient from './client'
export const metadata: Metadata = {
  title: 'Unix Timestamp Converter',
  description: 'Convert Unix timestamps to human-readable dates or any date to Unix timestamp instantly.',
}
export default function Page() { return <UnixClient /> }
