import type { Metadata } from 'next'

import { Dashboard } from '@components/home-dashboard'

export const metadata: Metadata = {
  title: 'Home | Your Auth',
  description: 'Resumo da sua conta Your Auth',
}

export default function HomePage() {
  return <Dashboard />
}
