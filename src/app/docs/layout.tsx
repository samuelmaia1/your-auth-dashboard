import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AuthenticatedLayout } from '@components/authenticated-layout'

type DocsLayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Documentação | Your Auth',
  description: 'Documentação de uso da conta, projetos e API pública do Your Auth.',
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return <AuthenticatedLayout variant="documentation">{children}</AuthenticatedLayout>
}
