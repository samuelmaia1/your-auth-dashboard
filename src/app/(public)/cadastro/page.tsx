import type { Metadata } from 'next'

import { AccountSignup } from '@components/account-signup'

export const metadata: Metadata = {
  title: 'Cadastro | Your Auth',
  description: 'Crie uma conta Your Auth e configure o workspace inicial do seu produto.',
}

export default function CadastroPage() {
  return <AccountSignup />
}
