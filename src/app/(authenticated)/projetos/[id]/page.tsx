import type { Metadata } from 'next'

import { ProjectDetails } from '@components/project-details'

type ProjectPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Projeto | Your Auth',
  description: 'Detalhes do projeto vinculado à sua conta Your Auth',
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params

  return <ProjectDetails projectId={id} />
}
