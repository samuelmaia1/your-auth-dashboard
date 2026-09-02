import type { Metadata } from 'next'

import { AccountLogin } from '@components/account-login'

export const metadata: Metadata = {
  title: 'Login | Your Auth',
  description: 'Acesse sua conta Your Auth para continuar usando os recursos da plataforma.',
}

export default function LoginPage() {
  return <AccountLogin />
}
