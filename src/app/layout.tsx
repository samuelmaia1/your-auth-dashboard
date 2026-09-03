import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'

import { AppThemeProvider } from '@components/theme-provider/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'Your Auth — Identidade, sem complicação',
  description: 'Autenticação segura, flexível e pronta para escalar seus produtos SaaS.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AppThemeProvider>
      </body>
    </html>
  )
}
