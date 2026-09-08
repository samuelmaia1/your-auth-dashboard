import { ChevronLeft, ChevronRight, RefreshCcw, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { isProjectsServiceError } from '@/services/project.service'
import type { ProjectEnvironment, ProjectStatus } from '@/types/account-types'
import type { ApiPageResponse } from '@/types/api-response-types'
import type {
  AccountBasicResponse,
  ProjectApiKeyDetailsResponse,
  ProjectApiKeyScope,
  ProjectSessionMode,
  ProjectUserResponse,
  ProjectUserSessionStatus,
  ProjectUserStatus,
} from '@/types/project-types'

import {
  Badge,
  BadgeGroup,
  ConfigGrid,
  ConfigItem,
  ConfigLabel,
  ConfigValue,
  DetailItem,
  DetailsGrid,
  ErrorActions,
  ErrorMessage,
  LoadingBlock,
  OverviewTop,
  PageIndicator,
  PaginationActions,
  PaginationBar,
  PaginationButton,
  PaginationSummary,
  ProjectDescription,
  ProjectOverview,
  RecordCard,
  RecordDetail,
  RecordDetails,
  RecordMain,
  RetryButton,
} from './style'

export type BadgeTone = 'success' | 'danger' | 'neutral' | 'info'

export type ProjectDetailsTab =
  'sessions' | 'users' | 'password-policy' | 'auth-policy' | 'api-keys'

export type ResourceState<TData> = {
  data: TData | null
  isLoading: boolean
  errorMessage: string | null
}

export type ProjectDetailsTabItem = {
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

export const projectResourcePageSize = 20

const numberFormatter = new Intl.NumberFormat('pt-BR')
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
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

export function formatNumber(value?: number | null) {
  return numberFormatter.format(value ?? 0)
}

export function formatOptionalNumber(value?: number | null, suffix?: string) {
  if (value === undefined || value === null) {
    return 'Não informado'
  }

  const formattedValue = formatNumber(value)

  return suffix ? `${formattedValue} ${suffix}` : formattedValue
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Não informado'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Não informado'
  }

  return dateTimeFormatter.format(date)
}

export function getDateFilterBoundary(value: string, boundary: 'start' | 'end') {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const date = new Date(
    year,
    month - 1,
    day,
    boundary === 'start' ? 0 : 23,
    boundary === 'start' ? 0 : 59,
    boundary === 'start' ? 0 : 59,
    boundary === 'start' ? 0 : 999,
  )

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }

  return date.toISOString()
}

export function getTrimmedText(value?: string | null) {
  return value?.trim() || null
}

export function getDisplayText(value?: string | null) {
  return getTrimmedText(value) ?? 'Não informado'
}

export function joinDetails(parts: Array<string | null | undefined>) {
  return parts.filter((part): part is string => Boolean(part?.trim())).join(' - ')
}

export function getProjectStatusLabel(status?: ProjectStatus) {
  return status ? (projectStatusLabels[status] ?? status) : 'Status não informado'
}

export function getProjectEnvironmentLabel(environment?: ProjectEnvironment) {
  return environment
    ? (projectEnvironmentLabels[environment] ?? environment)
    : 'Ambiente não informado'
}

export function getProjectStatusBadgeTone(status?: ProjectStatus): BadgeTone {
  return status ? (projectStatusBadgeTones[status] ?? 'neutral') : 'neutral'
}

export function getUserStatusLabel(status?: ProjectUserStatus) {
  return status ? (projectUserStatusLabels[status] ?? status) : 'Status não informado'
}

export function getUserStatusBadgeTone(status?: ProjectUserStatus): BadgeTone {
  return status ? (projectUserStatusBadgeTones[status] ?? 'neutral') : 'neutral'
}

export function getSessionStatusLabel(status?: ProjectUserSessionStatus) {
  return status ? (projectUserSessionStatusLabels[status] ?? status) : 'Status não informado'
}

export function getSessionStatusBadgeTone(status?: ProjectUserSessionStatus): BadgeTone {
  return status ? (projectUserSessionStatusBadgeTones[status] ?? 'neutral') : 'neutral'
}

export function getSessionModeLabel(sessionMode?: ProjectSessionMode) {
  return sessionMode ? (projectSessionModeLabels[sessionMode] ?? sessionMode) : 'Modo não informado'
}

export function getScopeLabel(scope: ProjectApiKeyScope) {
  return apiKeyScopeLabels[scope] ?? scope
}

export function getBooleanLabel(value?: boolean | null) {
  if (value === undefined || value === null) {
    return 'Não informado'
  }

  return value ? 'Sim' : 'Não'
}

export function getBooleanBadgeTone(value?: boolean | null): BadgeTone {
  if (value === undefined || value === null) {
    return 'info'
  }

  return value ? 'success' : 'neutral'
}

export function getProjectErrorMessage(error: unknown, fallbackMessage: string) {
  if (isProjectsServiceError(error)) {
    return error.response.message ?? fallbackMessage
  }

  return fallbackMessage
}

export async function fetchResource<TData>(request: () => Promise<TData>, fallbackMessage: string) {
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

export function getPageTotal<TData>(pageData: ApiPageResponse<TData> | null) {
  return pageData?.totalElements
}

export function getUserTitle(user?: ProjectUserResponse, fallbackUserId?: string) {
  return (
    getTrimmedText(user?.email) ??
    getTrimmedText(user?.id) ??
    getTrimmedText(fallbackUserId) ??
    'Usuário não informado'
  )
}

export function getAccountName(account?: AccountBasicResponse) {
  const fullName = [account?.name, account?.lastName]
    .map((namePart) => namePart?.trim())
    .filter(Boolean)
    .join(' ')

  return (
    getTrimmedText(fullName) ??
    getTrimmedText(account?.email) ??
    getTrimmedText(account?.id) ??
    'Não informado'
  )
}

export function getApiKeyPreview(apiKey: ProjectApiKeyDetailsResponse) {
  const prefix = getTrimmedText(apiKey.prefix)
  const secretLastFour = getTrimmedText(apiKey.secretLastFour)

  if (prefix && secretLastFour) {
    return `${prefix}...${secretLastFour}`
  }

  return prefix ?? getTrimmedText(apiKey.keyId) ?? 'Chave sem identificador'
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

export function BooleanBadge({ value }: { value?: boolean | null }) {
  return <Badge $tone={getBooleanBadgeTone(value)}>{getBooleanLabel(value)}</Badge>
}

export function ResourceError({ message, onRetry }: { message: string; onRetry: () => void }) {
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

export function LoadingOverview() {
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

export function LoadingRecords() {
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

export function LoadingConfigGrid() {
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

export function PaginationControls<TData>({
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

export function renderConfigItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <ConfigItem key={label}>
      <ConfigLabel>{label}</ConfigLabel>
      <ConfigValue>{value}</ConfigValue>
    </ConfigItem>
  )
}
