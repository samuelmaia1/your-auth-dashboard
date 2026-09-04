'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { getProjectApiKeys } from '@/services/project.service'
import type {
  ProjectApiKeyDetailsResponse,
  ProjectApiKeysPageResponse,
} from '@/types/project-types'

import {
  fetchResource,
  formatDateTime,
  formatNumber,
  getAccountName,
  getApiKeyPreview,
  getDisplayText,
  getPageTotal,
  getScopeLabel,
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
  InlineBadgeGroup,
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

type ProjectApiKeysTabProps = {
  isActive: boolean
  projectId: string
}

const defaultApiKeysErrorMessage =
  'Não foi possível carregar as API keys do projeto. Tente novamente em alguns instantes.'

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

export function ProjectApiKeysTab({ isActive, projectId }: ProjectApiKeysTabProps) {
  const [page, setPage] = useState(0)
  const [createdBy, setCreatedBy] = useState('')
  const debouncedCreatedBy = useDebouncedValue(createdBy, 200)
  const [apiKeysState, setApiKeysState] = useState<ResourceState<ProjectApiKeysPageResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const apiKeysRequestIdRef = useRef(0)
  const createdByFilter = debouncedCreatedBy.trim()
  const isCreatedByDebouncing = createdBy !== debouncedCreatedBy
  const apiKeys = apiKeysState.data?.content ?? []
  const totalApiKeys = getPageTotal(apiKeysState.data)
  const hasInitialLoading = apiKeysState.isLoading && !apiKeysState.data

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
            createdBy: createdByFilter || undefined,
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
    [createdByFilter, projectId],
  )

  useEffect(() => {
    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad && isActive && !isCreatedByDebouncing) {
        void loadApiKeys(page)
      }
    })

    return () => {
      shouldLoad = false
      apiKeysRequestIdRef.current += 1
    }
  }, [isActive, isCreatedByDebouncing, loadApiKeys, page])

  function updateCreatedBy(value: string) {
    setCreatedBy(value)
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
          <SectionTitle>API Keys</SectionTitle>
          {totalApiKeys !== undefined && (
            <SectionSubtitle>{formatNumber(totalApiKeys)} API keys encontradas</SectionSubtitle>
          )}
        </div>
      </TabHeader>

      <FiltersGrid>
        <FilterField>
          <FilterLabel>Criador</FilterLabel>
          <FilterInput
            aria-label="Buscar API keys por email ou nome do criador"
            autoComplete="off"
            placeholder="Buscar por email ou nome"
            type="search"
            value={createdBy}
            onChange={(event) => updateCreatedBy(event.target.value)}
          />
        </FilterField>
      </FiltersGrid>

      {apiKeysState.errorMessage ? (
        <ResourceError
          message={apiKeysState.errorMessage}
          onRetry={() => {
            void loadApiKeys(page)
          }}
        />
      ) : (
        <>
          <DataList aria-busy={apiKeysState.isLoading}>
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
            currentPage={page}
            isLoading={apiKeysState.isLoading}
            itemLabelPlural="API keys"
            itemLabelSingular="API key"
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            pageData={apiKeysState.data}
          />
        </>
      )}
    </>
  )
}
