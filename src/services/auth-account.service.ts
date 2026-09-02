import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls } from '@lib/api/urls'
import type { AccountResponse, LoginAccountRequest } from '@/types/account-types'
import type { ApiErrorResponse } from '@/types/api-response-types'

const defaultAuthAccountErrorMessage =
  'Não foi possível autenticar a conta. Revise os dados e tente novamente.'

const authAccountErrorMessagesByStatus: Record<number, string> = {
  400: 'Não foi possível validar os dados de login. Revise os campos e tente novamente.',
  401: 'E-mail ou senha inválidos. Confira suas credenciais e tente novamente.',
  500: 'Não foi possível iniciar sua sessão agora. Tente novamente em alguns instantes.',
}

function getDefaultAuthAccountErrorMessage(status?: number) {
  if (!status) {
    return defaultAuthAccountErrorMessage
  }

  return authAccountErrorMessagesByStatus[status] ?? defaultAuthAccountErrorMessage
}

export class AuthAccountServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message =
      response.message || response.error || getDefaultAuthAccountErrorMessage(response.status)

    super(message)
    this.name = 'AuthAccountServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

export function isAuthAccountServiceError(error: unknown): error is AuthAccountServiceError {
  return error instanceof AuthAccountServiceError
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

export function normalizeAuthAccountError(error: unknown): ApiErrorResponse {
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
      message: status
        ? getDefaultAuthAccountErrorMessage(status)
        : error.message || defaultAuthAccountErrorMessage,
      status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || defaultAuthAccountErrorMessage,
    }
  }

  return {
    message: defaultAuthAccountErrorMessage,
  }
}

export async function loginAccount(data: LoginAccountRequest) {
  try {
    const response = await api.post<AccountResponse, LoginAccountRequest>(apiUrls.auth.login, data)

    return response
  } catch (error: unknown) {
    throw new AuthAccountServiceError(normalizeAuthAccountError(error))
  }
}

export async function validateAccountSession() {
  try {
    return await api.get<AccountResponse>(apiUrls.accounts.me)
  } catch (error: unknown) {
    throw new AuthAccountServiceError(normalizeAuthAccountError(error))
  }
}
