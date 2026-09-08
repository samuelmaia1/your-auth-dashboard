import type { PhoneDTO, ProjectEnvironment, ProjectStatus } from '@/types/account-types'
import type { ApiPageResponse } from '@/types/api-response-types'

export interface ProjectResponse {
  id?: string
  name?: string
  description?: string
  ownerAccountId?: string
  status?: ProjectStatus
  environment?: ProjectEnvironment
  tokenAudience?: string
  createdAt?: string
  updatedAt?: string
}

export type ProjectsPageResponse = ApiPageResponse<ProjectResponse>

export interface ProjectPasswordConfigRequest {
  minSize: number
  maxSize: number
  numberRequired: boolean
  uppercaseRequired: boolean
  lowercaseRequired: boolean
  specialCharRequired: boolean
}

export interface ProjectAuthConfigRequest {
  accessTokenExpirationMinutes: number
  refreshTokenExpirationDays: number
  sessionMode: ProjectSessionMode
  maxActiveSessions: number | null
  refreshTokenRotationEnabled: boolean
  revokeTokensOnPasswordChange: boolean
  failedLoginAttemptsLimit: number
  lockDurationMinutes: number
  requireEmailVerification: boolean
  registrationEnabled: boolean
}

export interface CreateProjectRequest {
  name: string
  description?: string
  environment: ProjectEnvironment
  tokenAudience: string
  passwordConfig: ProjectPasswordConfigRequest
  authConfig: ProjectAuthConfigRequest
}

export type ProjectUserStatus = 'ACTIVE' | 'DISABLED' | 'BLOCKED'

export interface ProjectUserResponse {
  id?: string
  projectId?: string
  email?: string
  status?: ProjectUserStatus
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
  lastPasswordChangedAt?: string
  lastFailedLoginAt?: string
  failedLoginAttempts?: number
  lockedUntil?: string
  lastLoginIpAddress?: string
  lastLoginUserAgent?: string
  phone?: PhoneDTO
}

export type ProjectUsersPageResponse = ApiPageResponse<ProjectUserResponse>

export type ProjectUserSessionStatus = 'ACTIVE' | 'INACTIVE'

export interface ProjectUserSessionResponse {
  id?: string
  projectId?: string
  userId?: string
  user?: ProjectUserResponse
  deviceName?: string
  ipAddress?: string
  userAgent?: string
  createdAt?: string
  lastUsedAt?: string
  revokedAt?: string
  status?: ProjectUserSessionStatus
}

export type ProjectUserSessionsPageResponse = ApiPageResponse<ProjectUserSessionResponse>

export interface ProjectPasswordConfigResponse {
  minSize?: number
  maxSize?: number
  numberRequired?: boolean
  uppercaseRequired?: boolean
  lowercaseRequired?: boolean
  specialCharRequired?: boolean
  validRange?: boolean
}

export type ProjectSessionMode =
  'MULTIPLE_DEVICES' | 'SINGLE_ACTIVE_SESSION' | 'LIMITED_ACTIVE_SESSIONS'

export interface ProjectAuthConfigResponse {
  accessTokenExpirationMinutes?: number
  refreshTokenExpirationDays?: number
  sessionMode?: ProjectSessionMode
  maxActiveSessions?: number | null
  refreshTokenRotationEnabled?: boolean
  revokeTokensOnPasswordChange?: boolean
  failedLoginAttemptsLimit?: number
  lockDurationMinutes?: number
  requireEmailVerification?: boolean
  registrationEnabled?: boolean
  maxActiveSessionsRequiredWhenLimited?: boolean
}

export type ProjectApiKeyScope = 'USERS_READ' | 'USERS_WRITE' | 'AUTH_LOGIN' | 'AUTH_REGISTER'

export interface CreateProjectApiKeyRequest {
  name: string
  scopes: ProjectApiKeyScope[]
  expiresInHours?: number
}

export interface AccountBasicResponse {
  id?: string
  name?: string
  lastName?: string
  email?: string
}

export interface ProjectApiKeyDetailsResponse {
  id?: string
  projectId?: string
  name?: string
  keyId?: string
  prefix?: string
  secretLastFour?: string
  environment?: string
  scopes?: ProjectApiKeyScope[]
  createdByAccountId?: string
  createdByAccount?: AccountBasicResponse
  createdAt?: string
  updatedAt?: string
  lastUsedAt?: string
  revokedAt?: string
  expiresAt?: string
}

export type ProjectApiKeysPageResponse = ApiPageResponse<ProjectApiKeyDetailsResponse>

export interface CreatedProjectApiKeyResponse {
  key?: string
  apiKey?: ProjectApiKeyDetailsResponse
}
