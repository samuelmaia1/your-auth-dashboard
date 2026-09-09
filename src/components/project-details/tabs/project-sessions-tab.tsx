'use client'

import { Ban, LoaderCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import {
  getProjectSessions,
  revokeAllProjectUserSessions,
  revokeProjectUserSession,
} from '@/services/project.service'
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
  getProjectErrorMessage,
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
  ErrorMessage,
  RecordActionButton,
  RecordActions,
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
const defaultRevokeSessionErrorMessage =
  'Não foi possível revogar a sessão. Tente novamente em alguns instantes.'

type SessionRecordProps = {
  isRevoking: boolean
  onRequestRevoke: (session: ProjectUserSessionResponse) => void
  session: ProjectUserSessionResponse
}

type RevokeSessionMode = 'single' | 'all'

function SessionRecord({ isRevoking, onRequestRevoke, session }: SessionRecordProps) {
  const sessionDescription =
    joinDetails([getTrimmedText(session.deviceName), session.id ? `Sessão ${session.id}` : null]) ||
    'Sessão sem identificação'
  const canRevokeSession = Boolean(session.id && session.userId && session.status === 'ACTIVE')

  return (
    <RecordCard>
      <RecordMain>
        <RecordTitle>{getUserTitle(session.user, session.userId)}</RecordTitle>
        <RecordDescription>{sessionDescription}</RecordDescription>
        <RecordActions>
          <RecordActionButton
            type="button"
            size="sm"
            variant="destructive"
            disabled={!canRevokeSession || isRevoking}
            onClick={() => onRequestRevoke(session)}
          >
            <Ban size={16} />
            Revogar sessão
          </RecordActionButton>
        </RecordActions>
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
  const [sessionPendingRevoke, setSessionPendingRevoke] =
    useState<ProjectUserSessionResponse | null>(null)
  const [revokeErrorMessage, setRevokeErrorMessage] = useState<string | null>(null)
  const [isRevokingSession, setIsRevokingSession] = useState(false)
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

  function handleRequestRevoke(session: ProjectUserSessionResponse) {
    setRevokeErrorMessage(null)
    setSessionPendingRevoke(session)
  }

  async function handleRevokeSession(mode: RevokeSessionMode) {
    if (!sessionPendingRevoke) {
      return
    }

    const sessionId = sessionPendingRevoke.id?.trim()
    const userId = sessionPendingRevoke.userId?.trim()

    if (!userId || (mode === 'single' && !sessionId)) {
      setRevokeErrorMessage('A sessão não retornou os identificadores necessários para revogar.')
      return
    }

    setIsRevokingSession(true)
    setRevokeErrorMessage(null)

    try {
      if (mode === 'single') {
        await revokeProjectUserSession({
          projectId,
          sessionId: sessionId as string,
          userId,
        })
      } else {
        await revokeAllProjectUserSessions({
          projectId,
          userId,
        })
      }

      setSessionPendingRevoke(null)
      await loadSessions(page)
    } catch (error: unknown) {
      setRevokeErrorMessage(getProjectErrorMessage(error, defaultRevokeSessionErrorMessage))
    } finally {
      setIsRevokingSession(false)
    }
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
                  isRevoking={isRevokingSession}
                  onRequestRevoke={handleRequestRevoke}
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

          <AlertDialog
            open={Boolean(sessionPendingRevoke)}
            onOpenChange={(open) => {
              if (!open && !isRevokingSession) {
                setSessionPendingRevoke(null)
                setRevokeErrorMessage(null)
              }
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Revogar sessão</AlertDialogTitle>
              <AlertDialogDescription>
                {sessionPendingRevoke
                  ? `Escolha como revogar as sessões de ${getUserTitle(
                      sessionPendingRevoke.user,
                      sessionPendingRevoke.userId,
                    )}.`
                  : 'Escolha como revogar as sessões deste usuário.'}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {revokeErrorMessage && <ErrorMessage role="alert">{revokeErrorMessage}</ErrorMessage>}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRevokingSession}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isRevokingSession}
                onClick={() => {
                  void handleRevokeSession('single')
                }}
              >
                {isRevokingSession ? <LoaderCircle size={16} /> : <Ban size={16} />}
                Revogar esta
              </AlertDialogAction>
              <AlertDialogAction
                variant="destructive"
                disabled={isRevokingSession}
                onClick={() => {
                  void handleRevokeSession('all')
                }}
              >
                {isRevokingSession ? <LoaderCircle size={16} /> : <Ban size={16} />}
                Revogar todas
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialog>
        </>
      )}
    </>
  )
}
