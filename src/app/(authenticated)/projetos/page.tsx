import type { Metadata } from 'next'

import { ProjectsList } from '@components/projects-list'

export const metadata: Metadata = {
  title: 'Projetos | Your Auth',
  description: 'Projetos vinculados à sua conta Your Auth',
}

export default function ProjectsPage() {
  return <ProjectsList />
}
