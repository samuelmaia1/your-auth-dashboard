'use client'

import { ChevronLeft, ChevronRight, Plus, RefreshCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjects, isProjectsServiceError } from '@/services/project.service'
import type { ProjectEnvironment, ProjectStatus } from '@/types/account-types'
import type { ProjectsPageResponse, ProjectResponse } from '@/types/project-types'

import {
  EmptyDescription,
  EmptyState,
  ErrorActions,
  ErrorMessage,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  LoadingBlock,
  NewProjectButton,
  PageIndicator,
  PaginationActions,
  PaginationBar,
  PaginationButton,
  PaginationSummary,
  ProjectBadge,
  ProjectBadges,
  ProjectCard,
  ProjectCardLink,
  ProjectDescription,
  ProjectListGrid,
  ProjectMain,
  ProjectMetadata,
  ProjectMetadataItem,
  ProjectMetadataLabel,
  ProjectMetadataValue,
  ProjectTitle,
  ProjectsHeader,
  ProjectsRoot,
  SectionHeader,
  SectionTitle,
  RetryButton,
} from './style'

type BadgeTone = 'success' | 'danger' | 'neutral' | 'info'

const projectsPageSize = 10

const defaultProjectsErrorMessage =
  'Não foi possível carregar os projetos. Tente novamente em alguns instantes.'

const numberFormatter = new Intl.NumberFormat('pt-BR')
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const projectStatusLabels: Record<ProjectStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
}

const projectEnvironmentLabels: Record<ProjectEnvironment, string> = {
  DEVELOPMENT: 'Desenvolvimento',
  PRODUCTION: 'Produção',
}

const badgeToneByStatus: Record<ProjectStatus, BadgeTone> = {
  ACTIVE: 'success',
  INACTIVE: 'danger',
  SUSPENDED: 'danger',
}

function formatNumber(value?: number) {
  return numberFormatter.format(value ?? 0)
}

function formatDate(value?: string) {
  if (!value) {
    return 'Não informado'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Não informado'
  }

  return dateFormatter.format(date)
}

function getProjectStatusLabel(status?: ProjectStatus) {
  return status ? projectStatusLabels[status] : 'Status não informado'
}

function getProjectEnvironmentLabel(environment?: ProjectEnvironment) {
  return environment ? projectEnvironmentLabels[environment] : 'Ambiente não informado'
}

function getStatusBadgeTone(status?: ProjectStatus): BadgeTone {
  return status ? badgeToneByStatus[status] : 'neutral'
}

function getProjectsErrorMessage(error: unknown) {
  if (isProjectsServiceError(error)) {
    return error.response.message ?? defaultProjectsErrorMessage
  }

  return defaultProjectsErrorMessage
}

async function fetchProjectsPage(page: number) {
  try {
    return {
      data: await getProjects({
        page,
        size: projectsPageSize,
      }),
      errorMessage: null,
    }
  } catch (error: unknown) {
    return {
      data: null,
      errorMessage: getProjectsErrorMessage(error),
    }
  }
}

function getProjectTitle(project: ProjectResponse) {
  return project.name?.trim() || 'Projeto sem nome'
}

function getProjectDescription(project: ProjectResponse) {
  return project.description?.trim() || 'Sem descrição.'
}

function getProjectHref(project: ProjectResponse) {
  return project.id ? `/projetos/${encodeURIComponent(project.id)}` : null
}

function getPaginationSummary(projectsPage: ProjectsPageResponse | null) {
  const totalElements = projectsPage?.totalElements
  const contentLength = projectsPage?.content?.length ?? 0

  if (!projectsPage || contentLength === 0) {
    return null
  }

  if (totalElements === undefined) {
    return `${formatNumber(contentLength)} projetos nesta página`
  }

  const currentPage = projectsPage.page ?? 0
  const pageSize = projectsPage.size ?? projectsPageSize
  const firstItem = currentPage * pageSize + 1
  const lastItem = Math.min(firstItem + contentLength - 1, totalElements)

  return `${formatNumber(firstItem)}-${formatNumber(lastItem)} de ${formatNumber(
    totalElements,
  )} projetos`
}

function ProjectListCard({ project }: { project: ProjectResponse }) {
  const href = getProjectHref(project)
  const title = getProjectTitle(project)
  const content = (
    <>
      <ProjectMain>
        <ProjectTitle>{title}</ProjectTitle>
        <ProjectDescription>{getProjectDescription(project)}</ProjectDescription>
      </ProjectMain>

      <ProjectBadges>
        <ProjectBadge $tone={getStatusBadgeTone(project.status)}>
          {getProjectStatusLabel(project.status)}
        </ProjectBadge>
        <ProjectBadge $tone="info">{getProjectEnvironmentLabel(project.environment)}</ProjectBadge>
        <ProjectBadge $tone="neutral">
          {project.tokenAudience?.trim() || 'Sem audiência'}
        </ProjectBadge>
      </ProjectBadges>

      <ProjectMetadata>
        <ProjectMetadataItem>
          <ProjectMetadataLabel>Criado</ProjectMetadataLabel>
          <ProjectMetadataValue>{formatDate(project.createdAt)}</ProjectMetadataValue>
        </ProjectMetadataItem>
        <ProjectMetadataItem>
          <ProjectMetadataLabel>Atualizado</ProjectMetadataLabel>
          <ProjectMetadataValue>{formatDate(project.updatedAt)}</ProjectMetadataValue>
        </ProjectMetadataItem>
      </ProjectMetadata>
    </>
  )

  if (!href) {
    return <ProjectCard>{content}</ProjectCard>
  }

  return (
    <ProjectCardLink href={href} aria-label={`Abrir projeto ${title}`}>
      {content}
    </ProjectCardLink>
  )
}

function LoadingProjectCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <ProjectCard key={index} aria-hidden="true">
          <ProjectMain>
            <LoadingBlock $width="45%" $height={20} />
            <LoadingBlock $width="72%" />
          </ProjectMain>

          <ProjectBadges>
            <LoadingBlock $width={76} $height={28} />
            <LoadingBlock $width={116} $height={28} />
            <LoadingBlock $width={96} $height={28} />
          </ProjectBadges>

          <ProjectMetadata>
            <ProjectMetadataItem>
              <LoadingBlock $width={46} $height={18} />
              <LoadingBlock $width={78} />
            </ProjectMetadataItem>
            <ProjectMetadataItem>
              <LoadingBlock $width={62} $height={18} />
              <LoadingBlock $width={78} />
            </ProjectMetadataItem>
          </ProjectMetadata>
        </ProjectCard>
      ))}
    </>
  )
}

export function ProjectsList() {
  const [page, setPage] = useState(0)
  const [projectsPage, setProjectsPage] = useState<ProjectsPageResponse | null>(null)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsErrorMessage, setProjectsErrorMessage] = useState<string | null>(null)
  const projectsRequestIdRef = useRef(0)
  const projects = projectsPage?.content ?? []
  const currentPage = projectsPage?.page ?? page
  const totalPages = projectsPage?.totalPages ?? 0
  const hasPagination = totalPages > 1
  const isPreviousDisabled = isLoadingProjects || currentPage <= 0
  const isNextDisabled = isLoadingProjects || totalPages === 0 || currentPage >= totalPages - 1
  const paginationSummary = getPaginationSummary(projectsPage)

  const fetchAndApplyProjectsPage = useCallback(async (pageToLoad: number) => {
    const requestId = projectsRequestIdRef.current + 1

    projectsRequestIdRef.current = requestId

    const { data, errorMessage } = await fetchProjectsPage(pageToLoad)

    if (projectsRequestIdRef.current === requestId) {
      setProjectsPage(data)
      setProjectsErrorMessage(errorMessage)
      setIsLoadingProjects(false)
    }
  }, [])

  const loadProjects = useCallback(
    (pageToLoad: number) => {
      setIsLoadingProjects(true)
      setProjectsErrorMessage(null)
      setProjectsPage(null)

      void fetchAndApplyProjectsPage(pageToLoad)
    },
    [fetchAndApplyProjectsPage],
  )

  useEffect(() => {
    void fetchAndApplyProjectsPage(page)

    return () => {
      projectsRequestIdRef.current += 1
    }
  }, [fetchAndApplyProjectsPage, page])

  function goToPreviousPage() {
    setIsLoadingProjects(true)
    setProjectsErrorMessage(null)
    setProjectsPage(null)
    setPage((currentPageIndex) => Math.max(currentPageIndex - 1, 0))
  }

  function goToNextPage() {
    setIsLoadingProjects(true)
    setProjectsErrorMessage(null)
    setProjectsPage(null)
    setPage((currentPageIndex) => currentPageIndex + 1)
  }

  return (
    <ProjectsRoot>
      <ProjectsHeader>
        <HeaderContent>
          <HeaderEyebrow>Projetos</HeaderEyebrow>
          <HeaderTitle>Projetos da conta</HeaderTitle>
          <HeaderSubtitle>
            Consulte os projetos vinculados à conta autenticada e acesse os detalhes de cada um.
          </HeaderSubtitle>
        </HeaderContent>

        <NewProjectButton type="button" size="lg">
          <Plus size={16} />
          Novo projeto
        </NewProjectButton>
      </ProjectsHeader>

      <section>
        <SectionHeader>
          <SectionTitle>Lista de projetos</SectionTitle>
        </SectionHeader>

        {projectsErrorMessage ? (
          <ErrorMessage role="alert">
            {projectsErrorMessage}
            <ErrorActions>
              <RetryButton
                type="button"
                size="sm"
                variant="outline"
                onClick={() => loadProjects(page)}
              >
                <RefreshCcw size={16} />
                Tentar novamente
              </RetryButton>
            </ErrorActions>
          </ErrorMessage>
        ) : (
          <>
            <ProjectListGrid aria-busy={isLoadingProjects}>
              {isLoadingProjects && !projectsPage ? (
                <LoadingProjectCards />
              ) : projects.length > 0 ? (
                projects.map((project, index) => (
                  <ProjectListCard
                    key={project.id ?? project.name ?? `project-${index}`}
                    project={project}
                  />
                ))
              ) : (
                <EmptyState>
                  <SectionTitle>Nenhum projeto encontrado</SectionTitle>
                  <EmptyDescription>
                    Quando a conta tiver projetos cadastrados, eles aparecerão nesta lista.
                  </EmptyDescription>
                </EmptyState>
              )}
            </ProjectListGrid>

            {hasPagination && (
              <PaginationBar>
                {paginationSummary && <PaginationSummary>{paginationSummary}</PaginationSummary>}

                <PaginationActions aria-label="Paginação de projetos">
                  <PaginationButton
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPreviousDisabled}
                    onClick={goToPreviousPage}
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </PaginationButton>
                  <PageIndicator>
                    Página {formatNumber(currentPage + 1)} de {formatNumber(totalPages)}
                  </PageIndicator>
                  <PaginationButton
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isNextDisabled}
                    onClick={goToNextPage}
                  >
                    Próxima
                    <ChevronRight size={16} />
                  </PaginationButton>
                </PaginationActions>
              </PaginationBar>
            )}
          </>
        )}
      </section>
    </ProjectsRoot>
  )
}
