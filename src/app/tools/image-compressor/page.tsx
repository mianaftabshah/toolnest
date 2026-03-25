import type { Metadata } from 'next'
import ImageClient from './client'
export const metadata: Metadata = { title: 'Image Compressor', description: 'Compress JPEG and PNG images in your browser. Reduce file size by up to 80% with no uploads needed.' }
export default function Page() { return <ImageClient /> }
