import { z } from 'zod'

import type {
  CreateProjectApiKeyRequest,
  ProjectAuthConfigRequest,
  ProjectAuthConfigResponse,
  ProjectPasswordConfigRequest,
  ProjectPasswordConfigResponse,
} from '@/types/project-types'
import {
  createProjectApiKeyPayloadSchema,
  projectAuthConfigSchema,
  projectCreateDefaultValues,
  projectPasswordConfigSchema,
} from './project-create'

export const projectPasswordSettingsFormSchema = z.object({
  passwordConfig: projectPasswordConfigSchema,
})

export const projectAuthSettingsFormSchema = z.object({
  authConfig: projectAuthConfigSchema,
})

export const projectApiKeySettingsFormSchema = createProjectApiKeyPayloadSchema

export type ProjectPasswordSettingsFormValues = z.input<typeof projectPasswordSettingsFormSchema>
export type ProjectPasswordSettingsSubmitValues = z.output<typeof projectPasswordSettingsFormSchema>

export type ProjectAuthSettingsFormValues = z.input<typeof projectAuthSettingsFormSchema>
export type ProjectAuthSettingsSubmitValues = z.output<typeof projectAuthSettingsFormSchema>

export type ProjectApiKeySettingsFormValues = z.input<typeof projectApiKeySettingsFormSchema>
export type ProjectApiKeySettingsSubmitValues = z.output<typeof projectApiKeySettingsFormSchema>

export type UpdateProjectPasswordConfigPayload = ProjectPasswordConfigRequest
export type UpdateProjectAuthConfigPayload = ProjectAuthConfigRequest
export type CreateProjectApiKeySettingsPayload = CreateProjectApiKeyRequest

function getStringNumber(value: number | null | undefined, fallbackValue: string) {
  return value === undefined || value === null ? fallbackValue : String(value)
}

function getBooleanValue(value: boolean | null | undefined, fallbackValue: boolean) {
  return value === undefined || value === null ? fallbackValue : value
}

export const projectApiKeySettingsDefaultValues: ProjectApiKeySettingsFormValues = {
  ...projectCreateDefaultValues.apiKey,
}

export function toPasswordSettingsFormValues(
  config?: ProjectPasswordConfigResponse | null,
): ProjectPasswordSettingsFormValues {
  const fallbackConfig = projectCreateDefaultValues.passwordConfig

  return {
    passwordConfig: {
      minSize: getStringNumber(config?.minSize, fallbackConfig.minSize),
      maxSize: getStringNumber(config?.maxSize, fallbackConfig.maxSize),
      numberRequired: getBooleanValue(config?.numberRequired, fallbackConfig.numberRequired),
      uppercaseRequired: getBooleanValue(
        config?.uppercaseRequired,
        fallbackConfig.uppercaseRequired,
      ),
      lowercaseRequired: getBooleanValue(
        config?.lowercaseRequired,
        fallbackConfig.lowercaseRequired,
      ),
      specialCharRequired: getBooleanValue(
        config?.specialCharRequired,
        fallbackConfig.specialCharRequired,
      ),
    },
  }
}

export function toAuthSettingsFormValues(
  config?: ProjectAuthConfigResponse | null,
): ProjectAuthSettingsFormValues {
  const fallbackConfig = projectCreateDefaultValues.authConfig
  const sessionMode = config?.sessionMode ?? fallbackConfig.sessionMode

  return {
    authConfig: {
      accessTokenExpirationMinutes: getStringNumber(
        config?.accessTokenExpirationMinutes,
        fallbackConfig.accessTokenExpirationMinutes,
      ),
      refreshTokenExpirationDays: getStringNumber(
        config?.refreshTokenExpirationDays,
        fallbackConfig.refreshTokenExpirationDays,
      ),
      sessionMode,
      maxActiveSessions:
        sessionMode === 'LIMITED_ACTIVE_SESSIONS'
          ? getStringNumber(config?.maxActiveSessions, fallbackConfig.maxActiveSessions)
          : '',
      refreshTokenRotationEnabled: getBooleanValue(
        config?.refreshTokenRotationEnabled,
        fallbackConfig.refreshTokenRotationEnabled,
      ),
      revokeTokensOnPasswordChange: getBooleanValue(
        config?.revokeTokensOnPasswordChange,
        fallbackConfig.revokeTokensOnPasswordChange,
      ),
      failedLoginAttemptsLimit: getStringNumber(
        config?.failedLoginAttemptsLimit,
        fallbackConfig.failedLoginAttemptsLimit,
      ),
      lockDurationMinutes: getStringNumber(
        config?.lockDurationMinutes,
        fallbackConfig.lockDurationMinutes,
      ),
      requireEmailVerification: getBooleanValue(
        config?.requireEmailVerification,
        fallbackConfig.requireEmailVerification,
      ),
      registrationEnabled: getBooleanValue(
        config?.registrationEnabled,
        fallbackConfig.registrationEnabled,
      ),
    },
  }
}

export function toUpdateProjectPasswordConfigPayload(
  data: ProjectPasswordSettingsSubmitValues,
): UpdateProjectPasswordConfigPayload {
  return data.passwordConfig
}

export function toUpdateProjectAuthConfigPayload(
  data: ProjectAuthSettingsSubmitValues,
): UpdateProjectAuthConfigPayload {
  return data.authConfig
}

export function toCreateProjectApiKeySettingsPayload(
  data: ProjectApiKeySettingsSubmitValues,
): CreateProjectApiKeySettingsPayload {
  return data
}
