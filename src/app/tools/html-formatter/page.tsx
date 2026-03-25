import type { Metadata } from 'next'
import HTMLClient from './client'
export const metadata: Metadata = { title: 'HTML Formatter & Minifier', description: 'Beautify or minify HTML code instantly with proper indentation.' }
export default function Page() { return <HTMLClient /> }
