'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { getProjectSessions } from '@/services/project.service'
import type {
  ProjectUserSessionResponse,
  ProjectUserSessionStatus,
  ProjectUserSessionsPageResponse,
} from '@/types/project-types'

import {
  fetchResource,
  formatDateTime,
  formatNumber,
  getDateFilterBoundary,
  getDisplayText,
  getPageTotal,
  getSessionStatusBadgeTone,
  getSessionStatusLabel,
  getTrimmedText,
  getUserTitle,
  joinDetails,
  LoadingRecords,
  PaginationControls,
  projectResourcePageSize,
  ResourceError,
  type ResourceState,
} from '../project-details.shared'
import {
  Badge,
  DataList,
  EmptyDescription,
  EmptyState,
  FilterField,
  FilterInput,
  FilterLabel,
  FiltersGrid,
  FilterSelect,
  RecordCard,
  RecordDescription,
  RecordDetail,
  RecordDetails,
  RecordLabel,
  RecordMain,
  RecordTitle,
  RecordValue,
  SectionSubtitle,
  SectionTitle,
  TabHeader,
} from '../style'

type ProjectSessionsTabProps = {
  isActive: boolean
  projectId: string
}

const defaultSessionsErrorMessage =
  'Não foi possível carregar as sessões do projeto. Tente novamente em alguns instantes.'

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

export function ProjectSessionsTab({ isActive, projectId }: ProjectSessionsTabProps) {
  const [page, setPage] = useState(0)
  const [sessionStatus, setSessionStatus] = useState<ProjectUserSessionStatus | ''>('')
  const [lastUsedAtFromDate, setLastUsedAtFromDate] = useState('')
  const [lastUsedAtToDate, setLastUsedAtToDate] = useState('')
  const [sessionUserEmail, setSessionUserEmail] = useState('')
  const debouncedSessionUserEmail = useDebouncedValue(sessionUserEmail, 200)
  const [sessionsState, setSessionsState] = useState<
    ResourceState<ProjectUserSessionsPageResponse>
  >({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const sessionsRequestIdRef = useRef(0)
  const lastUsedAtFrom = getDateFilterBoundary(lastUsedAtFromDate, 'start')
  const lastUsedAtTo = getDateFilterBoundary(lastUsedAtToDate, 'end')
  const sessionUserEmailFilter = debouncedSessionUserEmail.trim()
  const isSessionUserEmailDebouncing = sessionUserEmail !== debouncedSessionUserEmail
  const sessions = sessionsState.data?.content ?? []
  const totalSessions = getPageTotal(sessionsState.data)
  const hasInitialLoading = sessionsState.isLoading && !sessionsState.data

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
            lastUsedAtFrom,
            lastUsedAtTo,
            projectId,
            page: pageToLoad,
            size: projectResourcePageSize,
            status: sessionStatus || undefined,
            userEmail: sessionUserEmailFilter || undefined,
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
    [lastUsedAtFrom, lastUsedAtTo, projectId, sessionStatus, sessionUserEmailFilter],
  )

  useEffect(() => {
    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad && isActive && !isSessionUserEmailDebouncing) {
        void loadSessions(page)
      }
    })

    return () => {
      shouldLoad = false
      sessionsRequestIdRef.current += 1
    }
  }, [isActive, isSessionUserEmailDebouncing, loadSessions, page])

  function updateSessionStatus(value: ProjectUserSessionStatus | '') {
    setSessionStatus(value)
    setPage(0)
  }

  function updateLastUsedAtFromDate(value: string) {
    setLastUsedAtFromDate(value)
    setPage(0)
  }

  function updateLastUsedAtToDate(value: string) {
    setLastUsedAtToDate(value)
    setPage(0)
  }

  function updateSessionUserEmail(value: string) {
    setSessionUserEmail(value)
    setPage(0)
  }

  function goToPreviousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 0))
  }

  function goToNextPage() {
    setPage((currentPage) => currentPage + 1)
  }

  if (!isActive) {
    return null
  }

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

      <FiltersGrid>
        <FilterField>
          <FilterLabel>Status</FilterLabel>
          <FilterSelect
            aria-label="Filtrar sessões por status"
            value={sessionStatus}
            onChange={(event) =>
              updateSessionStatus(event.target.value as ProjectUserSessionStatus | '')
            }
          >
            <option value="">Todas</option>
            <option value="ACTIVE">Ativas</option>
            <option value="INACTIVE">Inativas</option>
          </FilterSelect>
        </FilterField>

        <FilterField>
          <FilterLabel>Último uso de</FilterLabel>
          <FilterInput
            aria-label="Filtrar sessões com último uso a partir de"
            max={lastUsedAtToDate || undefined}
            type="date"
            value={lastUsedAtFromDate}
            onChange={(event) => updateLastUsedAtFromDate(event.target.value)}
          />
        </FilterField>

        <FilterField>
          <FilterLabel>Último uso até</FilterLabel>
          <FilterInput
            aria-label="Filtrar sessões com último uso até"
            min={lastUsedAtFromDate || undefined}
            type="date"
            value={lastUsedAtToDate}
            onChange={(event) => updateLastUsedAtToDate(event.target.value)}
          />
        </FilterField>

        <FilterField>
          <FilterLabel>Email do usuário</FilterLabel>
          <FilterInput
            aria-label="Buscar sessões pelo email do usuário"
            autoComplete="off"
            inputMode="email"
            placeholder="Buscar por email"
            type="search"
            value={sessionUserEmail}
            onChange={(event) => updateSessionUserEmail(event.target.value)}
          />
        </FilterField>
      </FiltersGrid>

      {sessionsState.errorMessage ? (
        <ResourceError
          message={sessionsState.errorMessage}
          onRetry={() => {
            void loadSessions(page)
          }}
        />
      ) : (
        <>
          <DataList aria-busy={sessionsState.isLoading}>
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
            currentPage={page}
            isLoading={sessionsState.isLoading}
            itemLabelPlural="sessões"
            itemLabelSingular="sessão"
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            pageData={sessionsState.data}
          />
        </>
      )}
    </>
  )
}
