import type { Metadata } from 'next'
import CSSClient from './client'
export const metadata: Metadata = { title: 'CSS Minifier & Beautifier', description: 'Minify CSS to reduce file size or beautify minified CSS back to readable format instantly.' }
export default function Page() { return <CSSClient /> }
