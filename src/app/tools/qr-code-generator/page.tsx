import type { Metadata } from 'next'
import QRClient from './client'

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Free QR code generator. Create QR codes for URLs, text, email, phone numbers and more. Download as PNG.',
}

export default function QRPage() { return <QRClient /> }
