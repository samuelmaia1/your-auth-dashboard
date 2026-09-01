import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls } from '@lib/api/urls'
import type { AccountResponse, CreateAccountRequest } from '@/types/account-types'
import type { ApiErrorResponse } from '@/types/api-response-types'

const defaultCreateAccountErrorMessage =
  'Não foi possível criar a conta. Revise os dados e tente novamente.'

export class CreateAccountServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultCreateAccountErrorMessage

    super(message)
    this.name = 'CreateAccountServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

function normalizeCreateAccountError(error: unknown): ApiErrorResponse {
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
      message: error.message || defaultCreateAccountErrorMessage,
      status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || defaultCreateAccountErrorMessage,
    }
  }

  return {
    message: defaultCreateAccountErrorMessage,
  }
}

export function isCreateAccountServiceError(error: unknown): error is CreateAccountServiceError {
  return error instanceof CreateAccountServiceError
}

export async function createAccount(data: CreateAccountRequest) {
  try {
    return await api.post<AccountResponse, CreateAccountRequest>(apiUrls.accounts.create, data)
  } catch (error: unknown) {
    throw new CreateAccountServiceError(normalizeCreateAccountError(error))
  }
}
