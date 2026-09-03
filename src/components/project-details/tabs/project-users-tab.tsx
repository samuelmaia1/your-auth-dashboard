'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjectUsers } from '@/services/project.service'
import type { ProjectUserResponse, ProjectUsersPageResponse } from '@/types/project-types'

import {
  fetchResource,
  formatDateTime,
  formatNumber,
  formatOptionalNumber,
  getDisplayText,
  getPageTotal,
  getUserStatusBadgeTone,
  getUserStatusLabel,
  getUserTitle,
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

type ProjectUsersTabProps = {
  isActive: boolean
  projectId: string
}

const defaultUsersErrorMessage =
  'Não foi possível carregar os usuários do projeto. Tente novamente em alguns instantes.'

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

export function ProjectUsersTab({ isActive, projectId }: ProjectUsersTabProps) {
  const [page, setPage] = useState(0)
  const [usersState, setUsersState] = useState<ResourceState<ProjectUsersPageResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const usersRequestIdRef = useRef(0)
  const users = usersState.data?.content ?? []
  const totalUsers = getPageTotal(usersState.data)
  const hasInitialLoading = usersState.isLoading && !usersState.data

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

  useEffect(() => {
    if (!isActive) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadUsers(page)
      }
    })

    return () => {
      shouldLoad = false
      usersRequestIdRef.current += 1
    }
  }, [isActive, loadUsers, page])

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
          <SectionTitle>Usuários</SectionTitle>
          {totalUsers !== undefined && (
            <SectionSubtitle>{formatNumber(totalUsers)} usuários encontrados</SectionSubtitle>
          )}
        </div>
      </TabHeader>

      {usersState.errorMessage ? (
        <ResourceError
          message={usersState.errorMessage}
          onRetry={() => {
            void loadUsers(page)
          }}
        />
      ) : (
        <>
          <DataList aria-busy={usersState.isLoading}>
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
            currentPage={page}
            isLoading={usersState.isLoading}
            itemLabelPlural="usuários"
            itemLabelSingular="usuário"
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            pageData={usersState.data}
          />
        </>
      )}
    </>
  )
}
