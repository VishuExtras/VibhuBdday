import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'
import MusicPlayer from '@/components/MusicPlayer'
import HeartCursor from '@/components/HeartCursor'
import SecretHeart from '@/components/SecretHeart'
import HugButton from '@/components/HugButton'
import Navigation from '@/components/Navigation'
import EasterEggManager from '@/components/EasterEggManager'

export const metadata: Metadata = {
  title: 'Our Universe',
  description: 'Made with love, especially for Vibhuti.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFAFA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Allura&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <MusicPlayer />
        <HeartCursor />
        <SecretHeart />
        <HugButton />
        <EasterEggManager />
      </body>
    </html>
  )
}
