import type { Metadata } from 'next'

import { SubscriptionScreen } from '@components/subscription-screen'

export const metadata: Metadata = {
  title: 'Assinatura | Your Auth',
  description: 'Assinatura, planos e limites da conta Your Auth',
}

export default function SubscriptionPage() {
  return <SubscriptionScreen />
}
