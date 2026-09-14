import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls, buildBackendUrl, type SocialProvider } from '@lib/api/urls'
import type { AccountResponse, LoginAccountRequest } from '@/types/account-types'
import type { ApiErrorResponse } from '@/types/api-response-types'

const defaultAuthAccountErrorMessage =
  'Não foi possível autenticar a conta. Revise os dados e tente novamente.'
const defaultLogoutAccountErrorMessage =
  'Não foi possível encerrar sua sessão. Tente novamente em alguns instantes.'
const defaultSocialLoginErrorMessage = 'Não foi possível concluir o login social.'

type AuthAccountErrorMessageConfig = {
  defaultMessage: string
  messagesByStatus: Record<number, string>
}

type SocialLoginExchangeRequest = {
  code: string
}

export type SocialLoginErrorCode =
  | 'SOCIAL_LOGIN_DENIED'
  | 'SOCIAL_PROVIDER_ERROR'
  | 'SOCIAL_EMAIL_UNAVAILABLE'
  | 'SOCIAL_EMAIL_NOT_VERIFIED'
  | 'SOCIAL_ACCOUNT_DISABLED'
  | 'SOCIAL_LOGIN_FAILED'
  | 'SOCIAL_CODE_INVALID'

const authAccountErrorMessagesByStatus: Record<number, string> = {
  400: 'Não foi possível validar os dados de login. Revise os campos e tente novamente.',
  401: 'E-mail ou senha inválidos. Confira suas credenciais e tente novamente.',
  500: 'Não foi possível iniciar sua sessão agora. Tente novamente em alguns instantes.',
}

const logoutAccountErrorMessagesByStatus: Record<number, string> = {
  400: 'Não foi possível encontrar uma sessão ativa para encerrar.',
  401: 'Sua sessão não pôde ser validada para logout.',
  500: 'Não foi possível encerrar sua sessão agora. Tente novamente em alguns instantes.',
}

const socialLoginErrorMessagesByCode: Record<SocialLoginErrorCode, string> = {
  SOCIAL_LOGIN_DENIED: 'Você cancelou a autorização do login social.',
  SOCIAL_PROVIDER_ERROR: 'Não foi possível concluir a autenticação com o provedor.',
  SOCIAL_EMAIL_UNAVAILABLE: 'Não foi possível obter um e-mail válido da sua conta.',
  SOCIAL_EMAIL_NOT_VERIFIED: 'Seu e-mail no provedor ainda não foi verificado.',
  SOCIAL_ACCOUNT_DISABLED: 'Esta conta está desativada.',
  SOCIAL_LOGIN_FAILED: defaultSocialLoginErrorMessage,
  SOCIAL_CODE_INVALID:
    'O link de autenticação expirou ou já foi utilizado. Inicie o login novamente.',
}

const authAccountErrorMessageConfig: AuthAccountErrorMessageConfig = {
  defaultMessage: defaultAuthAccountErrorMessage,
  messagesByStatus: authAccountErrorMessagesByStatus,
}

const logoutAccountErrorMessageConfig: AuthAccountErrorMessageConfig = {
  defaultMessage: defaultLogoutAccountErrorMessage,
  messagesByStatus: logoutAccountErrorMessagesByStatus,
}

const socialLoginExchangeErrorMessageConfig: AuthAccountErrorMessageConfig = {
  defaultMessage: defaultSocialLoginErrorMessage,
  messagesByStatus: {
    400: 'Não foi possível validar o retorno do login social. Inicie o login novamente.',
    401: socialLoginErrorMessagesByCode.SOCIAL_CODE_INVALID,
    500: 'Não foi possível iniciar sua sessão social agora. Tente novamente em alguns instantes.',
  },
}

function getDefaultAuthAccountErrorMessage(
  status?: number,
  config = authAccountErrorMessageConfig,
) {
  if (!status) {
    return config.defaultMessage
  }

  return config.messagesByStatus[status] ?? config.defaultMessage
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

function isSocialLoginErrorCode(value: unknown): value is SocialLoginErrorCode {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(socialLoginErrorMessagesByCode, value)
  )
}

export function getSocialLoginErrorMessage(code?: string | null) {
  if (isSocialLoginErrorCode(code)) {
    return socialLoginErrorMessagesByCode[code]
  }

  return defaultSocialLoginErrorMessage
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

export function normalizeAuthAccountError(
  error: unknown,
  config = authAccountErrorMessageConfig,
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
      message: status
        ? getDefaultAuthAccountErrorMessage(status, config)
        : error.message || config.defaultMessage,
      status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || config.defaultMessage,
    }
  }

  return {
    message: config.defaultMessage,
  }
}

function normalizeSocialLoginExchangeError(error: unknown) {
  const normalizedError = normalizeAuthAccountError(error, socialLoginExchangeErrorMessageConfig)
  const knownErrorCode = [normalizedError.error, normalizedError.message].find(
    isSocialLoginErrorCode,
  )

  if (!knownErrorCode) {
    return normalizedError
  }

  return {
    ...normalizedError,
    message: getSocialLoginErrorMessage(knownErrorCode),
  }
}

export function getSocialLoginUrl(provider: SocialProvider) {
  return buildBackendUrl(apiUrls.auth.socialAuthorization(provider))
}

export function startSocialLogin(provider: SocialProvider) {
  const redirectUrl = getSocialLoginUrl(provider)

  window.location.assign(redirectUrl)
}

export async function loginAccount(data: LoginAccountRequest) {
  try {
    return await api.post<AccountResponse, LoginAccountRequest>(apiUrls.auth.login, data)
  } catch (error: unknown) {
    throw new AuthAccountServiceError(normalizeAuthAccountError(error))
  }
}

export async function exchangeSocialLoginCode(code: string) {
  try {
    return await api.post<AccountResponse, SocialLoginExchangeRequest>(
      apiUrls.auth.socialExchange,
      { code },
      { withCredentials: true },
    )
  } catch (error: unknown) {
    throw new AuthAccountServiceError(normalizeSocialLoginExchangeError(error))
  }
}

export async function validateAccountSession() {
  try {
    return await api.get<AccountResponse>(apiUrls.accounts.me)
  } catch (error: unknown) {
    throw new AuthAccountServiceError(normalizeAuthAccountError(error))
  }
}

export async function logoutAccountSession() {
  try {
    await api.post<void>(apiUrls.auth.logout)
  } catch (error: unknown) {
    throw new AuthAccountServiceError(
      normalizeAuthAccountError(error, logoutAccountErrorMessageConfig),
    )
  }
}
