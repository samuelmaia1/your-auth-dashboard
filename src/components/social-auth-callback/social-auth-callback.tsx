'use client'

import { AlertCircle, ArrowLeft, LoaderCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import {
  exchangeSocialLoginCode,
  getSocialLoginErrorMessage,
  isAuthAccountServiceError,
} from '@/services/auth-account.service'
import type { AccountResponse } from '@/types/account-types'

import {
  CallbackCard,
  CallbackDescription,
  CallbackErrorMessage,
  CallbackIcon,
  CallbackLoadingIcon,
  CallbackLoginLink,
  CallbackLoginLinkContent,
  CallbackRoot,
  CallbackTitle,
} from './style'

const callbackPath = '/auth/callback'
const missingCodeMessage =
  'Não foi possível validar o retorno do login social. Inicie o login novamente.'
let activeSocialLoginCode: string | null = null
const socialLoginExchangeRequests = new Map<string, Promise<AccountResponse>>()

function replaceCallbackUrl() {
  window.history.replaceState(null, '', callbackPath)
}

function getExchangeErrorMessage(error: unknown) {
  if (isAuthAccountServiceError(error)) {
    return error.response.message ?? getSocialLoginErrorMessage('SOCIAL_LOGIN_FAILED')
  }

  return getSocialLoginErrorMessage('SOCIAL_LOGIN_FAILED')
}

function rememberSocialLoginCode(code: string) {
  activeSocialLoginCode = code
}

function clearSocialLoginCode(code: string) {
  if (activeSocialLoginCode === code) {
    activeSocialLoginCode = null
  }
}

function getSocialLoginExchangeRequest(code: string) {
  let exchangeRequest = socialLoginExchangeRequests.get(code)

  if (!exchangeRequest) {
    exchangeRequest = exchangeSocialLoginCode(code).finally(() => {
      socialLoginExchangeRequests.delete(code)
    })
    socialLoginExchangeRequests.set(code, exchangeRequest)
  }

  return exchangeRequest
}

export function SocialAuthCallback() {
  const searchParams = useSearchParams()
  const { beginSocialLoginExchange, completeSocialLogin, failSocialLoginExchange } = useAuth()
  const [exchangeErrorMessage, setExchangeErrorMessage] = useState<string | null>(null)
  const urlCode = searchParams.get('code')
  const code = urlCode ?? activeSocialLoginCode
  const errorCode = searchParams.get('error')
  const queryErrorMessage = useMemo(() => {
    if (errorCode) {
      return getSocialLoginErrorMessage(errorCode)
    }

    if (!code) {
      return missingCodeMessage
    }

    return null
  }, [code, errorCode])
  const errorMessage = exchangeErrorMessage ?? queryErrorMessage

  useEffect(() => {
    let isActiveCallback = true

    if (errorCode) {
      activeSocialLoginCode = null
      failSocialLoginExchange()
      replaceCallbackUrl()
      return () => {
        isActiveCallback = false
      }
    }

    if (!code) {
      failSocialLoginExchange()
      return () => {
        isActiveCallback = false
      }
    }

    beginSocialLoginExchange()
    rememberSocialLoginCode(code)

    if (urlCode) {
      replaceCallbackUrl()
    }

    void getSocialLoginExchangeRequest(code)
      .then(async (account) => {
        clearSocialLoginCode(code)

        if (isActiveCallback) {
          await completeSocialLogin(account)
        }
      })
      .catch((error: unknown) => {
        clearSocialLoginCode(code)

        if (isActiveCallback) {
          failSocialLoginExchange()
          setExchangeErrorMessage(getExchangeErrorMessage(error))
        }
      })

    return () => {
      isActiveCallback = false
    }
  }, [
    beginSocialLoginExchange,
    code,
    completeSocialLogin,
    errorCode,
    failSocialLoginExchange,
    urlCode,
  ])

  if (errorMessage) {
    return (
      <CallbackRoot>
        <CallbackCard aria-labelledby="social-auth-callback-title">
          <CallbackIcon $tone="error">
            <AlertCircle size={20} />
          </CallbackIcon>
          <div>
            <CallbackTitle id="social-auth-callback-title">
              Login social não concluído
            </CallbackTitle>
            <CallbackDescription>
              Não foi possível finalizar sua autenticação com o provedor.
            </CallbackDescription>
          </div>
          <CallbackErrorMessage role="alert">{errorMessage}</CallbackErrorMessage>
          <CallbackLoginLink href="/login">
            <CallbackLoginLinkContent>
              <ArrowLeft size={16} />
              Voltar ao login
            </CallbackLoginLinkContent>
          </CallbackLoginLink>
        </CallbackCard>
      </CallbackRoot>
    )
  }

  return (
    <CallbackRoot>
      <CallbackCard aria-labelledby="social-auth-callback-title" aria-live="polite">
        <CallbackLoadingIcon $tone="loading">
          <LoaderCircle size={20} />
        </CallbackLoadingIcon>
        <div>
          <CallbackTitle id="social-auth-callback-title">Concluindo login</CallbackTitle>
          <CallbackDescription>
            Estamos validando o retorno do provedor e iniciando sua sessão.
          </CallbackDescription>
        </div>
      </CallbackCard>
    </CallbackRoot>
  )
}
