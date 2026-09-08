'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjectMembers } from '@/services/project.service'
import type { ProjectMemberResponse, ProjectMembersPageResponse } from '@/types/project-types'

import {
  fetchResource,
  formatDateTime,
  formatNumber,
  getDisplayText,
  getMemberRoleBadgeTone,
  getMemberRoleLabel,
  getPageTotal,
  getTrimmedText,
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

type ProjectMembersTabProps = {
  isActive: boolean
  projectId: string
}

const defaultMembersErrorMessage =
  'Não foi possível carregar os membros do projeto. Tente novamente em alguns instantes.'

function getMemberName(member: ProjectMemberResponse) {
  const fullName = [member.name, member.lastName]
    .map((namePart) => namePart?.trim())
    .filter(Boolean)
    .join(' ')

  return getTrimmedText(fullName) ?? 'Membro sem nome'
}

function MemberRecord({ member }: { member: ProjectMemberResponse }) {
  return (
    <RecordCard>
      <RecordMain>
        <RecordTitle>{getMemberName(member)}</RecordTitle>
        <RecordDescription>{getMemberRoleLabel(member.role)}</RecordDescription>
      </RecordMain>

      <RecordDetails>
        <RecordDetail>
          <RecordLabel>Papel</RecordLabel>
          <RecordValue>
            <Badge $tone={getMemberRoleBadgeTone(member.role)}>
              {getMemberRoleLabel(member.role)}
            </Badge>
          </RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Nome</RecordLabel>
          <RecordValue>{getDisplayText(member.name)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Sobrenome</RecordLabel>
          <RecordValue>{getDisplayText(member.lastName)}</RecordValue>
        </RecordDetail>
        <RecordDetail>
          <RecordLabel>Entrou em</RecordLabel>
          <RecordValue>{formatDateTime(member.joinedAt)}</RecordValue>
        </RecordDetail>
      </RecordDetails>
    </RecordCard>
  )
}

export function ProjectMembersTab({ isActive, projectId }: ProjectMembersTabProps) {
  const [page, setPage] = useState(0)
  const [membersState, setMembersState] = useState<ResourceState<ProjectMembersPageResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const membersRequestIdRef = useRef(0)
  const members = membersState.data?.content ?? []
  const totalMembers = getPageTotal(membersState.data)
  const hasInitialLoading = membersState.isLoading && !membersState.data

  const loadMembers = useCallback(
    async (pageToLoad: number) => {
      const requestId = membersRequestIdRef.current + 1

      membersRequestIdRef.current = requestId
      setMembersState({
        data: null,
        isLoading: true,
        errorMessage: null,
      })

      const { data, errorMessage } = await fetchResource(
        () =>
          getProjectMembers({
            projectId,
            page: pageToLoad,
            size: projectResourcePageSize,
          }),
        defaultMembersErrorMessage,
      )

      if (membersRequestIdRef.current === requestId) {
        setMembersState({
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
      if (shouldLoad && isActive) {
        void loadMembers(page)
      }
    })

    return () => {
      shouldLoad = false
      membersRequestIdRef.current += 1
    }
  }, [isActive, loadMembers, page])

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
          <SectionTitle>Membros</SectionTitle>
          {totalMembers !== undefined && (
            <SectionSubtitle>{formatNumber(totalMembers)} membros encontrados</SectionSubtitle>
          )}
        </div>
      </TabHeader>

      {membersState.errorMessage ? (
        <ResourceError
          message={membersState.errorMessage}
          onRetry={() => {
            void loadMembers(page)
          }}
        />
      ) : (
        <>
          <DataList aria-busy={membersState.isLoading}>
            {hasInitialLoading ? (
              <LoadingRecords />
            ) : members.length > 0 ? (
              members.map((member, index) => (
                <MemberRecord
                  key={`${member.name ?? 'member'}-${member.lastName ?? 'record'}-${
                    member.joinedAt ?? index
                  }-${index}`}
                  member={member}
                />
              ))
            ) : (
              <EmptyState>
                <SectionTitle>Nenhum membro encontrado</SectionTitle>
                <EmptyDescription>
                  Quando contas forem adicionadas a este projeto, elas aparecerão aqui.
                </EmptyDescription>
              </EmptyState>
            )}
          </DataList>

          <PaginationControls
            currentPage={page}
            isLoading={membersState.isLoading}
            itemLabelPlural="membros"
            itemLabelSingular="membro"
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            pageData={membersState.data}
          />
        </>
      )}
    </>
  )
}
