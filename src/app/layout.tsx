import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'ToolkitPro — Free Online Tools', template: '%s | ToolkitPro' },
  description:
    'Free online tools for PDF, image, text, and everyday tasks. Compress, convert, edit, and simplify your work — no login required.',
  keywords: [
    'free online tools',
    'pdf tools',
    'image tools',
    'document tools',
    'text tools',
    'pdf editor',
    'image compressor',
    'file converter',
    'toolkitpro',
  ],
  openGraph: {
    title: 'ToolkitPro — Free Online Tools',
    description:
      'Free online tools for PDF, image, text, and everyday tasks. No login. No ads. Just useful tools.',
    url: 'https://toolkitpro.site',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolkitPro — Free Online Tools',
    description:
      'Free online tools for PDF, image, text, and everyday tasks. No login. No ads. Just useful tools.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WTH7Y3L72K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WTH7Y3L72K');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-[#f9f8f6]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}