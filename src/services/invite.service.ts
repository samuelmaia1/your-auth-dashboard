import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls } from '@lib/api/urls'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type {
  ProjectInviteResponse,
  ProjectInvitesPageResponse,
  SendProjectInviteRequest,
} from '@/types/invite-types'

type GetReceivedInvitesParams = {
  page: number
  size: number
}

const defaultInviteErrorMessage =
  'Não foi possível concluir a operação com o convite. Tente novamente em alguns instantes.'
const receivedInvitePageSize = 100

export class InviteServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultInviteErrorMessage

    super(message)
    this.name = 'InviteServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

function normalizeInviteError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data

    if (isApiErrorResponse(data)) {
      return {
        ...data,
        status: data.status ?? status,
      }
    }

    if (typeof data === 'string' && data.trim()) {
      return {
        message: data,
        status,
      }
    }

    return {
      message: error.message || defaultInviteErrorMessage,
      status,
    }
  }

  if (error instanceof Error) {
    return { message: error.message || defaultInviteErrorMessage }
  }

  return { message: defaultInviteErrorMessage }
}

function toInviteServiceError(error: unknown) {
  return new InviteServiceError(normalizeInviteError(error))
}

export function isInviteServiceError(error: unknown): error is InviteServiceError {
  return error instanceof InviteServiceError
}

export async function sendProjectInvite({
  data,
  projectId,
}: {
  data: SendProjectInviteRequest
  projectId: string
}) {
  try {
    return await api.post<ProjectInviteResponse, SendProjectInviteRequest>(
      apiUrls.projects.invites.send(projectId),
      data,
    )
  } catch (error: unknown) {
    throw toInviteServiceError(error)
  }
}

export async function getReceivedInvites({ page, size }: GetReceivedInvitesParams) {
  try {
    return await api.get<ProjectInvitesPageResponse>(apiUrls.invites.received, {
      params: { page, size },
    })
  } catch (error: unknown) {
    throw toInviteServiceError(error)
  }
}

export async function getAllPendingReceivedInvites() {
  const firstPage = await getReceivedInvites({ page: 0, size: receivedInvitePageSize })
  const totalPages = Math.max(firstPage.totalPages ?? 1, 1)
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) =>
      getReceivedInvites({ page: index + 1, size: receivedInvitePageSize }),
    ),
  )

  const pendingInvites = [firstPage, ...remainingPages]
    .flatMap((page) => page.content ?? [])
    .filter((invite) => invite.status === 'PENDING')

  return pendingInvites
}

export async function acceptReceivedInvite(inviteId: string) {
  try {
    return await api.post<ProjectInviteResponse>(apiUrls.invites.accept(inviteId))
  } catch (error: unknown) {
    throw toInviteServiceError(error)
  }
}
