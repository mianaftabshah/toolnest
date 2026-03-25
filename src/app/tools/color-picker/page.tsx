import type { Metadata } from 'next'
import ColorPickerClient from './client'

export const metadata: Metadata = {
  title: 'Color Picker',
  description: 'Free online color picker. Pick any color and instantly get HEX, RGB, HSL and CSS values. Copy with one click.',
}

export default function ColorPickerPage() { return <ColorPickerClient /> }
