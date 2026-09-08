import type { Metadata } from 'next'

import { PlansScreen } from '@components/plans-screen'

export const metadata: Metadata = {
  title: 'Planos | Your Auth',
  description: 'Planos disponíveis e limites da conta Your Auth',
}

export default function PlansPage() {
  return <PlansScreen />
}
