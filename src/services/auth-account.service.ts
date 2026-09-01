import axios from 'axios'

import type { ApiErrorResponse } from '@/types/api-response-types'

const defaultAuthAccountErrorMessage =
  'Não foi possível autenticar a conta. Revise os dados e tente novamente.'

export class AuthAccountServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultAuthAccountErrorMessage

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
      message: error.message || defaultAuthAccountErrorMessage,
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
