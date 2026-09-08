import { FolderPlus, Key, KeyRound, ShieldCheck, type LucideIcon } from 'lucide-react'
import type { FieldPath } from 'react-hook-form'

import { isProjectsServiceError } from '@/services/project.service'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type { ProjectApiKeyScope } from '@/types/project-types'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { normalizeFieldName, normalizeFieldPath } from '@/utils/normalizer'

export type ProjectCreateFieldName = FieldPath<ProjectCreateFormValues>
export type ProjectCreateRequestStage = 'project' | 'apiKey'
export type ProjectCreateStepStatus = 'active' | 'complete' | 'pending'

export type ProjectCreateStepItem = {
  key: string
  title: string
  description: string
  icon: LucideIcon
}

export type ProjectCreateStep = (typeof projectCreateSteps)[number]['key']

export type SelectFieldOption = {
  label: string
  value: string
}

export type ScopeFieldOption = {
  description: string
  label: string
  value: ProjectApiKeyScope
}

export type NormalizedBackendFieldError = {
  field: ProjectCreateFieldName
  message: string
}

export const projectCreateSteps = [
  {
    key: 'project-data',
    title: 'Dados do projeto',
    description: 'Nome, ambiente e audiência.',
    icon: FolderPlus,
  },
  {
    key: 'password-policy',
    title: 'Política de senha',
    description: 'Regras para senhas de usuários.',
    icon: KeyRound,
  },
  {
    key: 'auth-policy',
    title: 'Política de autenticação',
    description: 'Sessões, tokens e bloqueios.',
    icon: ShieldCheck,
  },
  {
    key: 'api-key',
    title: 'Gerar API Key',
    description: 'Escopos e validade da chave.',
    icon: Key,
  },
] as const satisfies readonly ProjectCreateStepItem[]

export const projectDataStepFields = [
  'name',
  'description',
  'environment',
  'tokenAudience',
] as const satisfies readonly ProjectCreateFieldName[]

export const passwordPolicyStepFields = [
  'passwordConfig.minSize',
  'passwordConfig.maxSize',
  'passwordConfig.numberRequired',
  'passwordConfig.uppercaseRequired',
  'passwordConfig.lowercaseRequired',
  'passwordConfig.specialCharRequired',
] as const satisfies readonly ProjectCreateFieldName[]

export const authPolicyStepFields = [
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
] as const satisfies readonly ProjectCreateFieldName[]

export const apiKeyStepFields = [
  'apiKey.name',
  'apiKey.scopes',
  'apiKey.expiresInHours',
] as const satisfies readonly ProjectCreateFieldName[]

export const projectCreateStepFields = {
  'project-data': projectDataStepFields,
  'password-policy': passwordPolicyStepFields,
  'auth-policy': authPolicyStepFields,
  'api-key': apiKeyStepFields,
} as const satisfies Record<ProjectCreateStep, readonly ProjectCreateFieldName[]>

export const projectCreateFieldNames = [
  ...projectDataStepFields,
  ...passwordPolicyStepFields,
  ...authPolicyStepFields,
  ...apiKeyStepFields,
] as const satisfies readonly ProjectCreateFieldName[]

export const projectEnvironmentOptions: SelectFieldOption[] = [
  {
    label: 'Desenvolvimento',
    value: 'DEVELOPMENT',
  },
  {
    label: 'Produção',
    value: 'PRODUCTION',
  },
]

export const sessionModeOptions: SelectFieldOption[] = [
  {
    label: 'Múltiplos dispositivos',
    value: 'MULTIPLE_DEVICES',
  },
  {
    label: 'Sessão única ativa',
    value: 'SINGLE_ACTIVE_SESSION',
  },
  {
    label: 'Sessões ativas limitadas',
    value: 'LIMITED_ACTIVE_SESSIONS',
  },
]

export const apiKeyScopeOptions: ScopeFieldOption[] = [
  {
    label: 'Leitura de usuários',
    description: 'Permite consultar usuários finais do projeto.',
    value: 'USERS_READ',
  },
  {
    label: 'Escrita de usuários',
    description: 'Permite criar e atualizar usuários finais.',
    value: 'USERS_WRITE',
  },
  {
    label: 'Login',
    description: 'Permite autenticar usuários finais.',
    value: 'AUTH_LOGIN',
  },
  {
    label: 'Cadastro',
    description: 'Permite cadastrar usuários finais.',
    value: 'AUTH_REGISTER',
  },
]

export const defaultProjectCreateErrorMessage =
  'Não foi possível concluir a criação do projeto. Revise os dados e tente novamente.'

const projectFieldAliases: Record<string, ProjectCreateFieldName> = {
  authconfig: 'authConfig.accessTokenExpirationMinutes',
  'authconfig.maxactivesessionsrequiredwhenlimited': 'authConfig.maxActiveSessions',
  'passwordconfig.validrange': 'passwordConfig.maxSize',
  maxactivesessionsrequiredwhenlimited: 'authConfig.maxActiveSessions',
  passwordconfig: 'passwordConfig.minSize',
  validrange: 'passwordConfig.maxSize',
}

const apiKeyFieldAliases: Record<string, ProjectCreateFieldName> = {
  expiresinhours: 'apiKey.expiresInHours',
  name: 'apiKey.name',
  scopes: 'apiKey.scopes',
}

function getStepIndex(step: ProjectCreateStep) {
  const stepIndex = projectCreateSteps.findIndex((stepItem) => stepItem.key === step)

  return stepIndex === -1 ? 0 : stepIndex
}

export function getProjectCreateStepStatus(
  step: ProjectCreateStep,
  activeStep: ProjectCreateStep,
): ProjectCreateStepStatus {
  const stepIndex = getStepIndex(step)
  const activeStepIndex = getStepIndex(activeStep)

  if (stepIndex === activeStepIndex) {
    return 'active'
  }

  return stepIndex < activeStepIndex ? 'complete' : 'pending'
}

export function getProjectCreateStepIndex(step: ProjectCreateStep) {
  return getStepIndex(step)
}

export function getProjectCreateStepContent(step: ProjectCreateStep) {
  return projectCreateSteps[getStepIndex(step)] ?? projectCreateSteps[0]
}

export function getNextProjectCreateStep(step: ProjectCreateStep) {
  const nextStep = projectCreateSteps[getStepIndex(step) + 1]

  return nextStep?.key ?? step
}

export function getPreviousProjectCreateStep(step: ProjectCreateStep) {
  const previousStep = projectCreateSteps[getStepIndex(step) - 1]

  return previousStep?.key ?? step
}

export function getProjectCreateStepForField(field: ProjectCreateFieldName) {
  const step = projectCreateSteps.find((stepItem) => {
    return projectCreateStepFields[stepItem.key].some((stepField) => stepField === field)
  })

  return step?.key ?? 'project-data'
}

function normalizeBackendFieldName(fieldName: string, stage: ProjectCreateRequestStage) {
  const normalizedFieldName = normalizeFieldPath(fieldName)
  const aliases = stage === 'apiKey' ? apiKeyFieldAliases : projectFieldAliases
  const aliasedField = aliases[normalizedFieldName.toLowerCase()]

  if (stage === 'apiKey' && aliasedField) {
    return aliasedField
  }

  return normalizeFieldName(normalizedFieldName, {
    aliases,
    fieldNames: [...projectCreateFieldNames],
  })
}

export function getProjectCreateBackendFieldErrors(
  apiError: ApiErrorResponse,
  stage: ProjectCreateRequestStage,
) {
  const fallbackMessage = apiError.message ?? 'Revise este campo.'
  const { fields } = apiError

  if (!fields) {
    return []
  }

  if (Array.isArray(fields)) {
    return fields.reduce<NormalizedBackendFieldError[]>((errors, fieldError) => {
      const fieldName =
        typeof fieldError === 'string'
          ? fieldError
          : (fieldError.field ?? fieldError.name ?? fieldError.path)
      const field = fieldName ? normalizeBackendFieldName(fieldName, stage) : null

      if (field) {
        errors.push({
          field,
          message:
            typeof fieldError === 'string'
              ? fallbackMessage
              : (fieldError.message ?? fallbackMessage),
        })
      }

      return errors
    }, [])
  }

  return Object.entries(fields).reduce<NormalizedBackendFieldError[]>(
    (errors, [fieldName, message]) => {
      const field = normalizeBackendFieldName(fieldName, stage)

      if (field) {
        errors.push({
          field,
          message: message || fallbackMessage,
        })
      }

      return errors
    },
    [],
  )
}

export function getProjectCreateServiceErrorMessage(
  error: unknown,
  stage: ProjectCreateRequestStage,
) {
  if (isProjectsServiceError(error)) {
    const message = error.response.message ?? error.message ?? defaultProjectCreateErrorMessage

    return stage === 'apiKey' ? `Projeto criado. ${message}` : message
  }

  if (error instanceof Error) {
    return error.message || defaultProjectCreateErrorMessage
  }

  return defaultProjectCreateErrorMessage
}
