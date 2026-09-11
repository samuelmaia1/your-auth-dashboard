import type { ApiPageResponse } from '@/types/api-response-types'

export type ProjectInviteRole = 'ADMIN' | 'DEVELOPER' | 'VIEWER'

export type ProjectInviteStatus = 'PENDING' | 'ACCEPTED' | 'REFUSED'

export interface SendProjectInviteRequest {
  recipientAccountId: string
  role: ProjectInviteRole
}

export interface ProjectInviteResponse {
  id?: string
  senderAccountId?: string
  recipientAccountId?: string
  role?: ProjectInviteRole
  status?: ProjectInviteStatus
  sentAt?: string
  projectId?: string
  projectName?: string
  projectDescription?: string
}

export type ProjectInvitesPageResponse = ApiPageResponse<ProjectInviteResponse>
