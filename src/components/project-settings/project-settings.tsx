'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  KeyRound,
  LoaderCircle,
  RefreshCcw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, useFormContext, useWatch, type FieldPath } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog'
import {
  deleteProjectMember,
  getProjectAuthConfig,
  getProjectById,
  getProjectMembers,
  getProjectPasswordConfig,
  isProjectsServiceError,
  updateProjectAuthConfig,
  updateProjectPasswordConfig,
} from '@/services/project.service'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type {
  ProjectAuthConfigResponse,
  ProjectMemberResponse,
  ProjectMembersPageResponse,
  ProjectPasswordConfigResponse,
  ProjectResponse,
} from '@/types/project-types'
import {
  projectAuthSettingsFormSchema,
  projectPasswordSettingsFormSchema,
  toAuthSettingsFormValues,
  toPasswordSettingsFormValues,
  toUpdateProjectAuthConfigPayload,
  toUpdateProjectPasswordConfigPayload,
  type ProjectAuthSettingsFormValues,
  type ProjectAuthSettingsSubmitValues,
  type ProjectPasswordSettingsFormValues,
  type ProjectPasswordSettingsSubmitValues,
} from '@lib/validations/project-settings'
import { FieldGroup, FieldGroupTitle, SwitchGrid } from '@components/project-create/style'
import {
  fetchResource,
  formatDateTime,
  getDisplayText,
  getMemberRoleBadgeTone,
  getMemberRoleLabel,
  getTrimmedText,
  LoadingConfigGrid,
  LoadingRecords,
  PaginationControls,
  projectResourcePageSize,
  ResourceError,
  type ResourceState,
} from '@components/project-details/project-details.shared'
import {
  Badge,
  DataList,
  EmptyDescription,
  EmptyState,
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
  SectionTitle as DetailSectionTitle,
} from '@components/project-details/style'
import { SettingsSelectField, SettingsSwitchField } from './project-settings-fields'
import {
  ActionButton,
  BackLink,
  FeedbackMessage,
  FormActions,
  FormGrid,
  HeaderActions,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  ProjectSettingsHeader,
  ProjectSettingsRoot,
  SettingsDescription,
  SettingsGrid,
  SettingsPanel,
  SettingsPanelHeader,
  SettingsTitle,
  SettingsTitleGroup,
  TwoColumnGrid,
} from './style'
import {
  getProjectSettingsBackendFieldErrors,
  getProjectSettingsServiceErrorMessage,
} from './project-settings.shared'

type ProjectSettingsProps = {
  projectId: string
}

type ProjectPasswordSettingsFieldName = FieldPath<ProjectPasswordSettingsFormValues>
type ProjectAuthSettingsFieldName = FieldPath<ProjectAuthSettingsFormValues>

const defaultProjectErrorMessage =
  'Não foi possível carregar o projeto. Tente novamente em alguns instantes.'
const defaultPasswordConfigErrorMessage =
  'Não foi possível carregar a política de senha. Tente novamente em alguns instantes.'
const defaultAuthConfigErrorMessage =
  'Não foi possível carregar a política de autenticação. Tente novamente em alguns instantes.'
const defaultUpdatePasswordConfigErrorMessage =
  'Não foi possível atualizar a política de senha. Revise os dados e tente novamente.'
const defaultUpdateAuthConfigErrorMessage =
  'Não foi possível atualizar a política de autenticação. Revise os dados e tente novamente.'
const defaultMembersErrorMessage =
  'Não foi possível carregar os membros do projeto. Tente novamente em alguns instantes.'
const defaultDeleteMemberErrorMessage =
  'Não foi possível remover o membro do projeto. Tente novamente em alguns instantes.'

const passwordSettingsFieldNames = [
  'passwordConfig.minSize',
  'passwordConfig.maxSize',
  'passwordConfig.numberRequired',
  'passwordConfig.uppercaseRequired',
  'passwordConfig.lowercaseRequired',
  'passwordConfig.specialCharRequired',
] as const satisfies readonly ProjectPasswordSettingsFieldName[]

const authSettingsFieldNames = [
  'authConfig.accessTokenExpirationMinutes',
  'authConfig.refreshTokenExpirationDays',
  'authConfig.sessionMode',
  'authConfig.maxActiveSessions',
  'authConfig.refreshTokenRotationEnabled',
  'authConfig.revokeTokensOnPasswordChange',
  'authConfig.failedLoginAttemptsLimit',
  'authConfig.lockDurationMinutes',
  'authConfig.requireEmailVerification',
  'authConfig.registrationEnabled',
] as const satisfies readonly ProjectAuthSettingsFieldName[]

const passwordFieldAliases: Record<string, ProjectPasswordSettingsFieldName> = {
  lowercaserequired: 'passwordConfig.lowercaseRequired',
  maxsize: 'passwordConfig.maxSize',
  minsize: 'passwordConfig.minSize',
  numberrequired: 'passwordConfig.numberRequired',
  passwordconfig: 'passwordConfig.minSize',
  'passwordconfig.validrange': 'passwordConfig.maxSize',
  specialcharrequired: 'passwordConfig.specialCharRequired',
  uppercaserequired: 'passwordConfig.uppercaseRequired',
  validrange: 'passwordConfig.maxSize',
}

const authFieldAliases: Record<string, ProjectAuthSettingsFieldName> = {
  accesstokenexpirationminutes: 'authConfig.accessTokenExpirationMinutes',
  authconfig: 'authConfig.accessTokenExpirationMinutes',
  failedloginattemptslimit: 'authConfig.failedLoginAttemptsLimit',
  lockdurationminutes: 'authConfig.lockDurationMinutes',
  maxactivesessions: 'authConfig.maxActiveSessions',
  maxactivesessionsrequiredwhenlimited: 'authConfig.maxActiveSessions',
  'authconfig.maxactivesessionsrequiredwhenlimited': 'authConfig.maxActiveSessions',
  refreshtokenexpirationdays: 'authConfig.refreshTokenExpirationDays',
  refreshtokenrotationenabled: 'authConfig.refreshTokenRotationEnabled',
  registrationenabled: 'authConfig.registrationEnabled',
  requireemailverification: 'authConfig.requireEmailVerification',
  revoketokensonpasswordchange: 'authConfig.revokeTokensOnPasswordChange',
  sessionmode: 'authConfig.sessionMode',
}

function getMemberName(member: ProjectMemberResponse) {
  const fullName = [member.name, member.lastName]
    .map((namePart) => namePart?.trim())
    .filter(Boolean)
    .join(' ')

  return getTrimmedText(fullName) ?? 'Membro sem nome'
}

function getMemberAccountId(member: ProjectMemberResponse) {
  return member.accountId?.trim() || null
}

function getProjectTitle(projectState: ResourceState<ProjectResponse>) {
  if (projectState.isLoading && !projectState.data) {
    return 'Carregando projeto'
  }

  return projectState.data?.name?.trim() || 'Projeto sem nome'
}

function AuthSessionModeWatcher() {
  const { clearErrors, control, setValue } = useFormContext<ProjectAuthSettingsFormValues>()
  const sessionMode = useWatch({
    control,
    name: 'authConfig.sessionMode',
  })

  useEffect(() => {
    if (sessionMode === 'LIMITED_ACTIVE_SESSIONS') {
      return
    }

    setValue('authConfig.maxActiveSessions', '', {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    })
    clearErrors('authConfig.maxActiveSessions')
  }, [clearErrors, sessionMode, setValue])

  return null
}

function LoadingIcon() {
  return (
    <span>
      <LoaderCircle size={16} />
    </span>
  )
}

function PasswordPolicySettingsPanel({ projectId }: ProjectSettingsProps) {
  const [passwordConfigState, setPasswordConfigState] = useState<
    ResourceState<ProjectPasswordConfigResponse>
  >({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passwordConfigRequestIdRef = useRef(0)
  const methods = useForm<
    ProjectPasswordSettingsFormValues,
    unknown,
    ProjectPasswordSettingsSubmitValues
  >({
    defaultValues: toPasswordSettingsFormValues(),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(projectPasswordSettingsFormSchema),
  })
  const { reset, setError, setFocus } = methods

  const loadPasswordConfig = useCallback(async () => {
    const requestId = passwordConfigRequestIdRef.current + 1

    passwordConfigRequestIdRef.current = requestId
    setPasswordConfigState({
      data: null,
      isLoading: true,
      errorMessage: null,
    })
    setSubmitErrorMessage(null)
    setSubmitSuccessMessage(null)

    const { data, errorMessage } = await fetchResource(
      () => getProjectPasswordConfig(projectId),
      defaultPasswordConfigErrorMessage,
    )

    if (passwordConfigRequestIdRef.current === requestId) {
      if (data) {
        reset(toPasswordSettingsFormValues(data))
      }

      setPasswordConfigState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId, reset])

  useEffect(() => {
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
  }, [loadPasswordConfig])

  function applyBackendFieldErrors(apiError: ApiErrorResponse | null) {
    const fieldErrors = getProjectSettingsBackendFieldErrors<ProjectPasswordSettingsFieldName>(
      apiError,
      {
        aliases: passwordFieldAliases,
        fallbackMessage: defaultUpdatePasswordConfigErrorMessage,
        fieldNames: [...passwordSettingsFieldNames],
      },
    )

    fieldErrors.forEach(({ field, message }) => {
      setError(field, {
        type: 'server',
        message,
      })
    })

    if (fieldErrors[0]) {
      setFocus(fieldErrors[0].field)
    }
  }

  async function handleSubmit(data: ProjectPasswordSettingsSubmitValues) {
    setIsSubmitting(true)
    setSubmitErrorMessage(null)
    setSubmitSuccessMessage(null)

    try {
      const updatedConfig = await updateProjectPasswordConfig({
        projectId,
        data: toUpdateProjectPasswordConfigPayload(data),
      })

      reset(toPasswordSettingsFormValues(updatedConfig))
      setPasswordConfigState({
        data: updatedConfig,
        isLoading: false,
        errorMessage: null,
      })
      setSubmitSuccessMessage('Política de senha atualizada.')
    } catch (error: unknown) {
      const projectServiceError = isProjectsServiceError(error) ? error : null

      setSubmitErrorMessage(
        getProjectSettingsServiceErrorMessage(error, defaultUpdatePasswordConfigErrorMessage),
      )
      applyBackendFieldErrors(projectServiceError?.response ?? null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SettingsPanel>
      <SettingsPanelHeader>
        <SettingsTitleGroup>
          <SettingsTitle>
            <KeyRound size={18} />
            Política de senha
          </SettingsTitle>
          <SettingsDescription>
            Regras aplicadas às senhas dos usuários finais deste projeto.
          </SettingsDescription>
        </SettingsTitleGroup>

        <ActionButton
          type="button"
          size="sm"
          variant="outline"
          disabled={passwordConfigState.isLoading || isSubmitting}
          onClick={() => {
            void loadPasswordConfig()
          }}
        >
          <RefreshCcw size={16} />
          Atualizar
        </ActionButton>
      </SettingsPanelHeader>

      {passwordConfigState.errorMessage ? (
        <ResourceError
          message={passwordConfigState.errorMessage}
          onRetry={() => {
            void loadPasswordConfig()
          }}
        />
      ) : passwordConfigState.isLoading && !passwordConfigState.data ? (
        <LoadingConfigGrid />
      ) : (
        <FormProvider {...methods}>
          <FormGrid onSubmit={methods.handleSubmit(handleSubmit)}>
            {submitErrorMessage && (
              <FeedbackMessage $tone="danger" role="alert">
                {submitErrorMessage}
              </FeedbackMessage>
            )}
            {submitSuccessMessage && (
              <FeedbackMessage $tone="success">{submitSuccessMessage}</FeedbackMessage>
            )}

            <TwoColumnGrid>
              <RHFInput<ProjectPasswordSettingsFormValues>
                name="passwordConfig.minSize"
                label="Tamanho mínimo"
                placeholder="8"
                type="number"
              />
              <RHFInput<ProjectPasswordSettingsFormValues>
                name="passwordConfig.maxSize"
                label="Tamanho máximo"
                placeholder="120"
                type="number"
              />
            </TwoColumnGrid>

            <FieldGroup>
              <FieldGroupTitle>Requisitos</FieldGroupTitle>
              <SwitchGrid>
                <SettingsSwitchField<ProjectPasswordSettingsFormValues>
                  name="passwordConfig.numberRequired"
                  label="Número obrigatório"
                  description="Exige ao menos um dígito."
                />
                <SettingsSwitchField<ProjectPasswordSettingsFormValues>
                  name="passwordConfig.uppercaseRequired"
                  label="Maiúscula obrigatória"
                  description="Exige ao menos uma letra maiúscula."
                />
                <SettingsSwitchField<ProjectPasswordSettingsFormValues>
                  name="passwordConfig.lowercaseRequired"
                  label="Minúscula obrigatória"
                  description="Exige ao menos uma letra minúscula."
                />
                <SettingsSwitchField<ProjectPasswordSettingsFormValues>
                  name="passwordConfig.specialCharRequired"
                  label="Caractere especial"
                  description="Exige símbolo ou pontuação."
                />
              </SwitchGrid>
            </FieldGroup>

            <FormActions>
              <ActionButton type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <LoadingIcon /> : <Save size={16} />}
                Salvar política
              </ActionButton>
            </FormActions>
          </FormGrid>
        </FormProvider>
      )}
    </SettingsPanel>
  )
}

function AuthPolicySettingsPanel({ projectId }: ProjectSettingsProps) {
  const [authConfigState, setAuthConfigState] = useState<ResourceState<ProjectAuthConfigResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const authConfigRequestIdRef = useRef(0)
  const methods = useForm<ProjectAuthSettingsFormValues, unknown, ProjectAuthSettingsSubmitValues>({
    defaultValues: toAuthSettingsFormValues(),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(projectAuthSettingsFormSchema),
  })
  const { control, reset, setError, setFocus } = methods
  const sessionMode = useWatch({
    control,
    name: 'authConfig.sessionMode',
  })
  const isLimitedSessionMode = sessionMode === 'LIMITED_ACTIVE_SESSIONS'

  const loadAuthConfig = useCallback(async () => {
    const requestId = authConfigRequestIdRef.current + 1

    authConfigRequestIdRef.current = requestId
    setAuthConfigState({
      data: null,
      isLoading: true,
      errorMessage: null,
    })
    setSubmitErrorMessage(null)
    setSubmitSuccessMessage(null)

    const { data, errorMessage } = await fetchResource(
      () => getProjectAuthConfig(projectId),
      defaultAuthConfigErrorMessage,
    )

    if (authConfigRequestIdRef.current === requestId) {
      if (data) {
        reset(toAuthSettingsFormValues(data))
      }

      setAuthConfigState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId, reset])

  useEffect(() => {
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
  }, [loadAuthConfig])

  function applyBackendFieldErrors(apiError: ApiErrorResponse | null) {
    const fieldErrors = getProjectSettingsBackendFieldErrors<ProjectAuthSettingsFieldName>(
      apiError,
      {
        aliases: authFieldAliases,
        fallbackMessage: defaultUpdateAuthConfigErrorMessage,
        fieldNames: [...authSettingsFieldNames],
      },
    )

    fieldErrors.forEach(({ field, message }) => {
      setError(field, {
        type: 'server',
        message,
      })
    })

    if (fieldErrors[0]) {
      setFocus(fieldErrors[0].field)
    }
  }

  async function handleSubmit(data: ProjectAuthSettingsSubmitValues) {
    setIsSubmitting(true)
    setSubmitErrorMessage(null)
    setSubmitSuccessMessage(null)

    try {
      const updatedConfig = await updateProjectAuthConfig({
        projectId,
        data: toUpdateProjectAuthConfigPayload(data),
      })

      reset(toAuthSettingsFormValues(updatedConfig))
      setAuthConfigState({
        data: updatedConfig,
        isLoading: false,
        errorMessage: null,
      })
      setSubmitSuccessMessage('Política de autenticação atualizada.')
    } catch (error: unknown) {
      const projectServiceError = isProjectsServiceError(error) ? error : null

      setSubmitErrorMessage(
        getProjectSettingsServiceErrorMessage(error, defaultUpdateAuthConfigErrorMessage),
      )
      applyBackendFieldErrors(projectServiceError?.response ?? null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SettingsPanel>
      <SettingsPanelHeader>
        <SettingsTitleGroup>
          <SettingsTitle>
            <ShieldCheck size={18} />
            Política de autenticação
          </SettingsTitle>
          <SettingsDescription>
            Duração de tokens, modo de sessão, bloqueios e regras de cadastro.
          </SettingsDescription>
        </SettingsTitleGroup>

        <ActionButton
          type="button"
          size="sm"
          variant="outline"
          disabled={authConfigState.isLoading || isSubmitting}
          onClick={() => {
            void loadAuthConfig()
          }}
        >
          <RefreshCcw size={16} />
          Atualizar
        </ActionButton>
      </SettingsPanelHeader>

      {authConfigState.errorMessage ? (
        <ResourceError
          message={authConfigState.errorMessage}
          onRetry={() => {
            void loadAuthConfig()
          }}
        />
      ) : authConfigState.isLoading && !authConfigState.data ? (
        <LoadingConfigGrid />
      ) : (
        <FormProvider {...methods}>
          <FormGrid onSubmit={methods.handleSubmit(handleSubmit)}>
            <AuthSessionModeWatcher />

            {submitErrorMessage && (
              <FeedbackMessage $tone="danger" role="alert">
                {submitErrorMessage}
              </FeedbackMessage>
            )}
            {submitSuccessMessage && (
              <FeedbackMessage $tone="success">{submitSuccessMessage}</FeedbackMessage>
            )}

            <TwoColumnGrid>
              <RHFInput<ProjectAuthSettingsFormValues>
                name="authConfig.accessTokenExpirationMinutes"
                label="Access token (minutos)"
                placeholder="15"
                type="number"
              />
              <RHFInput<ProjectAuthSettingsFormValues>
                name="authConfig.refreshTokenExpirationDays"
                label="Refresh token (dias)"
                placeholder="30"
                type="number"
              />
            </TwoColumnGrid>

            <TwoColumnGrid>
              <SettingsSelectField<ProjectAuthSettingsFormValues>
                name="authConfig.sessionMode"
                label="Modo de sessão"
              />
              {isLimitedSessionMode && (
                <RHFInput<ProjectAuthSettingsFormValues>
                  name="authConfig.maxActiveSessions"
                  label="Máximo de sessões ativas"
                  placeholder="5"
                  type="number"
                />
              )}
            </TwoColumnGrid>

            <TwoColumnGrid>
              <RHFInput<ProjectAuthSettingsFormValues>
                name="authConfig.failedLoginAttemptsLimit"
                label="Limite de falhas de login"
                placeholder="5"
                type="number"
              />
              <RHFInput<ProjectAuthSettingsFormValues>
                name="authConfig.lockDurationMinutes"
                label="Bloqueio (minutos)"
                placeholder="30"
                type="number"
              />
            </TwoColumnGrid>

            <FieldGroup>
              <FieldGroupTitle>Comportamento</FieldGroupTitle>
              <SwitchGrid>
                <SettingsSwitchField<ProjectAuthSettingsFormValues>
                  name="authConfig.refreshTokenRotationEnabled"
                  label="Rotação de refresh token"
                  description="Renova o refresh token a cada troca."
                />
                <SettingsSwitchField<ProjectAuthSettingsFormValues>
                  name="authConfig.revokeTokensOnPasswordChange"
                  label="Revogar ao trocar senha"
                  description="Invalida tokens após alteração."
                />
                <SettingsSwitchField<ProjectAuthSettingsFormValues>
                  name="authConfig.requireEmailVerification"
                  label="Verificação de e-mail"
                  description="Exige e-mail verificado para acesso."
                />
                <SettingsSwitchField<ProjectAuthSettingsFormValues>
                  name="authConfig.registrationEnabled"
                  label="Cadastro habilitado"
                  description="Permite novos usuários finais."
                />
              </SwitchGrid>
            </FieldGroup>

            <FormActions>
              <ActionButton type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <LoadingIcon /> : <Save size={16} />}
                Salvar política
              </ActionButton>
            </FormActions>
          </FormGrid>
        </FormProvider>
      )}
    </SettingsPanel>
  )
}

function MemberRecord({
  isDeleting,
  member,
  onRequestDelete,
}: {
  isDeleting: boolean
  member: ProjectMemberResponse
  onRequestDelete: (member: ProjectMemberResponse) => void
}) {
  const accountId = getMemberAccountId(member)
  const canDeleteMember = Boolean(accountId)

  return (
    <RecordCard>
      <RecordMain>
        <RecordTitle>{getMemberName(member)}</RecordTitle>
        <RecordDescription>{getMemberRoleLabel(member.role)}</RecordDescription>
        <RecordActions>
          <RecordActionButton
            type="button"
            size="sm"
            variant="destructive"
            disabled={!canDeleteMember || isDeleting}
            title={canDeleteMember ? undefined : 'Membro sem accountId retornado pela API.'}
            onClick={() => onRequestDelete(member)}
          >
            <Trash2 size={16} />
            Remover
          </RecordActionButton>
        </RecordActions>
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
          <RecordLabel>Conta</RecordLabel>
          <RecordValue>{getDisplayText(member.accountId)}</RecordValue>
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

function MembersManagementPanel({ projectId }: ProjectSettingsProps) {
  const [page, setPage] = useState(0)
  const [membersState, setMembersState] = useState<ResourceState<ProjectMembersPageResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const [memberPendingDeletion, setMemberPendingDeletion] = useState<ProjectMemberResponse | null>(
    null,
  )
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null)
  const [isDeletingMember, setIsDeletingMember] = useState(false)
  const membersRequestIdRef = useRef(0)
  const members = membersState.data?.content ?? []
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
      if (shouldLoad) {
        void loadMembers(page)
      }
    })

    return () => {
      shouldLoad = false
      membersRequestIdRef.current += 1
    }
  }, [loadMembers, page])

  function goToPreviousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 0))
  }

  function goToNextPage() {
    setPage((currentPage) => currentPage + 1)
  }

  function handleRequestDelete(member: ProjectMemberResponse) {
    setDeleteErrorMessage(null)
    setDeleteSuccessMessage(null)
    setMemberPendingDeletion(member)
  }

  async function handleDeleteMember() {
    if (!memberPendingDeletion) {
      return
    }

    const accountId = getMemberAccountId(memberPendingDeletion)

    if (!accountId) {
      setDeleteErrorMessage(
        'O contrato OpenAPI atual não retorna accountId na listagem de membros.',
      )
      return
    }

    setIsDeletingMember(true)
    setDeleteErrorMessage(null)
    setDeleteSuccessMessage(null)

    try {
      await deleteProjectMember({
        accountId,
        projectId,
      })

      setMemberPendingDeletion(null)
      setDeleteSuccessMessage('Membro removido.')
      await loadMembers(page)
    } catch (error: unknown) {
      setDeleteErrorMessage(
        getProjectSettingsServiceErrorMessage(error, defaultDeleteMemberErrorMessage),
      )
    } finally {
      setIsDeletingMember(false)
    }
  }

  return (
    <SettingsPanel>
      <SettingsPanelHeader>
        <SettingsTitleGroup>
          <SettingsTitle>
            <Users size={18} />
            Membros
          </SettingsTitle>
          <SettingsDescription>
            Remova membros do projeto pelo identificador de conta esperado pelo endpoint.
          </SettingsDescription>
        </SettingsTitleGroup>

        <ActionButton
          type="button"
          size="sm"
          variant="outline"
          disabled={membersState.isLoading || isDeletingMember}
          onClick={() => {
            void loadMembers(page)
          }}
        >
          <RefreshCcw size={16} />
          Atualizar
        </ActionButton>
      </SettingsPanelHeader>

      {deleteSuccessMessage && (
        <FeedbackMessage $tone="success">{deleteSuccessMessage}</FeedbackMessage>
      )}

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
                  key={
                    member.accountId ??
                    `${member.name ?? 'member'}-${member.lastName ?? 'record'}-${
                      member.joinedAt ?? index
                    }-${index}`
                  }
                  isDeleting={isDeletingMember}
                  member={member}
                  onRequestDelete={handleRequestDelete}
                />
              ))
            ) : (
              <EmptyState>
                <DetailSectionTitle>Nenhum membro encontrado</DetailSectionTitle>
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

      <AlertDialog
        open={Boolean(memberPendingDeletion)}
        onOpenChange={(open) => {
          if (!open && !isDeletingMember) {
            setMemberPendingDeletion(null)
            setDeleteErrorMessage(null)
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Remover membro</AlertDialogTitle>
          <AlertDialogDescription>
            {memberPendingDeletion
              ? `Remover ${getMemberName(memberPendingDeletion)} deste projeto.`
              : 'Remover membro deste projeto.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteErrorMessage && (
          <FeedbackMessage $tone="danger" role="alert">
            {deleteErrorMessage}
          </FeedbackMessage>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeletingMember}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeletingMember}
            onClick={() => {
              void handleDeleteMember()
            }}
          >
            {isDeletingMember ? <LoadingIcon /> : <Trash2 size={16} />}
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </SettingsPanel>
  )
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const [projectState, setProjectState] = useState<ResourceState<ProjectResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const projectRequestIdRef = useRef(0)
  const projectTitle = getProjectTitle(projectState)

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

  return (
    <ProjectSettingsRoot>
      <ProjectSettingsHeader>
        <HeaderContent>
          <HeaderEyebrow>Configurações</HeaderEyebrow>
          <HeaderTitle>{projectTitle}</HeaderTitle>
          <HeaderSubtitle>
            Atualize políticas do projeto e gerencie membros com as permissões da API.
          </HeaderSubtitle>
        </HeaderContent>

        <HeaderActions>
          <BackLink href={`/projetos/${encodeURIComponent(projectId)}`}>
            <ArrowLeft size={16} />
            Projeto
          </BackLink>
        </HeaderActions>
      </ProjectSettingsHeader>

      {projectState.errorMessage && (
        <ResourceError
          message={projectState.errorMessage}
          onRetry={() => {
            void loadProject()
          }}
        />
      )}

      <SettingsGrid>
        <PasswordPolicySettingsPanel projectId={projectId} />
        <AuthPolicySettingsPanel projectId={projectId} />
        <MembersManagementPanel projectId={projectId} />
      </SettingsGrid>
    </ProjectSettingsRoot>
  )
}
