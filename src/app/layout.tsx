import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'ToolNest — Free Online Tools', template: '%s | ToolNest' },
  description: 'Free online tools for developers, designers, and everyone. JSON formatter, password generator, QR codes, Base64 encoder, word counter, color picker — no login required.',
  keywords: ['free online tools', 'json formatter', 'password generator', 'qr code generator', 'base64 encoder', 'word counter', 'color picker'],
  openGraph: {
    title: 'ToolNest — Free Online Tools',
    description: 'Free online tools. No login. No ads. Just tools.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f9f8f6]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
