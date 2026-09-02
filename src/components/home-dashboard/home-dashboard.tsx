'use client'

import { Activity, Folder, RefreshCcw, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import { getAccountSummary, isAccountSummaryServiceError } from '@/services/account.service'
import type {
  AccountProjectRole,
  AccountProjectSummaryResponse,
  AccountSummaryResponse,
  ProjectEnvironment,
  ProjectStatus,
} from '@/types/account-types'

import {
  EmptyDescription,
  EmptyState,
  ErrorActions,
  ErrorMessage,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  HomeHeader,
  HomeRoot,
  LoadingBlock,
  MetricCard,
  MetricIcon,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  ProjectBadge,
  ProjectBadges,
  ProjectCard,
  ProjectDescription,
  ProjectList,
  ProjectMain,
  ProjectsHeader,
  ProjectStat,
  ProjectStatLabel,
  ProjectStats,
  ProjectStatValue,
  ProjectTitle,
  RetryButton,
  SectionTitle,
} from './style'

type BadgeTone = 'success' | 'danger' | 'neutral' | 'info'

const defaultSummaryErrorMessage =
  'Não foi possível carregar o resumo da conta. Tente novamente em alguns instantes.'

const numberFormatter = new Intl.NumberFormat('pt-BR')

const projectStatusLabels: Record<ProjectStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
}

const projectEnvironmentLabels: Record<ProjectEnvironment, string> = {
  DEVELOPMENT: 'Desenvolvimento',
  PRODUCTION: 'Produção',
}

const accountProjectRoleLabels: Record<AccountProjectRole, string> = {
  OWNER: 'Proprietário',
  ADMIN: 'Administrador',
  DEVELOPER: 'Desenvolvedor',
  VIEWER: 'Visualizador',
}

const badgeToneByStatus: Record<ProjectStatus, BadgeTone> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  SUSPENDED: 'danger',
}

function formatNumber(value?: number) {
  return numberFormatter.format(value ?? 0)
}

function getSummaryErrorMessage(error: unknown) {
  if (isAccountSummaryServiceError(error)) {
    return error.response.message ?? defaultSummaryErrorMessage
  }

  return defaultSummaryErrorMessage
}

function getProjectStatusLabel(status?: ProjectStatus) {
  return status ? projectStatusLabels[status] : 'Status não informado'
}

function getProjectEnvironmentLabel(environment?: ProjectEnvironment) {
  return environment ? projectEnvironmentLabels[environment] : 'Ambiente não informado'
}

function getAccountProjectRoleLabel(role?: AccountProjectRole) {
  return role ? accountProjectRoleLabels[role] : 'Papel não informado'
}

function getStatusBadgeTone(status?: ProjectStatus): BadgeTone {
  return status ? badgeToneByStatus[status] : 'neutral'
}

async function fetchAccountSummary() {
  try {
    return {
      data: await getAccountSummary(),
      errorMessage: null,
    }
  } catch (error: unknown) {
    return {
      data: null,
      errorMessage: getSummaryErrorMessage(error),
    }
  }
}

function ProjectSummaryCard({ project }: { project: AccountProjectSummaryResponse }) {
  return (
    <ProjectCard>
      <ProjectMain>
        <ProjectTitle>{project.name?.trim() || 'Projeto sem nome'}</ProjectTitle>
        <ProjectDescription>{project.description?.trim() || 'Sem descrição.'}</ProjectDescription>
      </ProjectMain>

      <ProjectBadges>
        <ProjectBadge $tone={getStatusBadgeTone(project.status)}>
          {getProjectStatusLabel(project.status)}
        </ProjectBadge>
        <ProjectBadge $tone="info">{getProjectEnvironmentLabel(project.environment)}</ProjectBadge>
        <ProjectBadge $tone="neutral">{getAccountProjectRoleLabel(project.role)}</ProjectBadge>
      </ProjectBadges>

      <ProjectStats>
        <ProjectStat>
          <ProjectStatValue>{formatNumber(project.totalUsers)}</ProjectStatValue>
          <ProjectStatLabel>Usuários</ProjectStatLabel>
        </ProjectStat>
        <ProjectStat>
          <ProjectStatValue>{formatNumber(project.totalActiveSessions)}</ProjectStatValue>
          <ProjectStatLabel>Sessões ativas</ProjectStatLabel>
        </ProjectStat>
      </ProjectStats>
    </ProjectCard>
  )
}

function LoadingProjectCards() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
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

          <ProjectStats>
            <ProjectStat>
              <LoadingBlock $width={36} $height={22} />
              <LoadingBlock $width={58} />
            </ProjectStat>
            <ProjectStat>
              <LoadingBlock $width={36} $height={22} />
              <LoadingBlock $width={92} />
            </ProjectStat>
          </ProjectStats>
        </ProjectCard>
      ))}
    </>
  )
}

function Dashboard() {
  const { account, isLoadingAccount } = useAuth()
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [summaryErrorMessage, setSummaryErrorMessage] = useState<string | null>(null)
  const summaryRequestIdRef = useRef(0)
  const accountName = useMemo(
    () => [account?.name, account?.lastName].filter(Boolean).join(' '),
    [account?.lastName, account?.name],
  )
  const projects = summary?.projects ?? []
  const isSummaryUnavailable = !!summaryErrorMessage && !summary
  const metrics = [
    {
      label: 'Projetos',
      value: summary?.totalProjects,
      icon: Folder,
    },
    {
      label: 'Usuários ativos',
      value: summary?.totalUsers,
      icon: Users,
    },
    {
      label: 'Sessões ativas',
      value: summary?.totalActiveSessions,
      icon: Activity,
    },
  ]

  const loadSummary = useCallback(async () => {
    const requestId = summaryRequestIdRef.current + 1

    summaryRequestIdRef.current = requestId
    setIsLoadingSummary(true)
    setSummaryErrorMessage(null)

    const { data, errorMessage } = await fetchAccountSummary()

    if (summaryRequestIdRef.current === requestId) {
      setSummary(data)
      setSummaryErrorMessage(errorMessage)
      setIsLoadingSummary(false)
    }
  }, [])

  useEffect(() => {
    const requestId = summaryRequestIdRef.current + 1

    summaryRequestIdRef.current = requestId

    void fetchAccountSummary().then(({ data, errorMessage }) => {
      if (summaryRequestIdRef.current === requestId) {
        setSummary(data)
        setSummaryErrorMessage(errorMessage)
        setIsLoadingSummary(false)
      }
    })

    return () => {
      summaryRequestIdRef.current += 1
    }
  }, [])

  return (
    <HomeRoot>
      <HomeHeader>
        <HeaderContent>
          <HeaderEyebrow>Início</HeaderEyebrow>
          <HeaderTitle>Projetos de {account?.name}</HeaderTitle>
          <HeaderSubtitle>
            {isLoadingAccount
              ? 'Carregando dados da conta...'
              : accountName
                ? `Visão geral dos projetos vinculados a ${accountName}.`
                : 'Visão geral dos projetos vinculados à sua conta.'}
          </HeaderSubtitle>
        </HeaderContent>
      </HomeHeader>

      <MetricsGrid aria-label="Resumo geral">
        {metrics.map(({ icon: Icon, label, value }) => (
          <MetricCard key={label}>
            <MetricIcon>
              <Icon size={18} />
            </MetricIcon>
            <MetricLabel>{label}</MetricLabel>
            <MetricValue>
              {isLoadingSummary && !summary ? (
                <LoadingBlock $width={72} $height={36} />
              ) : isSummaryUnavailable ? (
                '-'
              ) : (
                formatNumber(value)
              )}
            </MetricValue>
          </MetricCard>
        ))}
      </MetricsGrid>

      <section>
        <ProjectsHeader>
          <SectionTitle>Projetos</SectionTitle>
        </ProjectsHeader>

        {summaryErrorMessage ? (
          <ErrorMessage role="alert">
            {summaryErrorMessage}
            <ErrorActions>
              <RetryButton type="button" size="sm" variant="outline" onClick={loadSummary}>
                <RefreshCcw size={16} />
                Tentar novamente
              </RetryButton>
            </ErrorActions>
          </ErrorMessage>
        ) : (
          <ProjectList aria-busy={isLoadingSummary}>
            {isLoadingSummary && !summary ? (
              <LoadingProjectCards />
            ) : projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectSummaryCard
                  key={project.id ?? project.name ?? `project-${index}`}
                  project={project}
                />
              ))
            ) : (
              <EmptyState>
                <SectionTitle>Nenhum projeto encontrado</SectionTitle>
                <EmptyDescription>
                  Quando a conta participar de projetos, eles aparecerão nesta lista.
                </EmptyDescription>
              </EmptyState>
            )}
          </ProjectList>
        )}
      </section>
    </HomeRoot>
  )
}

export { Dashboard }
