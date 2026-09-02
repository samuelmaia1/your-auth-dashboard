import type { ReactNode } from 'react'

import { AuthenticatedLayout } from '@components/authenticated-layout'

type AuthenticatedRoutesLayoutProps = {
  children: ReactNode
}

export default function AuthenticatedRoutesLayout({ children }: AuthenticatedRoutesLayoutProps) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
