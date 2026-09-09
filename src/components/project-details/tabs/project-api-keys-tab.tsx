'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Clipboard, Key, LoaderCircle, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, type FieldPath } from 'react-hook-form'

import { SettingsScopeField } from '@components/project-settings/project-settings-fields'
import { getProjectSettingsBackendFieldErrors } from '@components/project-settings/project-settings.shared'
import { Modal } from '@components/ui/modal'
import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import {
  createProjectApiKey,
  getProjectApiKeys,
  isProjectsServiceError,
} from '@/services/project.service'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type {
  CreatedProjectApiKeyResponse,
  ProjectApiKeyDetailsResponse,
  ProjectApiKeysPageResponse,
} from '@/types/project-types'
import {
  projectApiKeySettingsDefaultValues,
  projectApiKeySettingsFormSchema,
  toCreateProjectApiKeySettingsPayload,
  type ProjectApiKeySettingsFormValues,
  type ProjectApiKeySettingsSubmitValues,
} from '@lib/validations/project-settings'
import {
  ActionGrid,
  ApiKeyBox,
  ApiKeyCode,
  ApiKeyLabel,
  FieldHelper,
  FormButton,
  FormStack,
  PrimaryFormButton,
  SubmitLoadingIcon,
} from '@components/project-create/style'

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
  ErrorMessage,
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
  TabActionButton,
  TabHeader,
} from '../style'

type ProjectApiKeysTabProps = {
  isActive: boolean
  projectId: string
}

type ProjectApiKeySettingsFieldName = FieldPath<ProjectApiKeySettingsFormValues>

const defaultApiKeysErrorMessage =
  'Não foi possível carregar as API keys do projeto. Tente novamente em alguns instantes.'
const defaultCreateApiKeyErrorMessage =
  'Não foi possível gerar a API key do projeto. Revise os dados e tente novamente.'

const apiKeySettingsFieldNames = [
  'name',
  'scopes',
  'expiresInHours',
] as const satisfies readonly ProjectApiKeySettingsFieldName[]

const apiKeyFieldAliases: Record<string, ProjectApiKeySettingsFieldName> = {
  'apikey.expiresinhours': 'expiresInHours',
  'apikey.name': 'name',
  'apikey.scopes': 'scopes',
  expiresinhours: 'expiresInHours',
  name: 'name',
  scopes: 'scopes',
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

function getCreateApiKeyServiceErrorMessage(error: unknown) {
  if (isProjectsServiceError(error)) {
    return error.response.message ?? error.message ?? defaultCreateApiKeyErrorMessage
  }

  if (error instanceof Error) {
    return error.message || defaultCreateApiKeyErrorMessage
  }

  return defaultCreateApiKeyErrorMessage
}

export function ProjectApiKeysTab({ isActive, projectId }: ProjectApiKeysTabProps) {
  const [page, setPage] = useState(0)
  const [createdBy, setCreatedBy] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createdApiKey, setCreatedApiKey] = useState<CreatedProjectApiKeyResponse | null>(null)
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [isCreatingApiKey, setIsCreatingApiKey] = useState(false)
  const debouncedCreatedBy = useDebouncedValue(createdBy, 200)
  const [apiKeysState, setApiKeysState] = useState<ResourceState<ProjectApiKeysPageResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const createApiKeyForm = useForm<
    ProjectApiKeySettingsFormValues,
    unknown,
    ProjectApiKeySettingsSubmitValues
  >({
    defaultValues: projectApiKeySettingsDefaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(projectApiKeySettingsFormSchema),
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

  function closeCreateModal() {
    if (isCreatingApiKey) {
      return
    }

    setIsCreateModalOpen(false)
    setCreatedApiKey(null)
    setCreateErrorMessage(null)
    setCopyMessage(null)
    createApiKeyForm.reset(projectApiKeySettingsDefaultValues)
  }

  function applyBackendFieldErrors(apiError: ApiErrorResponse | null) {
    const fieldErrors = getProjectSettingsBackendFieldErrors<ProjectApiKeySettingsFieldName>(
      apiError,
      {
        aliases: apiKeyFieldAliases,
        fallbackMessage: defaultCreateApiKeyErrorMessage,
        fieldNames: [...apiKeySettingsFieldNames],
      },
    )

    fieldErrors.forEach(({ field, message }) => {
      createApiKeyForm.setError(field, {
        type: 'server',
        message,
      })
    })

    if (fieldErrors[0]) {
      createApiKeyForm.setFocus(fieldErrors[0].field)
    }
  }

  async function handleCreateApiKey(data: ProjectApiKeySettingsSubmitValues) {
    setIsCreatingApiKey(true)
    setCreateErrorMessage(null)
    setCopyMessage(null)

    try {
      const apiKey = await createProjectApiKey({
        projectId,
        data: toCreateProjectApiKeySettingsPayload(data),
      })

      setCreatedApiKey(apiKey)
      setPage(0)
      await loadApiKeys(0)
    } catch (error: unknown) {
      const projectServiceError = isProjectsServiceError(error) ? error : null

      setCreateErrorMessage(getCreateApiKeyServiceErrorMessage(error))
      applyBackendFieldErrors(projectServiceError?.response ?? null)
    } finally {
      setIsCreatingApiKey(false)
    }
  }

  async function handleCopyApiKey() {
    const key = createdApiKey?.key

    if (!key) {
      return
    }

    try {
      await navigator.clipboard.writeText(key)
      setCopyMessage('API key copiada.')
    } catch {
      setCopyMessage('Não foi possível copiar a API key.')
    }
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

        <TabActionButton
          type="button"
          size="lg"
          onClick={() => {
            setIsCreateModalOpen(true)
          }}
        >
          <Plus size={16} />
          Criar API key
        </TabActionButton>
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

      <Modal
        open={isCreateModalOpen}
        title={createdApiKey ? 'API key criada' : 'Criar API key'}
        subtitle={
          createdApiKey
            ? 'A chave bruta fica disponível apenas nesta resposta.'
            : 'Defina nome, escopos e validade da nova chave do projeto.'
        }
        icon={<Key size={20} />}
        onClose={closeCreateModal}
      >
        {createdApiKey ? (
          <FormStack>
            <ApiKeyBox>
              <ApiKeyLabel>API Key</ApiKeyLabel>
              {createdApiKey.key ? (
                <ApiKeyCode>{createdApiKey.key}</ApiKeyCode>
              ) : (
                <FieldHelper $error>Chave bruta não retornada pela API.</FieldHelper>
              )}
              {copyMessage && <FieldHelper>{copyMessage}</FieldHelper>}
            </ApiKeyBox>

            <ActionGrid>
              <FormButton
                type="button"
                variant="outline"
                size="lg"
                disabled={!createdApiKey.key}
                onClick={() => {
                  void handleCopyApiKey()
                }}
              >
                <Clipboard size={16} />
                Copiar
              </FormButton>
              <PrimaryFormButton type="button" size="lg" onClick={closeCreateModal}>
                Concluir
              </PrimaryFormButton>
            </ActionGrid>
          </FormStack>
        ) : (
          <FormProvider {...createApiKeyForm}>
            <form
              onSubmit={(event) => {
                void createApiKeyForm.handleSubmit(handleCreateApiKey)(event)
              }}
            >
              <FormStack>
                {createErrorMessage && (
                  <ErrorMessage role="alert">{createErrorMessage}</ErrorMessage>
                )}

                <RHFInput<ProjectApiKeySettingsFormValues>
                  name="name"
                  label="Nome da API key"
                  placeholder="Chave de produção"
                  type="text"
                />
                <SettingsScopeField<ProjectApiKeySettingsFormValues> name="scopes" />
                <RHFInput<ProjectApiKeySettingsFormValues>
                  name="expiresInHours"
                  label="Validade em horas"
                  placeholder="720"
                  type="number"
                />

                <ActionGrid>
                  <FormButton
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={isCreatingApiKey}
                    onClick={closeCreateModal}
                  >
                    Cancelar
                  </FormButton>
                  <PrimaryFormButton type="submit" size="lg" disabled={isCreatingApiKey}>
                    {isCreatingApiKey ? (
                      <>
                        <SubmitLoadingIcon>
                          <LoaderCircle size={16} />
                        </SubmitLoadingIcon>
                        Criando
                      </>
                    ) : (
                      <>
                        Criar API key <Plus size={16} />
                      </>
                    )}
                  </PrimaryFormButton>
                </ActionGrid>
              </FormStack>
            </form>
          </FormProvider>
        )}
      </Modal>
    </>
  )
}
