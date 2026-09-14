'use client'

import { Activity, Folder, LoaderCircle, LogOut, RefreshCcw, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import { getAccountSummary, isAccountSummaryServiceError } from '@/services/account.service'
import { ReceivedInvitesInbox } from '@components/project-invites'
import type {
  AccountResponse,
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
  HeaderActions,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  HomeHeader,
  HomeRoot,
  LoadingBlock,
  LogoutButton,
  LogoutSpinner,
  MetricCard,
  MetricIcon,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  ProjectBadge,
  ProjectBadges,
  ProjectCard,
  ProjectCardLink,
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
  AccountAvatar,
  AccountAvatarImage,
  HeaderIdentity,
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
  INACTIVE: 'danger',
  SUSPENDED: 'danger',
}

function formatNumber(value?: number) {
  return numberFormatter.format(value ?? 0)
}

function getAccountDisplayName(account?: AccountResponse | null) {
  const fullName = [account?.name, account?.lastName]
    .map((namePart) => namePart?.trim())
    .filter(Boolean)
    .join(' ')

  return fullName || account?.email?.trim() || 'sua conta'
}

function getAccountInitials(displayName: string) {
  const nameParts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (nameParts.length === 0 || displayName === 'sua conta') {
    return 'YA'
  }

  const firstInitial = nameParts[0]?.[0] ?? ''
  const secondInitial = nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? '') : ''

  return `${firstInitial}${secondInitial}`.toUpperCase()
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
  const href = project.id ? `/projetos/${encodeURIComponent(project.id)}` : null
  const title = project.name?.trim() || 'Projeto sem nome'
  const content = (
    <>
      <ProjectMain>
        <ProjectTitle>{title}</ProjectTitle>
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
  const { account, isAuthenticated, isLoadingAccount, logout } = useAuth()
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(isAuthenticated)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [summaryErrorMessage, setSummaryErrorMessage] = useState<string | null>(null)
  const summaryRequestIdRef = useRef(0)
  const accountName = useMemo(
    () => [account?.name, account?.lastName].filter(Boolean).join(' '),
    [account?.lastName, account?.name],
  )
  const accountDisplayName = useMemo(() => getAccountDisplayName(account), [account])
  const accountInitials = useMemo(
    () => getAccountInitials(accountDisplayName),
    [accountDisplayName],
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
    if (!isAuthenticated) {
      return
    }

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
  }, [isAuthenticated])

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
    } catch {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, logout])

  useEffect(() => {
    if (!isAuthenticated) {
      summaryRequestIdRef.current += 1
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadSummary()
      }
    })

    return () => {
      shouldLoad = false
      summaryRequestIdRef.current += 1
    }
  }, [isAuthenticated, loadSummary])

  return (
    <HomeRoot>
      <HomeHeader>
        <HeaderIdentity>
          <AccountAvatar aria-label={`Identificação visual de ${accountDisplayName}`}>
            {account?.avatarUrl ? (
              <AccountAvatarImage
                src={account.avatarUrl}
                alt={`Avatar de ${accountDisplayName}`}
                width={48}
                height={48}
              />
            ) : (
              <span aria-hidden="true">{accountInitials}</span>
            )}
          </AccountAvatar>
          <HeaderContent>
            <HeaderEyebrow>Início</HeaderEyebrow>
            <HeaderTitle>Projetos de {accountDisplayName}</HeaderTitle>
            <HeaderSubtitle>
              {isLoadingAccount
                ? 'Carregando dados da conta...'
                : accountName
                  ? `Visão geral dos projetos vinculados a ${accountName}.`
                  : 'Visão geral dos projetos vinculados à sua conta.'}
            </HeaderSubtitle>
          </HeaderContent>
        </HeaderIdentity>
        <HeaderActions>
          <ReceivedInvitesInbox />
          <LogoutButton
            type="button"
            size="icon"
            variant="outline"
            aria-label={isLoggingOut ? 'Saindo da conta' : 'Sair da conta'}
            title="Sair da conta"
            disabled={isLoggingOut}
            onClick={() => {
              void handleLogout()
            }}
          >
            {isLoggingOut ? (
              <LogoutSpinner>
                <LoaderCircle size={18} />
              </LogoutSpinner>
            ) : (
              <LogOut size={18} />
            )}
          </LogoutButton>
        </HeaderActions>
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
