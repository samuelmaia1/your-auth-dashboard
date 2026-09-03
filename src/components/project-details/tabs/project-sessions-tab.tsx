'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjectSessions } from '@/services/project.service'
import type {
  ProjectUserSessionResponse,
  ProjectUserSessionsPageResponse,
} from '@/types/project-types'

import {
  fetchResource,
  formatDateTime,
  formatNumber,
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
  const [sessionsState, setSessionsState] = useState<
    ResourceState<ProjectUserSessionsPageResponse>
  >({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const sessionsRequestIdRef = useRef(0)
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

  useEffect(() => {
    if (!isActive) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadSessions(page)
      }
    })

    return () => {
      shouldLoad = false
      sessionsRequestIdRef.current += 1
    }
  }, [isActive, loadSessions, page])

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
