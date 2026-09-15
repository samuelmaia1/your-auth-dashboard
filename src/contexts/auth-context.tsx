'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { SessionLoading } from '@components/session-loading'
import {
  loginAccount,
  logoutAccountSession,
  validateAccountSession,
} from '@/services/auth-account.service'
import { subscribeToAuthSessionRejection } from '@lib/api/axios'
import type { AccountResponse, LoginAccountRequest } from '@/types/account-types'

type AuthSessionStatus =
  'initializing' | 'exchanging-social-code' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  account: AccountResponse | null
  authenticatedAccount: AccountResponse | null
  isAuthenticated: boolean
  isLoadingAccount: boolean
  isCheckingSession: boolean
  status: AuthSessionStatus
  login: (data: LoginAccountRequest) => Promise<AccountResponse>
  beginSocialLoginExchange: () => void
  completeSocialLogin: (account: AccountResponse) => Promise<void>
  failSocialLoginExchange: () => void
  logout: () => Promise<void>
  validateSession: () => Promise<boolean>
  fetchAccountData: () => Promise<AccountResponse | null>
}

type AuthProviderProps = {
  children: ReactNode
}

const privateEntryPath = '/home'
const socialCallbackPath = '/auth/callback'
const privatePaths = [privateEntryPath, '/projetos', '/assinatura', '/planos']
const publicPaths = new Set(['/', '/login', '/cadastro', '/auth/callback'])
const sharedPaths = ['/docs']
let sessionValidationRequest: Promise<AccountResponse> | null = null

const isPrivatePath = (pathname: string) =>
  privatePaths.some(
    (privatePath) => pathname === privatePath || pathname.startsWith(`${privatePath}/`),
  )

const isPublicPath = (pathname: string) => publicPaths.has(pathname)
const isSharedPath = (pathname: string) =>
  sharedPaths.some((sharedPath) => pathname === sharedPath || pathname.startsWith(`${sharedPath}/`))
const isSocialCallbackPath = (pathname: string) => pathname === socialCallbackPath
const isSessionValidationSuccessStillRelevant = (status: AuthSessionStatus) =>
  status === 'initializing' || status === 'authenticated'

function getSessionValidationRequest() {
  if (sessionValidationRequest) {
    return sessionValidationRequest
  }

  sessionValidationRequest = validateAccountSession().finally(() => {
    sessionValidationRequest = null
  })

  return sessionValidationRequest
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticatedAccount, setAuthenticatedAccount] = useState<AccountResponse | null>(null)
  const [isLoadingAccount, setIsLoadingAccount] = useState(false)
  const [status, setStatus] = useState<AuthSessionStatus>('initializing')
  const authenticatedAccountRef = useRef<AccountResponse | null>(authenticatedAccount)
  const statusRef = useRef<AuthSessionStatus>('initializing')
  const pathnameRef = useRef(pathname)
  const validationRequestIdRef = useRef(0)

  useEffect(() => {
    authenticatedAccountRef.current = authenticatedAccount
  }, [authenticatedAccount])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  const clearAuthenticatedSession = useCallback(
    ({ redirectToPublicEntry = false } = {}) => {
      const isAlreadyUnauthenticated =
        statusRef.current === 'unauthenticated' && !authenticatedAccountRef.current

      if (!isAlreadyUnauthenticated) {
        validationRequestIdRef.current += 1
        authenticatedAccountRef.current = null
        statusRef.current = 'unauthenticated'
        setAuthenticatedAccount(null)
        setIsLoadingAccount(false)
        setStatus('unauthenticated')
      }

      if (redirectToPublicEntry && pathnameRef.current !== '/') {
        router.replace('/')
      }
    },
    [router],
  )

  const setAuthenticatedSession = useCallback(
    (account: AccountResponse) => {
      validationRequestIdRef.current += 1
      authenticatedAccountRef.current = account
      statusRef.current = 'authenticated'
      setAuthenticatedAccount(account)
      setIsLoadingAccount(false)
      setStatus('authenticated')
      router.replace(privateEntryPath)
    },
    [router],
  )

  const beginSocialLoginExchange = useCallback(() => {
    validationRequestIdRef.current += 1
    setIsLoadingAccount(false)
    statusRef.current = 'exchanging-social-code'
    setStatus('exchanging-social-code')
  }, [])

  const failSocialLoginExchange = useCallback(() => {
    clearAuthenticatedSession()
  }, [clearAuthenticatedSession])

  const validateSession = useCallback(async () => {
    const validationRequestId = validationRequestIdRef.current + 1

    validationRequestIdRef.current = validationRequestId
    statusRef.current = 'initializing'
    setStatus('initializing')
    setIsLoadingAccount(true)

    try {
      const account = await getSessionValidationRequest()

      if (validationRequestIdRef.current === validationRequestId) {
        authenticatedAccountRef.current = account
        statusRef.current = 'authenticated'
        setAuthenticatedAccount(account)
        setStatus('authenticated')
      }

      const isStillRelevant = isSessionValidationSuccessStillRelevant(statusRef.current)

      return isStillRelevant
    } catch {
      if (validationRequestIdRef.current === validationRequestId) {
        clearAuthenticatedSession()
      }

      return false
    } finally {
      if (validationRequestIdRef.current === validationRequestId) {
        setIsLoadingAccount(false)
      }
    }
  }, [clearAuthenticatedSession])

  const login = useCallback(
    async (data: LoginAccountRequest) => {
      const account = await loginAccount(data)

      setAuthenticatedSession(account)

      return account
    },
    [setAuthenticatedSession],
  )

  const completeSocialLogin = useCallback(
    async (account: AccountResponse) => {
      const validationRequestId = validationRequestIdRef.current + 1

      validationRequestIdRef.current = validationRequestId
      authenticatedAccountRef.current = account
      setAuthenticatedAccount(account)
      setIsLoadingAccount(true)
      statusRef.current = 'exchanging-social-code'
      setStatus('exchanging-social-code')

      try {
        const validatedAccount = await getSessionValidationRequest()

        if (validationRequestIdRef.current === validationRequestId) {
          authenticatedAccountRef.current = validatedAccount
          statusRef.current = 'authenticated'
          setAuthenticatedAccount(validatedAccount)
          setStatus('authenticated')
          router.replace(privateEntryPath)
        }
      } catch (error: unknown) {
        if (validationRequestIdRef.current === validationRequestId) {
          clearAuthenticatedSession()
        }

        throw error
      } finally {
        if (validationRequestIdRef.current === validationRequestId) {
          setIsLoadingAccount(false)
        }
      }
    },
    [clearAuthenticatedSession, router],
  )

  const logout = useCallback(async () => {
    setIsLoadingAccount(true)

    try {
      await logoutAccountSession()

      clearAuthenticatedSession({ redirectToPublicEntry: true })
    } finally {
      setIsLoadingAccount(false)
    }
  }, [clearAuthenticatedSession])

  const fetchAccountData = useCallback(async () => {
    if (authenticatedAccountRef.current) {
      return authenticatedAccountRef.current
    }

    const hasValidSession = await validateSession()

    if (!hasValidSession) {
      return null
    }

    return authenticatedAccountRef.current
  }, [validateSession])

  useEffect(
    () =>
      subscribeToAuthSessionRejection(() => {
        clearAuthenticatedSession({
          redirectToPublicEntry: isPrivatePath(pathnameRef.current),
        })
      }),
    [clearAuthenticatedSession],
  )

  useEffect(() => {
    let isCurrentRouteCheck = true

    async function syncSessionWithRoute() {
      if (isSocialCallbackPath(pathname)) {
        beginSocialLoginExchange()
        return
      }

      if (authenticatedAccountRef.current) {
        if (isPublicPath(pathname)) {
          router.replace(privateEntryPath)
        }

        return
      }

      const hasValidSession = await validateSession()

      if (!isCurrentRouteCheck) {
        return
      }

      if (hasValidSession && isPublicPath(pathname)) {
        router.replace(privateEntryPath)
        return
      }

      if (!hasValidSession && isPrivatePath(pathname)) {
        router.replace('/')
      }
    }

    void syncSessionWithRoute()

    return () => {
      isCurrentRouteCheck = false
    }
  }, [beginSocialLoginExchange, pathname, router, validateSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      account: authenticatedAccount,
      authenticatedAccount,
      isAuthenticated: status === 'authenticated',
      isLoadingAccount,
      isCheckingSession: status === 'initializing' || status === 'exchanging-social-code',
      status,
      login,
      beginSocialLoginExchange,
      completeSocialLogin,
      failSocialLoginExchange,
      logout,
      validateSession,
      fetchAccountData,
    }),
    [
      authenticatedAccount,
      beginSocialLoginExchange,
      fetchAccountData,
      failSocialLoginExchange,
      isLoadingAccount,
      completeSocialLogin,
      login,
      logout,
      status,
      validateSession,
    ],
  )
  const isCurrentSocialCallbackPath = isSocialCallbackPath(pathname)
  const isCurrentSharedPath = isSharedPath(pathname)
  const isWaitingForSession = status === 'initializing' || status === 'exchanging-social-code'
  const shouldShowSessionLoading =
    !isCurrentSocialCallbackPath &&
    !isCurrentSharedPath &&
    (isWaitingForSession ||
      (status === 'authenticated' && isPublicPath(pathname)) ||
      (status === 'unauthenticated' && isPrivatePath(pathname)))

  return (
    <AuthContext.Provider value={value}>
      {shouldShowSessionLoading ? <SessionLoading /> : children}
    </AuthContext.Provider>
  )
}
