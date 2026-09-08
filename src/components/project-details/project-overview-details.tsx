import type { ProjectResponse } from '@/types/project-types'

import {
  formatDateTime,
  getDisplayText,
  getProjectEnvironmentLabel,
  getProjectStatusBadgeTone,
  getProjectStatusLabel,
  LoadingOverview,
} from './project-details.shared'
import {
  Badge,
  BadgeGroup,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  OverviewTop,
  ProjectDescription,
  ProjectOverview,
} from './style'

type ProjectOverviewDetailsProps = {
  isLoading: boolean
  project: ProjectResponse | null
}

export function ProjectOverviewDetails({ isLoading, project }: ProjectOverviewDetailsProps) {
  if (isLoading && !project) {
    return <LoadingOverview />
  }

  return (
    <ProjectOverview>
      <OverviewTop>
        <ProjectDescription>{project?.description?.trim() || 'Sem descrição.'}</ProjectDescription>

        <BadgeGroup>
          <Badge $tone={getProjectStatusBadgeTone(project?.status)}>
            {getProjectStatusLabel(project?.status)}
          </Badge>
          <Badge $tone="info">{getProjectEnvironmentLabel(project?.environment)}</Badge>
        </BadgeGroup>
      </OverviewTop>

      <DetailsGrid>
        <DetailItem>
          <DetailLabel>Nome</DetailLabel>
          <DetailValue>{project?.name?.trim() || 'Projeto sem nome'}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Audiência do token</DetailLabel>
          <DetailValue>{getDisplayText(project?.tokenAudience)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Ambiente</DetailLabel>
          <DetailValue>{getProjectEnvironmentLabel(project?.environment)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Status</DetailLabel>
          <DetailValue>{getProjectStatusLabel(project?.status)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Criado em</DetailLabel>
          <DetailValue>{formatDateTime(project?.createdAt)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Atualizado em</DetailLabel>
          <DetailValue>{formatDateTime(project?.updatedAt)}</DetailValue>
        </DetailItem>
      </DetailsGrid>
    </ProjectOverview>
  )
}
