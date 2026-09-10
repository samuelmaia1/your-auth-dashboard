import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls } from '@lib/api/urls'
import type {
  AccountBasicResponse,
  AccountResponse,
  AccountSummaryResponse,
  CreateAccountRequest,
} from '@/types/account-types'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type { AccountSubscriptionResponse } from '@/types/plan-types'

const defaultCreateAccountErrorMessage =
  'Não foi possível criar a conta. Revise os dados e tente novamente.'
const defaultAccountSummaryErrorMessage =
  'Não foi possível carregar o resumo da conta. Tente novamente em alguns instantes.'
const defaultAccountSubscriptionErrorMessage =
  'Não foi possível carregar a assinatura da conta. Tente novamente em alguns instantes.'
const defaultAccountLookupErrorMessage =
  'Não foi possível pesquisar a conta. Tente novamente em alguns instantes.'

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

export class AccountSummaryServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultAccountSummaryErrorMessage

    super(message)
    this.name = 'AccountSummaryServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

export class AccountSubscriptionServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultAccountSubscriptionErrorMessage

    super(message)
    this.name = 'AccountSubscriptionServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

export class AccountLookupServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultAccountLookupErrorMessage

    super(message)
    this.name = 'AccountLookupServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

function normalizeAccountError(error: unknown, defaultMessage: string): ApiErrorResponse {
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

function normalizeCreateAccountError(error: unknown): ApiErrorResponse {
  return normalizeAccountError(error, defaultCreateAccountErrorMessage)
}

function normalizeAccountSummaryError(error: unknown): ApiErrorResponse {
  return normalizeAccountError(error, defaultAccountSummaryErrorMessage)
}

function normalizeAccountSubscriptionError(error: unknown): ApiErrorResponse {
  return normalizeAccountError(error, defaultAccountSubscriptionErrorMessage)
}

export function isCreateAccountServiceError(error: unknown): error is CreateAccountServiceError {
  return error instanceof CreateAccountServiceError
}

export function isAccountSummaryServiceError(error: unknown): error is AccountSummaryServiceError {
  return error instanceof AccountSummaryServiceError
}

export function isAccountSubscriptionServiceError(
  error: unknown,
): error is AccountSubscriptionServiceError {
  return error instanceof AccountSubscriptionServiceError
}

export function isAccountLookupServiceError(error: unknown): error is AccountLookupServiceError {
  return error instanceof AccountLookupServiceError
}

export async function createAccount(data: CreateAccountRequest) {
  try {
    return await api.post<AccountResponse, CreateAccountRequest>(apiUrls.accounts.create, data)
  } catch (error: unknown) {
    throw new CreateAccountServiceError(normalizeCreateAccountError(error))
  }
}

export async function getAccountSummary() {
  try {
    return await api.get<AccountSummaryResponse>(apiUrls.accounts.summary)
  } catch (error: unknown) {
    throw new AccountSummaryServiceError(normalizeAccountSummaryError(error))
  }
}

export async function getAccountSubscription() {
  try {
    return await api.get<AccountSubscriptionResponse>(apiUrls.accounts.subscription)
  } catch (error: unknown) {
    throw new AccountSubscriptionServiceError(normalizeAccountSubscriptionError(error))
  }
}

export async function findAccountByEmail(email: string) {
  try {
    return await api.get<AccountBasicResponse>(apiUrls.accounts.byEmail, {
      params: { email },
    })
  } catch (error: unknown) {
    throw new AccountLookupServiceError(
      normalizeAccountError(error, defaultAccountLookupErrorMessage),
    )
  }
}
