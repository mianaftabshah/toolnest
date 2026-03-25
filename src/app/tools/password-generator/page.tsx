import type { Metadata } from 'next'
import PasswordClient from './client'

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate strong, secure passwords instantly. Customize length, symbols, numbers and more.',
}

export default function PasswordPage() { return <PasswordClient /> }
