import type { Metadata } from 'next'

import { ProjectCreate } from '@components/project-create'

export const metadata: Metadata = {
  title: 'Criar projeto | Your Auth',
  description: 'Criação de projeto da sua conta Your Auth',
}

export default function CreateProjectPage() {
  return <ProjectCreate />
}
