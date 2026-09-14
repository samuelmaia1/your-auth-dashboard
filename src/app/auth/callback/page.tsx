import type { Metadata } from 'next'
import { Suspense } from 'react'

import { SessionLoading } from '@components/session-loading'
import { SocialAuthCallback } from '@components/social-auth-callback'

export const metadata: Metadata = {
  title: 'Callback de autenticação | Your Auth',
  description: 'Finalização do login social da conta Your Auth.',
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<SessionLoading />}>
      <SocialAuthCallback />
    </Suspense>
  )
}
