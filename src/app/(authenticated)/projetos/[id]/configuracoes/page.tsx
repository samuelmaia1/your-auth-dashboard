import type { Metadata } from 'next'

import { ProjectSettings } from '@components/project-settings'

type ProjectSettingsPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Configurações do projeto | Your Auth',
  description: 'Configurações de políticas e membros do projeto Your Auth',
}

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { id } = await params

  return <ProjectSettings projectId={id} />
}
