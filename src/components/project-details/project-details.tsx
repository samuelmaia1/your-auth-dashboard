'use client'

import {
  Activity,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Key,
  KeyRound,
  RefreshCcw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import {
  getProjectApiKeys,
  getProjectAuthConfig,
  getProjectById,
  getProjectPasswordConfig,
  getProjectSessions,
  getProjectUsers,
  isProjectsServiceError,
} from '@/services/project.service'
import type { ProjectEnvironment, ProjectStatus } from '@/types/account-types'
import type { ApiPageResponse } from '@/types/api-response-types'
import type {
  AccountBasicResponse,
  ProjectApiKeyDetailsResponse,
  ProjectApiKeysPageResponse,
  ProjectApiKeyScope,
  ProjectAuthConfigResponse,
  ProjectPasswordConfigResponse,
  ProjectResponse,
  ProjectSessionMode,
  ProjectUserResponse,
  ProjectUsersPageResponse,
  ProjectUserSessionResponse,
  ProjectUserSessionsPageResponse,
  ProjectUserSessionStatus,
  ProjectUserStatus,
} from '@/types/project-types'

import {
  BackLink,
  Badge,
  BadgeGroup,
  ConfigGrid,
  ConfigItem,
  ConfigLabel,
  ConfigValue,
  DataList,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  EmptyDescription,
  EmptyState,
  ErrorActions,
  ErrorMessage,
  HeaderActions,
  HeaderButton,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  InlineBadgeGroup,
  LoadingBlock,
  OverviewTop,
  PageIndicator,
  PaginationActions,
  PaginationBar,
  PaginationButton,
  PaginationSummary,
  ProjectDescription,
  ProjectDetailsHeader,
  ProjectDetailsRoot,
  ProjectOverview,
  RecordCard,
  RecordDescription,
  RecordDetail,
  RecordDetails,
  RecordLabel,
  RecordMain,
  RecordTitle,
  RecordValue,
  RetryButton,
  SectionSubtitle,
  SectionTitle,
  TabButton,
  TabHeader,
  TabList,
  TabPanel,
  TabsSection,
} from './style'

type ProjectDetailsProps = {
  projectId: string
}

type BadgeTone = 'success' | 'danger' | 'neutral' | 'info'

type ProjectDetailsTab = 'sessions' | 'users' | 'password-policy' | 'auth-policy' | 'api-keys'

type ResourceState<TData> = {
  data: TData | null
  isLoading: boolean
  errorMessage: string | null
}

type TabItem = {
  key: ProjectDetailsTab
  label: string
  icon: LucideIcon
}

type PaginationControlsProps<TData> = {
  currentPage: number
  isLoading: boolean
  itemLabelPlural: string
  itemLabelSingular: string
  onNextPage: () => void
  onPreviousPage: () => void
  pageData: ApiPageResponse<TData> | null
}

const projectResourcePageSize = 20

const defaultProjectErrorMessage =
  'Não foi possível carregar o projeto. Tente novamente em alguns instantes.'
const defaultSessionsErrorMessage =
  'Não foi possível carregar as sessões do projeto. Tente novamente em alguns instantes.'
const defaultUsersErrorMessage =
  'Não foi possível carregar os usuários do projeto. Tente novamente em alguns instantes.'
const defaultPasswordConfigErrorMessage =
  'Não foi possível carregar a política de senha. Tente novamente em alguns instantes.'
const defaultAuthConfigErrorMessage =
  'Não foi possível carregar a política de autenticação. Tente novamente em alguns instantes.'
const defaultApiKeysErrorMessage =
  'Não foi possível carregar as API keys do projeto. Tente novamente em alguns instantes.'

const numberFormatter = new Intl.NumberFormat('pt-BR')
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const projectDetailsTabs: TabItem[] = [
  {
    key: 'sessions',
    label: 'Sessões',
    icon: Activity,
  },
  {
    key: 'users',
    label: 'Usuários',
    icon: Users,
  },
  {
    key: 'password-policy',
    label: 'Política de Senha',
    icon: KeyRound,
  },
  {
    key: 'auth-policy',
    label: 'Política de autenticação',
    icon: ShieldCheck,
  },
  {
    key: 'api-keys',
    label: 'API Keys',
    icon: Key,
  },
]

const projectStatusLabels: Record<ProjectStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
}

const projectEnvironmentLabels: Record<ProjectEnvironment, string> = {
  DEVELOPMENT: 'Desenvolvimento',
  PRODUCTION: 'Produção',
}

const projectUserStatusLabels: Record<ProjectUserStatus, string> = {
  ACTIVE: 'Ativo',
  DISABLED: 'Desativado',
  BLOCKED: 'Bloqueado',
}

const projectUserSessionStatusLabels: Record<ProjectUserSessionStatus, string> = {
  ACTIVE: 'Ativa',
  INACTIVE: 'Inativa',
}

const projectSessionModeLabels: Record<ProjectSessionMode, string> = {
  MULTIPLE_DEVICES: 'Múltiplos dispositivos',
  SINGLE_ACTIVE_SESSION: 'Sessão única ativa',
  LIMITED_ACTIVE_SESSIONS: 'Sessões ativas limitadas',
}

const apiKeyScopeLabels: Record<ProjectApiKeyScope, string> = {
  USERS_READ: 'Leitura de usuários',
  USERS_WRITE: 'Escrita de usuários',
  AUTH_LOGIN: 'Login',
  AUTH_REGISTER: 'Cadastro',
}

const projectStatusBadgeTones: Record<ProjectStatus, BadgeTone> = {
  ACTIVE: 'success',
  INACTIVE: 'danger',
  SUSPENDED: 'danger',
}

const projectUserStatusBadgeTones: Record<ProjectUserStatus, BadgeTone> = {
  ACTIVE: 'success',
  DISABLED: 'neutral',
  BLOCKED: 'danger',
}

const projectUserSessionStatusBadgeTones: Record<ProjectUserSessionStatus, BadgeTone> = {
  ACTIVE: 'success',
  INACTIVE: 'danger',
}

function formatNumber(value?: number | null) {
  return numberFormatter.format(value ?? 0)
}

function formatOptionalNumber(value?: number | null, suffix?: string) {
  if (value === undefined || value === null) {
    return 'Não informado'
  }

  const formattedValue = formatNumber(value)

  return suffix ? `${formattedValue} ${suffix}` : formattedValue
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Não informado'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Não informado'
  }

  return dateTimeFormatter.format(date)
}

function getTrimmedText(value?: string | null) {
  return value?.trim() || null
}

function getDisplayText(value?: string | null) {
  return getTrimmedText(value) ?? 'Não informado'
}

function joinDetails(parts: Array<string | null | undefined>) {
  return parts.filter((part): part is string => Boolean(part?.trim())).join(' - ')
}

function getProjectStatusLabel(status?: ProjectStatus) {
  return status ? (projectStatusLabels[status] ?? status) : 'Status não informado'
}

function getProjectEnvironmentLabel(environment?: ProjectEnvironment) {
  return environment
    ? (projectEnvironmentLabels[environment] ?? environment)
    : 'Ambiente não informado'
}

function getProjectStatusBadgeTone(status?: ProjectStatus): BadgeTone {
  return status ? (projectStatusBadgeTones[status] ?? 'neutral') : 'neutral'
}

function getUserStatusLabel(status?: ProjectUserStatus) {
  return status ? (projectUserStatusLabels[status] ?? status) : 'Status não informado'
}

function getUserStatusBadgeTone(status?: ProjectUserStatus): BadgeTone {
  return status ? (projectUserStatusBadgeTones[status] ?? 'neutral') : 'neutral'
}

function getSessionStatusLabel(status?: ProjectUserSessionStatus) {
  return status ? (projectUserSessionStatusLabels[status] ?? status) : 'Status não informado'
}

function getSessionStatusBadgeTone(status?: ProjectUserSessionStatus): BadgeTone {
  return status ? (projectUserSessionStatusBadgeTones[status] ?? 'neutral') : 'neutral'
}

function getSessionModeLabel(sessionMode?: ProjectSessionMode) {
  return sessionMode ? (projectSessionModeLabels[sessionMode] ?? sessionMode) : 'Modo não informado'
}

function getScopeLabel(scope: ProjectApiKeyScope) {
  return apiKeyScopeLabels[scope] ?? scope
}

function getBooleanLabel(value?: boolean | null) {
  if (value === undefined || value === null) {
    return 'Não informado'
  }

  return value ? 'Sim' : 'Não'
}

function getBooleanBadgeTone(value?: boolean | null): BadgeTone {
  if (value === undefined || value === null) {
    return 'info'
  }

  return value ? 'success' : 'neutral'
}

function getProjectErrorMessage(error: unknown, fallbackMessage: string) {
  if (isProjectsServiceError(error)) {
    return error.response.message ?? fallbackMessage
  }

  return fallbackMessage
}

async function fetchResource<TData>(request: () => Promise<TData>, fallbackMessage: string) {
  try {
    return {
      data: await request(),
      errorMessage: null,
    }
  } catch (error: unknown) {
    return {
      data: null,
      errorMessage: getProjectErrorMessage(error, fallbackMessage),
    }
  }
}

function getPageTotal<TData>(pageData: ApiPageResponse<TData> | null) {
  return pageData?.totalElements
}

function getPaginationSummary<TData>(
  pageData: ApiPageResponse<TData> | null,
  itemLabelSingular: string,
  itemLabelPlural: string,
) {
  const contentLength = pageData?.content?.length ?? 0

  if (!pageData || contentLength === 0) {
    return null
  }

  const totalElements = pageData.totalElements

  if (totalElements === undefined) {
    const label = contentLength === 1 ? itemLabelSingular : itemLabelPlural

    return `${formatNumber(contentLength)} ${label} nesta página`
  }

  const currentPage = pageData.page ?? 0
  const pageSize = pageData.size ?? projectResourcePageSize
  const firstItem = currentPage * pageSize + 1
  const lastItem = Math.min(firstItem + contentLength - 1, totalElements)
  const label = totalElements === 1 ? itemLabelSingular : itemLabelPlural

  return `${formatNumber(firstItem)}-${formatNumber(lastItem)} de ${formatNumber(
    totalElements,
  )} ${label}`
}

function getUserTitle(user?: ProjectUserResponse, fallbackUserId?: string) {
  return (
    getTrimmedText(user?.email) ??
    getTrimmedText(user?.id) ??
    getTrimmedText(fallbackUserId) ??
    'Usuário não informado'
  )
}

function getAccountName(account?: AccountBasicResponse) {
  const fullName = joinDetails([account?.name, account?.lastName]).replace(' - ', ' ')

  return (
    getTrimmedText(fullName) ??
    getTrimmedText(account?.email) ??
    getTrimmedText(account?.id) ??
    'Não informado'
  )
}

function getApiKeyPreview(apiKey: ProjectApiKeyDetailsResponse) {
  const prefix = getTrimmedText(apiKey.prefix)
  const secretLastFour = getTrimmedText(apiKey.secretLastFour)

  if (prefix && secretLastFour) {
    return `${prefix}...${secretLastFour}`
  }

  return prefix ?? getTrimmedText(apiKey.keyId) ?? 'Chave sem identificador'
}

function BooleanBadge({ value }: { value?: boolean | null }) {
  return <Badge $tone={getBooleanBadgeTone(value)}>{getBooleanLabel(value)}</Badge>
}

function ResourceError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <ErrorMessage role="alert">
      {message}
      <ErrorActions>
        <RetryButton type="button" size="sm" variant="outline" onClick={onRetry}>
          <RefreshCcw size={16} />
          Tentar novamente
        </RetryButton>
      </ErrorActions>
    </ErrorMessage>
  )
}

function LoadingOverview() {
  return (
    <ProjectOverview aria-hidden="true">
      <OverviewTop>
        <ProjectDescription>
          <LoadingBlock $width="58%" />
        </ProjectDescription>

        <BadgeGroup>
          <LoadingBlock $width={82} $height={28} />
          <LoadingBlock $width={122} $height={28} />
        </BadgeGroup>
      </OverviewTop>

      <DetailsGrid>
        {Array.from({ length: 8 }).map((_, index) => (
          <DetailItem key={index}>
            <LoadingBlock $width="42%" $height={16} />
            <LoadingBlock $width="74%" />
          </DetailItem>
        ))}
      </DetailsGrid>
    </ProjectOverview>
  )
}

function LoadingRecords() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <RecordCard key={index} aria-hidden="true">
          <RecordMain>
            <LoadingBlock $width="46%" $height={20} />
            <LoadingBlock $width="68%" />
          </RecordMain>

          <RecordDetails>
            {Array.from({ length: 4 }).map((__, detailIndex) => (
              <RecordDetail key={detailIndex}>
                <LoadingBlock $width="48%" $height={16} />
                <LoadingBlock $width="72%" />
              </RecordDetail>
            ))}
          </RecordDetails>
        </RecordCard>
      ))}
    </>
  )
}

function LoadingConfigGrid() {
  return (
    <ConfigGrid aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <ConfigItem key={index}>
          <LoadingBlock $width="52%" $height={16} />
          <LoadingBlock $width="34%" $height={24} />
        </ConfigItem>
      ))}
    </ConfigGrid>
  )
}

function PaginationControls<TData>({
  currentPage,
  isLoading,
  itemLabelPlural,
  itemLabelSingular,
  onNextPage,
  onPreviousPage,
  pageData,
}: PaginationControlsProps<TData>) {
  const resolvedCurrentPage = pageData?.page ?? currentPage
  const totalPages = pageData?.totalPages ?? 0
  const hasPagination = totalPages > 1
  const paginationSummary = getPaginationSummary(pageData, itemLabelSingular, itemLabelPlural)
  const isPreviousDisabled = isLoading || resolvedCurrentPage <= 0
  const isNextDisabled = isLoading || totalPages === 0 || resolvedCurrentPage >= totalPages - 1

  if (!hasPagination) {
    return null
  }

  return (
    <PaginationBar>
      {paginationSummary && <PaginationSummary>{paginationSummary}</PaginationSummary>}

      <PaginationActions aria-label={`Paginação de ${itemLabelPlural}`}>
        <PaginationButton
          type="button"
          size="sm"
          variant="outline"
          disabled={isPreviousDisabled}
          onClick={onPreviousPage}
        >
          <ChevronLeft size={16} />
          Anterior
        </PaginationButton>
        <PageIndicator>
          Página {formatNumber(resolvedCurrentPage + 1)} de {formatNumber(totalPages)}
        </PageIndicator>
        <PaginationButton
          type="button"
          size="sm"
          variant="outline"
          disabled={isNextDisabled}
          onClick={onNextPage}
        >
          Próxima
          <ChevronRight size={16} />
        </PaginationButton>
      </PaginationActions>
    </PaginationBar>
  )
}

function ProjectOverviewDetails({
  isLoading,
  project,
  projectId,
}: {
  isLoading: boolean
  project: ProjectResponse | null
  projectId: string
}) {
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
          <DetailLabel>ID</DetailLabel>
          <DetailValue>{getDisplayText(project?.id ?? projectId)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Conta proprietária</DetailLabel>
          <DetailValue>{getDisplayText(project?.ownerAccountId)}</DetailValue>
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
        <DetailItem>
          <DetailLabel>Nome</DetailLabel>
          <DetailValue>{project?.name?.trim() || 'Projeto sem nome'}</DetailValue>
        </DetailItem>
      </DetailsGrid>
    </ProjectOverview>
  )
}

function SessionsTab({
  currentPage,
  onNextPage,
  onPreviousPage,
  onRetry,
  state,
}: {
  currentPage: number
  onNextPage: () => void
  onPreviousPage: () => void
  onRetry: () => void
  state: ResourceState<ProjectUserSessionsPageResponse>
}) {
  const sessions = state.data?.content ?? []
  const totalSessions = getPageTotal(state.data)
  const hasInitialLoading = state.isLoading && !state.data

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>Sessões</SectionTitle>
          {totalSessions !== undefined && (
            <SectionSubtitle>{formatNumber(totalSessions)} sessões encontradas</SectionSubtitle>
          )}
        </div>
      </TabHeader>

      {state.errorMessage ? (
        <ResourceError message={state.errorMessage} onRetry={onRetry} />
      ) : (
        <>
          <DataList aria-busy={state.isLoading}>
            {hasInitialLoading ? (
              <LoadingRecords />
            ) : sessions.length > 0 ? (
              sessions.map((session, index) => (
                <SessionRecord
                  key={session.id ?? `${session.userId ?? 'session'}-${index}`}
                  session={session}
                />
              ))
            ) : (
              <EmptyState>
                <SectionTitle>Nenhuma sessão encontrada</SectionTitle>
                <EmptyDescription>
                  Quando usuários finais iniciarem sessões neste projeto, elas aparecerão aqui.
                </EmptyDescription>
              </EmptyState>
            )}
          </DataList>

          <PaginationControls
            currentPage={currentPage}
            isLoading={state.isLoading}
            itemLabelPlural="sessões"
            itemLabelSingular="sessão"
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            pageData={state.data}
          />
        </>
      )}
    </>
  )
}

function SessionRecord({ session }: { session: ProjectUserSessionResponse }) {
  const sessionDescription =
    joinDetails([getTrimmedText(session.deviceName), session.id ? `Sessão ${session.id}` : null]) ||
    'Sessão sem identificação'

  return (
    <RecordCard>
      <RecordMain>
        <RecordTitle>{getUserTitle(session.user, session.userId)}</RecordTitle>
        <RecordDescription>{sessionDescription}</RecordDescription>
      </RecordMain>

      <RecordDetails>
        <RecordDetail>
          <RecordLabel>Status</RecordLabel>
          <RecordValue>
            <Badge $tone={getSessionStatusBadgeTone(session.status)}>
              {getSessionStatusLabel(session.status)}
            </Badge>
          </RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>IP</RecordLabel>
          <RecordValue>{getDisplayText(session.ipAddress)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Criada em</RecordLabel>
          <RecordValue>{formatDateTime(session.createdAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Último uso</RecordLabel>
          <RecordValue>{formatDateTime(session.lastUsedAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Revogada em</RecordLabel>
          <RecordValue>{formatDateTime(session.revokedAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>User agent</RecordLabel>
          <RecordValue>{getDisplayText(session.userAgent)}</RecordValue>
        </RecordDetail>
      </RecordDetails>
    </RecordCard>
  )
}

function UsersTab({
  currentPage,
  onNextPage,
  onPreviousPage,
  onRetry,
  state,
}: {
  currentPage: number
  onNextPage: () => void
  onPreviousPage: () => void
  onRetry: () => void
  state: ResourceState<ProjectUsersPageResponse>
}) {
  const users = state.data?.content ?? []
  const totalUsers = getPageTotal(state.data)
  const hasInitialLoading = state.isLoading && !state.data

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>Usuários</SectionTitle>
          {totalUsers !== undefined && (
            <SectionSubtitle>{formatNumber(totalUsers)} usuários encontrados</SectionSubtitle>
          )}
        </div>
      </TabHeader>

      {state.errorMessage ? (
        <ResourceError message={state.errorMessage} onRetry={onRetry} />
      ) : (
        <>
          <DataList aria-busy={state.isLoading}>
            {hasInitialLoading ? (
              <LoadingRecords />
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <UserRecord key={user.id ?? user.email ?? `user-${index}`} user={user} />
              ))
            ) : (
              <EmptyState>
                <SectionTitle>Nenhum usuário encontrado</SectionTitle>
                <EmptyDescription>
                  Quando usuários finais forem criados neste projeto, eles aparecerão aqui.
                </EmptyDescription>
              </EmptyState>
            )}
          </DataList>

          <PaginationControls
            currentPage={currentPage}
            isLoading={state.isLoading}
            itemLabelPlural="usuários"
            itemLabelSingular="usuário"
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            pageData={state.data}
          />
        </>
      )}
    </>
  )
}

function UserRecord({ user }: { user: ProjectUserResponse }) {
  return (
    <RecordCard>
      <RecordMain>
        <RecordTitle>{getUserTitle(user)}</RecordTitle>
        <RecordDescription>
          {user.id ? `Usuário ${user.id}` : 'Usuário sem identificação'}
        </RecordDescription>
      </RecordMain>

      <RecordDetails>
        <RecordDetail>
          <RecordLabel>Status</RecordLabel>
          <RecordValue>
            <Badge $tone={getUserStatusBadgeTone(user.status)}>
              {getUserStatusLabel(user.status)}
            </Badge>
          </RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Tentativas falhas</RecordLabel>
          <RecordValue>{formatOptionalNumber(user.failedLoginAttempts)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Último login</RecordLabel>
          <RecordValue>{formatDateTime(user.lastLoginAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Bloqueado até</RecordLabel>
          <RecordValue>{formatDateTime(user.lockedUntil)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Criado em</RecordLabel>
          <RecordValue>{formatDateTime(user.createdAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>IP do último login</RecordLabel>
          <RecordValue>{getDisplayText(user.lastLoginIpAddress)}</RecordValue>
        </RecordDetail>
      </RecordDetails>
    </RecordCard>
  )
}

function PasswordPolicyTab({
  onRetry,
  state,
}: {
  onRetry: () => void
  state: ResourceState<ProjectPasswordConfigResponse>
}) {
  const passwordConfigItems = useMemo(
    () => [
      {
        label: 'Tamanho mínimo',
        value: formatOptionalNumber(state.data?.minSize, 'caracteres'),
      },
      {
        label: 'Tamanho máximo',
        value: formatOptionalNumber(state.data?.maxSize, 'caracteres'),
      },
      {
        label: 'Número obrigatório',
        value: <BooleanBadge value={state.data?.numberRequired} />,
      },
      {
        label: 'Maiúscula obrigatória',
        value: <BooleanBadge value={state.data?.uppercaseRequired} />,
      },
      {
        label: 'Minúscula obrigatória',
        value: <BooleanBadge value={state.data?.lowercaseRequired} />,
      },
      {
        label: 'Caractere especial obrigatório',
        value: <BooleanBadge value={state.data?.specialCharRequired} />,
      },
      {
        label: 'Intervalo válido',
        value: <BooleanBadge value={state.data?.validRange} />,
      },
    ],
    [state.data],
  )

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>Política de Senha</SectionTitle>
          <SectionSubtitle>Password config do projeto</SectionSubtitle>
        </div>
      </TabHeader>

      {state.errorMessage ? (
        <ResourceError message={state.errorMessage} onRetry={onRetry} />
      ) : state.isLoading && !state.data ? (
        <LoadingConfigGrid />
      ) : state.data ? (
        <ConfigGrid>{passwordConfigItems.map(renderConfigItem)}</ConfigGrid>
      ) : (
        <EmptyState>
          <SectionTitle>Política de senha não encontrada</SectionTitle>
          <EmptyDescription>
            O endpoint não retornou configuração de senha para este projeto.
          </EmptyDescription>
        </EmptyState>
      )}
    </>
  )
}

function AuthPolicyTab({
  onRetry,
  state,
}: {
  onRetry: () => void
  state: ResourceState<ProjectAuthConfigResponse>
}) {
  const authConfigItems = useMemo(
    () => [
      {
        label: 'Expiração do access token',
        value: formatOptionalNumber(state.data?.accessTokenExpirationMinutes, 'minutos'),
      },
      {
        label: 'Expiração do refresh token',
        value: formatOptionalNumber(state.data?.refreshTokenExpirationDays, 'dias'),
      },
      {
        label: 'Modo de sessão',
        value: getSessionModeLabel(state.data?.sessionMode),
      },
      {
        label: 'Máximo de sessões ativas',
        value: formatOptionalNumber(state.data?.maxActiveSessions),
      },
      {
        label: 'Rotação de refresh token',
        value: <BooleanBadge value={state.data?.refreshTokenRotationEnabled} />,
      },
      {
        label: 'Revogar tokens ao trocar senha',
        value: <BooleanBadge value={state.data?.revokeTokensOnPasswordChange} />,
      },
      {
        label: 'Limite de falhas de login',
        value: formatOptionalNumber(state.data?.failedLoginAttemptsLimit),
      },
      {
        label: 'Duração do bloqueio',
        value: formatOptionalNumber(state.data?.lockDurationMinutes, 'minutos'),
      },
      {
        label: 'Verificação de e-mail obrigatória',
        value: <BooleanBadge value={state.data?.requireEmailVerification} />,
      },
      {
        label: 'Cadastro habilitado',
        value: <BooleanBadge value={state.data?.registrationEnabled} />,
      },
      {
        label: 'Máximo exigido no modo limitado',
        value: <BooleanBadge value={state.data?.maxActiveSessionsRequiredWhenLimited} />,
      },
    ],
    [state.data],
  )

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>Política de autenticação</SectionTitle>
          <SectionSubtitle>Auth config do projeto</SectionSubtitle>
        </div>
      </TabHeader>

      {state.errorMessage ? (
        <ResourceError message={state.errorMessage} onRetry={onRetry} />
      ) : state.isLoading && !state.data ? (
        <LoadingConfigGrid />
      ) : state.data ? (
        <ConfigGrid>{authConfigItems.map(renderConfigItem)}</ConfigGrid>
      ) : (
        <EmptyState>
          <SectionTitle>Política de autenticação não encontrada</SectionTitle>
          <EmptyDescription>
            O endpoint não retornou configuração de autenticação para este projeto.
          </EmptyDescription>
        </EmptyState>
      )}
    </>
  )
}

function ApiKeysTab({
  currentPage,
  onNextPage,
  onPreviousPage,
  onRetry,
  state,
}: {
  currentPage: number
  onNextPage: () => void
  onPreviousPage: () => void
  onRetry: () => void
  state: ResourceState<ProjectApiKeysPageResponse>
}) {
  const apiKeys = state.data?.content ?? []
  const totalApiKeys = getPageTotal(state.data)
  const hasInitialLoading = state.isLoading && !state.data

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>API Keys</SectionTitle>
          {totalApiKeys !== undefined && (
            <SectionSubtitle>{formatNumber(totalApiKeys)} API keys encontradas</SectionSubtitle>
          )}
        </div>
      </TabHeader>

      {state.errorMessage ? (
        <ResourceError message={state.errorMessage} onRetry={onRetry} />
      ) : (
        <>
          <DataList aria-busy={state.isLoading}>
            {hasInitialLoading ? (
              <LoadingRecords />
            ) : apiKeys.length > 0 ? (
              apiKeys.map((apiKey, index) => (
                <ApiKeyRecord
                  key={apiKey.id ?? apiKey.keyId ?? apiKey.name ?? `api-key-${index}`}
                  apiKey={apiKey}
                />
              ))
            ) : (
              <EmptyState>
                <SectionTitle>Nenhuma API key encontrada</SectionTitle>
                <EmptyDescription>
                  Quando API keys forem criadas para este projeto, elas aparecerão aqui.
                </EmptyDescription>
              </EmptyState>
            )}
          </DataList>

          <PaginationControls
            currentPage={currentPage}
            isLoading={state.isLoading}
            itemLabelPlural="API keys"
            itemLabelSingular="API key"
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            pageData={state.data}
          />
        </>
      )}
    </>
  )
}

function ApiKeyRecord({ apiKey }: { apiKey: ProjectApiKeyDetailsResponse }) {
  const scopes = apiKey.scopes ?? []

  return (
    <RecordCard>
      <RecordMain>
        <RecordTitle>{apiKey.name?.trim() || 'API key sem nome'}</RecordTitle>
        <RecordDescription>{getApiKeyPreview(apiKey)}</RecordDescription>
      </RecordMain>

      <RecordDetails>
        <RecordDetail>
          <RecordLabel>Revogação</RecordLabel>
          <RecordValue>
            <Badge $tone={apiKey.revokedAt ? 'danger' : 'success'}>
              {apiKey.revokedAt ? 'Revogada' : 'Não revogada'}
            </Badge>
          </RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Ambiente</RecordLabel>
          <RecordValue>{getDisplayText(apiKey.environment)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Escopos</RecordLabel>
          <RecordValue>
            {scopes.length > 0 ? (
              <InlineBadgeGroup>
                {scopes.map((scope) => (
                  <Badge key={scope} $tone="info">
                    {getScopeLabel(scope)}
                  </Badge>
                ))}
              </InlineBadgeGroup>
            ) : (
              'Não informado'
            )}
          </RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Criada por</RecordLabel>
          <RecordValue>{getAccountName(apiKey.createdByAccount)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Criada em</RecordLabel>
          <RecordValue>{formatDateTime(apiKey.createdAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Último uso</RecordLabel>
          <RecordValue>{formatDateTime(apiKey.lastUsedAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Expira em</RecordLabel>
          <RecordValue>{formatDateTime(apiKey.expiresAt)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Revogada em</RecordLabel>
          <RecordValue>{formatDateTime(apiKey.revokedAt)}</RecordValue>
        </RecordDetail>
      </RecordDetails>
    </RecordCard>
  )
}

function renderConfigItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <ConfigItem key={label}>
      <ConfigLabel>{label}</ConfigLabel>
      <ConfigValue>{value}</ConfigValue>
    </ConfigItem>
  )
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailsTab>('sessions')
  const [projectState, setProjectState] = useState<ResourceState<ProjectResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const [sessionsPage, setSessionsPage] = useState(0)
  const [usersPage, setUsersPage] = useState(0)
  const [apiKeysPage, setApiKeysPage] = useState(0)
  const [sessionsState, setSessionsState] = useState<
    ResourceState<ProjectUserSessionsPageResponse>
  >({
    data: null,
    isLoading: false,
    errorMessage: null,
  })
  const [usersState, setUsersState] = useState<ResourceState<ProjectUsersPageResponse>>({
    data: null,
    isLoading: false,
    errorMessage: null,
  })
  const [passwordConfigState, setPasswordConfigState] = useState<
    ResourceState<ProjectPasswordConfigResponse>
  >({
    data: null,
    isLoading: false,
    errorMessage: null,
  })
  const [authConfigState, setAuthConfigState] = useState<ResourceState<ProjectAuthConfigResponse>>({
    data: null,
    isLoading: false,
    errorMessage: null,
  })
  const [apiKeysState, setApiKeysState] = useState<ResourceState<ProjectApiKeysPageResponse>>({
    data: null,
    isLoading: false,
    errorMessage: null,
  })
  const projectRequestIdRef = useRef(0)
  const sessionsRequestIdRef = useRef(0)
  const usersRequestIdRef = useRef(0)
  const passwordConfigRequestIdRef = useRef(0)
  const authConfigRequestIdRef = useRef(0)
  const apiKeysRequestIdRef = useRef(0)
  const project = projectState.data
  const projectTitle =
    projectState.isLoading && !project
      ? 'Carregando projeto'
      : project?.name?.trim() || 'Projeto sem nome'
  const projectSubtitle =
    projectState.isLoading && !project
      ? 'Buscando dados básicos do projeto.'
      : project?.description?.trim() || 'Sem descrição.'
  const activeTabItem =
    projectDetailsTabs.find((tabItem) => tabItem.key === activeTab) ?? projectDetailsTabs[0]

  const loadProject = useCallback(async () => {
    const requestId = projectRequestIdRef.current + 1

    projectRequestIdRef.current = requestId
    setProjectState((currentState) => ({
      ...currentState,
      isLoading: true,
      errorMessage: null,
    }))

    const { data, errorMessage } = await fetchResource(
      () => getProjectById(projectId),
      defaultProjectErrorMessage,
    )

    if (projectRequestIdRef.current === requestId) {
      setProjectState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId])

  const loadSessions = useCallback(
    async (pageToLoad: number) => {
      const requestId = sessionsRequestIdRef.current + 1

      sessionsRequestIdRef.current = requestId
      setSessionsState({
        data: null,
        isLoading: true,
        errorMessage: null,
      })

      const { data, errorMessage } = await fetchResource(
        () =>
          getProjectSessions({
            projectId,
            page: pageToLoad,
            size: projectResourcePageSize,
          }),
        defaultSessionsErrorMessage,
      )

      if (sessionsRequestIdRef.current === requestId) {
        setSessionsState({
          data,
          isLoading: false,
          errorMessage,
        })
      }
    },
    [projectId],
  )

  const loadUsers = useCallback(
    async (pageToLoad: number) => {
      const requestId = usersRequestIdRef.current + 1

      usersRequestIdRef.current = requestId
      setUsersState({
        data: null,
        isLoading: true,
        errorMessage: null,
      })

      const { data, errorMessage } = await fetchResource(
        () =>
          getProjectUsers({
            projectId,
            page: pageToLoad,
            size: projectResourcePageSize,
          }),
        defaultUsersErrorMessage,
      )

      if (usersRequestIdRef.current === requestId) {
        setUsersState({
          data,
          isLoading: false,
          errorMessage,
        })
      }
    },
    [projectId],
  )

  const loadPasswordConfig = useCallback(async () => {
    const requestId = passwordConfigRequestIdRef.current + 1

    passwordConfigRequestIdRef.current = requestId
    setPasswordConfigState({
      data: null,
      isLoading: true,
      errorMessage: null,
    })

    const { data, errorMessage } = await fetchResource(
      () => getProjectPasswordConfig(projectId),
      defaultPasswordConfigErrorMessage,
    )

    if (passwordConfigRequestIdRef.current === requestId) {
      setPasswordConfigState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId])

  const loadAuthConfig = useCallback(async () => {
    const requestId = authConfigRequestIdRef.current + 1

    authConfigRequestIdRef.current = requestId
    setAuthConfigState({
      data: null,
      isLoading: true,
      errorMessage: null,
    })

    const { data, errorMessage } = await fetchResource(
      () => getProjectAuthConfig(projectId),
      defaultAuthConfigErrorMessage,
    )

    if (authConfigRequestIdRef.current === requestId) {
      setAuthConfigState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId])

  const loadApiKeys = useCallback(
    async (pageToLoad: number) => {
      const requestId = apiKeysRequestIdRef.current + 1

      apiKeysRequestIdRef.current = requestId
      setApiKeysState({
        data: null,
        isLoading: true,
        errorMessage: null,
      })

      const { data, errorMessage } = await fetchResource(
        () =>
          getProjectApiKeys({
            projectId,
            page: pageToLoad,
            size: projectResourcePageSize,
          }),
        defaultApiKeysErrorMessage,
      )

      if (apiKeysRequestIdRef.current === requestId) {
        setApiKeysState({
          data,
          isLoading: false,
          errorMessage,
        })
      }
    },
    [projectId],
  )

  useEffect(() => {
    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadProject()
      }
    })

    return () => {
      shouldLoad = false
      projectRequestIdRef.current += 1
    }
  }, [loadProject])

  useEffect(() => {
    if (activeTab !== 'sessions' || projectState.errorMessage) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadSessions(sessionsPage)
      }
    })

    return () => {
      shouldLoad = false
      sessionsRequestIdRef.current += 1
    }
  }, [activeTab, loadSessions, projectState.errorMessage, sessionsPage])

  useEffect(() => {
    if (activeTab !== 'users' || projectState.errorMessage) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadUsers(usersPage)
      }
    })

    return () => {
      shouldLoad = false
      usersRequestIdRef.current += 1
    }
  }, [activeTab, loadUsers, projectState.errorMessage, usersPage])

  useEffect(() => {
    if (activeTab !== 'password-policy' || projectState.errorMessage) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadPasswordConfig()
      }
    })

    return () => {
      shouldLoad = false
      passwordConfigRequestIdRef.current += 1
    }
  }, [activeTab, loadPasswordConfig, projectState.errorMessage])

  useEffect(() => {
    if (activeTab !== 'auth-policy' || projectState.errorMessage) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadAuthConfig()
      }
    })

    return () => {
      shouldLoad = false
      authConfigRequestIdRef.current += 1
    }
  }, [activeTab, loadAuthConfig, projectState.errorMessage])

  useEffect(() => {
    if (activeTab !== 'api-keys' || projectState.errorMessage) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadApiKeys(apiKeysPage)
      }
    })

    return () => {
      shouldLoad = false
      apiKeysRequestIdRef.current += 1
    }
  }, [activeTab, apiKeysPage, loadApiKeys, projectState.errorMessage])

  function goToPreviousSessionsPage() {
    setSessionsPage((currentPage) => Math.max(currentPage - 1, 0))
  }

  function goToNextSessionsPage() {
    setSessionsPage((currentPage) => currentPage + 1)
  }

  function goToPreviousUsersPage() {
    setUsersPage((currentPage) => Math.max(currentPage - 1, 0))
  }

  function goToNextUsersPage() {
    setUsersPage((currentPage) => currentPage + 1)
  }

  function goToPreviousApiKeysPage() {
    setApiKeysPage((currentPage) => Math.max(currentPage - 1, 0))
  }

  function goToNextApiKeysPage() {
    setApiKeysPage((currentPage) => currentPage + 1)
  }

  function renderActiveTab() {
    if (activeTab === 'sessions') {
      return (
        <SessionsTab
          currentPage={sessionsPage}
          onNextPage={goToNextSessionsPage}
          onPreviousPage={goToPreviousSessionsPage}
          onRetry={() => loadSessions(sessionsPage)}
          state={sessionsState}
        />
      )
    }

    if (activeTab === 'users') {
      return (
        <UsersTab
          currentPage={usersPage}
          onNextPage={goToNextUsersPage}
          onPreviousPage={goToPreviousUsersPage}
          onRetry={() => loadUsers(usersPage)}
          state={usersState}
        />
      )
    }

    if (activeTab === 'password-policy') {
      return <PasswordPolicyTab onRetry={loadPasswordConfig} state={passwordConfigState} />
    }

    if (activeTab === 'auth-policy') {
      return <AuthPolicyTab onRetry={loadAuthConfig} state={authConfigState} />
    }

    return (
      <ApiKeysTab
        currentPage={apiKeysPage}
        onNextPage={goToNextApiKeysPage}
        onPreviousPage={goToPreviousApiKeysPage}
        onRetry={() => loadApiKeys(apiKeysPage)}
        state={apiKeysState}
      />
    )
  }

  return (
    <ProjectDetailsRoot>
      <ProjectDetailsHeader>
        <HeaderContent>
          <HeaderEyebrow>Projeto</HeaderEyebrow>
          <HeaderTitle>{projectTitle}</HeaderTitle>
          <HeaderSubtitle>{projectSubtitle}</HeaderSubtitle>
        </HeaderContent>

        <HeaderActions>
          <BackLink href="/projetos">
            <ArrowLeft size={16} />
            Projetos
          </BackLink>
          <HeaderButton type="button" size="lg" variant="outline" onClick={loadProject}>
            <RefreshCcw size={16} />
            Atualizar
          </HeaderButton>
        </HeaderActions>
      </ProjectDetailsHeader>

      {projectState.errorMessage ? (
        <ResourceError message={projectState.errorMessage} onRetry={loadProject} />
      ) : (
        <>
          <ProjectOverviewDetails
            isLoading={projectState.isLoading}
            project={project}
            projectId={projectId}
          />

          <TabsSection>
            <TabList role="tablist" aria-label="Dados do projeto">
              {projectDetailsTabs.map(({ icon: Icon, key, label }) => {
                const isActive = activeTab === key

                return (
                  <TabButton
                    key={key}
                    id={`project-tab-${key}`}
                    type="button"
                    $active={isActive}
                    role="tab"
                    aria-controls={`project-tab-panel-${key}`}
                    aria-selected={isActive}
                    onClick={() => setActiveTab(key)}
                  >
                    <Icon size={16} />
                    {label}
                  </TabButton>
                )
              })}
            </TabList>

            <TabPanel
              id={`project-tab-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`project-tab-${activeTabItem.key}`}
            >
              {renderActiveTab()}
            </TabPanel>
          </TabsSection>
        </>
      )}
    </ProjectDetailsRoot>
  )
}
