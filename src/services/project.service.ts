import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls } from '@lib/api/urls'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type {
  CreateProjectApiKeyRequest,
  CreateProjectRequest,
  CreatedProjectApiKeyResponse,
  ProjectApiKeysPageResponse,
  ProjectAuthConfigResponse,
  ProjectPasswordConfigResponse,
  ProjectsPageResponse,
  ProjectResponse,
  ProjectUsersPageResponse,
  ProjectUserSessionsPageResponse,
  ProjectUserSessionStatus,
} from '@/types/project-types'

type GetProjectsParams = {
  page: number
  size: number
}

type GetProjectPageResourceParams = {
  projectId: string
  page: number
  size: number
}

type GetProjectSessionsParams = GetProjectPageResourceParams & {
  lastUsedAtFrom?: string
  lastUsedAtTo?: string
  status?: ProjectUserSessionStatus
  userEmail?: string
}

type GetProjectUsersParams = GetProjectPageResourceParams & {
  email?: string
}

type GetProjectApiKeysParams = GetProjectPageResourceParams & {
  createdBy?: string
}

const defaultProjectsErrorMessage =
  'Não foi possível carregar os projetos. Tente novamente em alguns instantes.'
const defaultProjectDetailsErrorMessage =
  'Não foi possível carregar o projeto. Tente novamente em alguns instantes.'
const defaultProjectSessionsErrorMessage =
  'Não foi possível carregar as sessões do projeto. Tente novamente em alguns instantes.'
const defaultProjectUsersErrorMessage =
  'Não foi possível carregar os usuários do projeto. Tente novamente em alguns instantes.'
const defaultProjectPasswordConfigErrorMessage =
  'Não foi possível carregar a política de senha. Tente novamente em alguns instantes.'
const defaultProjectAuthConfigErrorMessage =
  'Não foi possível carregar a política de autenticação. Tente novamente em alguns instantes.'
const defaultProjectApiKeysErrorMessage =
  'Não foi possível carregar as API keys do projeto. Tente novamente em alguns instantes.'
const defaultCreateProjectErrorMessage =
  'Não foi possível criar o projeto. Revise os dados e tente novamente.'
const defaultCreateProjectApiKeyErrorMessage =
  'Não foi possível gerar a API key do projeto. Revise os dados e tente novamente.'

export class ProjectsServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse, fallbackMessage = defaultProjectsErrorMessage) {
    const message = response.message || response.error || fallbackMessage

    super(message)
    this.name = 'ProjectsServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

function normalizeProjectsError(
  error: unknown,
  defaultMessage = defaultProjectsErrorMessage,
): ApiErrorResponse {
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
      message: error.message || defaultMessage,
      status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
    }
  }

  return {
    message: defaultMessage,
  }
}

export function isProjectsServiceError(error: unknown): error is ProjectsServiceError {
  return error instanceof ProjectsServiceError
}

export async function getProjects({ page, size }: GetProjectsParams) {
  try {
    return await api.get<ProjectsPageResponse>(apiUrls.projects.list, {
      params: {
        page,
        size,
      },
    })
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectsErrorMessage),
      defaultProjectsErrorMessage,
    )
  }
}

export async function createProject(data: CreateProjectRequest) {
  try {
    return await api.post<ProjectResponse, CreateProjectRequest>(apiUrls.projects.create, data)
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultCreateProjectErrorMessage),
      defaultCreateProjectErrorMessage,
    )
  }
}

export async function getProjectById(projectId: string) {
  try {
    return await api.get<ProjectResponse>(apiUrls.projects.byId(projectId))
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectDetailsErrorMessage),
      defaultProjectDetailsErrorMessage,
    )
  }
}

export async function createProjectApiKey({
  data,
  projectId,
}: {
  data: CreateProjectApiKeyRequest
  projectId: string
}) {
  try {
    return await api.post<CreatedProjectApiKeyResponse, CreateProjectApiKeyRequest>(
      apiUrls.projects.apiKeys.list(projectId),
      data,
    )
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultCreateProjectApiKeyErrorMessage),
      defaultCreateProjectApiKeyErrorMessage,
    )
  }
}

export async function getProjectSessions({
  lastUsedAtFrom,
  lastUsedAtTo,
  page,
  projectId,
  size,
  status,
  userEmail,
}: GetProjectSessionsParams) {
  try {
    return await api.get<ProjectUserSessionsPageResponse>(
      apiUrls.projects.sessions.list(projectId),
      {
        params: {
          lastUsedAtFrom,
          lastUsedAtTo,
          page,
          size,
          status,
          userEmail,
        },
      },
    )
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectSessionsErrorMessage),
      defaultProjectSessionsErrorMessage,
    )
  }
}

export async function getProjectUsers({ email, page, projectId, size }: GetProjectUsersParams) {
  try {
    return await api.get<ProjectUsersPageResponse>(apiUrls.projects.users.list(projectId), {
      params: {
        email,
        page,
        size,
      },
    })
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectUsersErrorMessage),
      defaultProjectUsersErrorMessage,
    )
  }
}

export async function getProjectPasswordConfig(projectId: string) {
  try {
    return await api.get<ProjectPasswordConfigResponse>(apiUrls.projects.passwordConfig(projectId))
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectPasswordConfigErrorMessage),
      defaultProjectPasswordConfigErrorMessage,
    )
  }
}

export async function getProjectAuthConfig(projectId: string) {
  try {
    return await api.get<ProjectAuthConfigResponse>(apiUrls.projects.authConfig(projectId))
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectAuthConfigErrorMessage),
      defaultProjectAuthConfigErrorMessage,
    )
  }
}

export async function getProjectApiKeys({
  createdBy,
  page,
  projectId,
  size,
}: GetProjectApiKeysParams) {
  try {
    return await api.get<ProjectApiKeysPageResponse>(apiUrls.projects.apiKeys.list(projectId), {
      params: {
        createdBy,
        page,
        size,
      },
    })
  } catch (error: unknown) {
    throw new ProjectsServiceError(
      normalizeProjectsError(error, defaultProjectApiKeysErrorMessage),
      defaultProjectApiKeysErrorMessage,
    )
  }
}
