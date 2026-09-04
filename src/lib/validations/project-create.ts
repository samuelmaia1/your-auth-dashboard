import { z } from 'zod'

import type { ProjectEnvironment } from '@/types/account-types'
import type {
  CreateProjectApiKeyRequest,
  CreateProjectRequest,
  ProjectApiKeyScope,
  ProjectSessionMode,
} from '@/types/project-types'

const projectEnvironmentValues = [
  'DEVELOPMENT',
  'PRODUCTION',
] as const satisfies readonly ProjectEnvironment[]
const projectSessionModeValues = [
  'MULTIPLE_DEVICES',
  'SINGLE_ACTIVE_SESSION',
  'LIMITED_ACTIVE_SESSIONS',
] as const satisfies readonly ProjectSessionMode[]
const projectApiKeyScopeValues = [
  'USERS_READ',
  'USERS_WRITE',
  'AUTH_LOGIN',
  'AUTH_REGISTER',
] as const satisfies readonly ProjectApiKeyScope[]

type IntegerTextSchemaOptions = {
  label: string
  max: number
  min: number
}

function requiredIntegerTextSchema({ label, max, min }: IntegerTextSchemaOptions) {
  return z
    .string()
    .trim()
    .min(1, `Informe ${label}.`)
    .regex(/^\d+$/, 'Use apenas números inteiros.')
    .transform(Number)
    .refine((value) => value >= min, `${label} deve ser no mínimo ${min}.`)
    .refine((value) => value <= max, `${label} deve ser no máximo ${max}.`)
}

function optionalIntegerTextSchema({ label, max, min }: IntegerTextSchemaOptions) {
  return z
    .string()
    .trim()
    .regex(/^\d*$/, 'Use apenas números inteiros.')
    .transform((value) => (value ? Number(value) : undefined))
    .refine((value) => value === undefined || value >= min, `${label} deve ser no mínimo ${min}.`)
    .refine((value) => value === undefined || value <= max, `${label} deve ser no máximo ${max}.`)
}

const optionalTrimmedTextSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .transform((value) => value || undefined)

export const projectPasswordConfigSchema = z
  .object({
    minSize: requiredIntegerTextSchema({
      label: 'o tamanho mínimo',
      min: 1,
      max: 120,
    }),
    maxSize: requiredIntegerTextSchema({
      label: 'o tamanho máximo',
      min: 1,
      max: 120,
    }),
    numberRequired: z.boolean(),
    uppercaseRequired: z.boolean(),
    lowercaseRequired: z.boolean(),
    specialCharRequired: z.boolean(),
  })
  .refine((data) => data.minSize <= data.maxSize, {
    message: 'O tamanho máximo precisa ser maior ou igual ao mínimo.',
    path: ['maxSize'],
  })

export const projectAuthConfigSchema = z
  .object({
    accessTokenExpirationMinutes: requiredIntegerTextSchema({
      label: 'a expiração do access token',
      min: 1,
      max: 1440,
    }),
    refreshTokenExpirationDays: requiredIntegerTextSchema({
      label: 'a expiração do refresh token',
      min: 1,
      max: 365,
    }),
    sessionMode: z.enum(projectSessionModeValues),
    maxActiveSessions: z.string().trim().regex(/^\d*$/, 'Use apenas números inteiros.'),
    refreshTokenRotationEnabled: z.boolean(),
    revokeTokensOnPasswordChange: z.boolean(),
    failedLoginAttemptsLimit: requiredIntegerTextSchema({
      label: 'o limite de falhas de login',
      min: 1,
      max: 20,
    }),
    lockDurationMinutes: requiredIntegerTextSchema({
      label: 'a duração do bloqueio',
      min: 1,
      max: 1440,
    }),
    requireEmailVerification: z.boolean(),
    registrationEnabled: z.boolean(),
  })
  .superRefine((data, context) => {
    if (data.sessionMode !== 'LIMITED_ACTIVE_SESSIONS') {
      return
    }

    if (!data.maxActiveSessions) {
      context.addIssue({
        code: 'custom',
        message: 'Informe o máximo de sessões ativas.',
        path: ['maxActiveSessions'],
      })
      return
    }

    const maxActiveSessions = Number(data.maxActiveSessions)

    if (maxActiveSessions < 1) {
      context.addIssue({
        code: 'custom',
        message: 'O máximo de sessões ativas deve ser no mínimo 1.',
        path: ['maxActiveSessions'],
      })
    }

    if (maxActiveSessions > 100) {
      context.addIssue({
        code: 'custom',
        message: 'O máximo de sessões ativas deve ser no máximo 100.',
        path: ['maxActiveSessions'],
      })
    }
  })
  .transform((data) => ({
    ...data,
    maxActiveSessions:
      data.sessionMode === 'LIMITED_ACTIVE_SESSIONS' ? Number(data.maxActiveSessions) : null,
  }))

export const createProjectPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do projeto.')
    .max(100, 'Use no máximo 100 caracteres.'),
  description: optionalTrimmedTextSchema(255),
  environment: z.enum(projectEnvironmentValues),
  tokenAudience: z
    .string()
    .trim()
    .min(1, 'Informe a audiência do token.')
    .max(255, 'Use no máximo 255 caracteres.'),
  passwordConfig: projectPasswordConfigSchema,
  authConfig: projectAuthConfigSchema,
})

export const createProjectApiKeyPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome da API key.')
    .max(100, 'Use no máximo 100 caracteres.'),
  scopes: z
    .array(z.enum(projectApiKeyScopeValues))
    .min(1, 'Escolha pelo menos um escopo.')
    .refine((scopes) => new Set(scopes).size === scopes.length, 'Escolha escopos únicos.'),
  expiresInHours: optionalIntegerTextSchema({
    label: 'a validade em horas',
    min: 0,
    max: 87600,
  }),
})

export const projectCreateFormSchema = createProjectPayloadSchema.extend({
  apiKey: createProjectApiKeyPayloadSchema,
})

export type ProjectCreateFormValues = z.input<typeof projectCreateFormSchema>
export type ProjectCreateSubmitValues = z.output<typeof projectCreateFormSchema>
export type CreateProjectPayload = CreateProjectRequest
export type CreateProjectApiKeyPayload = CreateProjectApiKeyRequest

export const projectCreateDefaultValues: ProjectCreateFormValues = {
  name: '',
  description: '',
  environment: 'DEVELOPMENT',
  tokenAudience: '',
  passwordConfig: {
    minSize: '8',
    maxSize: '120',
    numberRequired: true,
    uppercaseRequired: true,
    lowercaseRequired: true,
    specialCharRequired: true,
  },
  authConfig: {
    accessTokenExpirationMinutes: '15',
    refreshTokenExpirationDays: '30',
    sessionMode: 'MULTIPLE_DEVICES',
    maxActiveSessions: '',
    refreshTokenRotationEnabled: true,
    revokeTokensOnPasswordChange: true,
    failedLoginAttemptsLimit: '5',
    lockDurationMinutes: '30',
    requireEmailVerification: true,
    registrationEnabled: true,
  },
  apiKey: {
    name: 'Chave inicial',
    scopes: ['USERS_READ', 'AUTH_LOGIN'],
    expiresInHours: '720',
  },
}

export function toCreateProjectPayload(data: ProjectCreateSubmitValues): CreateProjectPayload {
  return {
    name: data.name,
    description: data.description,
    environment: data.environment,
    tokenAudience: data.tokenAudience,
    passwordConfig: data.passwordConfig,
    authConfig: data.authConfig,
  }
}

export function toCreateProjectApiKeyPayload(
  data: ProjectCreateSubmitValues,
): CreateProjectApiKeyPayload {
  return data.apiKey
}
