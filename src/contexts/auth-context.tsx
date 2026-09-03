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
import { loginAccount, validateAccountSession } from '@/services/auth-account.service'
import type { AccountResponse, LoginAccountRequest } from '@/types/account-types'

type AuthSessionStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  account: AccountResponse | null
  authenticatedAccount: AccountResponse | null
  isAuthenticated: boolean
  isLoadingAccount: boolean
  isCheckingSession: boolean
  status: AuthSessionStatus
  login: (data: LoginAccountRequest) => Promise<AccountResponse>
  validateSession: () => Promise<boolean>
  fetchAccountData: () => Promise<AccountResponse | null>
}

type AuthProviderProps = {
  children: ReactNode
}

const privateEntryPath = '/home'
const privatePaths = [privateEntryPath, '/projetos']
const publicPaths = new Set(['/', '/login', '/cadastro'])

const isPrivatePath = (pathname: string) =>
  privatePaths.some(
    (privatePath) => pathname === privatePath || pathname.startsWith(`${privatePath}/`),
  )

const isPublicPath = (pathname: string) => publicPaths.has(pathname)

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticatedAccount, setAuthenticatedAccount] = useState<AccountResponse | null>(null)
  const [isLoadingAccount, setIsLoadingAccount] = useState(false)
  const [status, setStatus] = useState<AuthSessionStatus>('checking')
  const authenticatedAccountRef = useRef<AccountResponse | null>(authenticatedAccount)
  const validationRequestIdRef = useRef(0)

  useEffect(() => {
    authenticatedAccountRef.current = authenticatedAccount
  }, [authenticatedAccount])

  const validateSession = useCallback(async () => {
    const validationRequestId = validationRequestIdRef.current + 1

    validationRequestIdRef.current = validationRequestId
    setStatus('checking')
    setIsLoadingAccount(true)

    try {
      const account = await validateAccountSession()

      if (validationRequestIdRef.current === validationRequestId) {
        authenticatedAccountRef.current = account
        setAuthenticatedAccount(account)
        setStatus('authenticated')
      }

      return true
    } catch {
      if (validationRequestIdRef.current === validationRequestId) {
        authenticatedAccountRef.current = null
        setAuthenticatedAccount(null)
        setStatus('unauthenticated')
      }

      return false
    } finally {
      if (validationRequestIdRef.current === validationRequestId) {
        setIsLoadingAccount(false)
      }
    }
  }, [])

  const login = useCallback(
    async (data: LoginAccountRequest) => {
      const account = await loginAccount(data)

      validationRequestIdRef.current += 1
      authenticatedAccountRef.current = account
      setAuthenticatedAccount(account)
      setIsLoadingAccount(false)
      setStatus('authenticated')
      router.replace(privateEntryPath)

      return account
    },
    [router],
  )

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

  useEffect(() => {
    let isCurrentRouteCheck = true

    async function syncSessionWithRoute() {
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
  }, [pathname, router, validateSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      account: authenticatedAccount,
      authenticatedAccount,
      isAuthenticated: status === 'authenticated',
      isLoadingAccount,
      isCheckingSession: status === 'checking',
      status,
      login,
      validateSession,
      fetchAccountData,
    }),
    [authenticatedAccount, fetchAccountData, isLoadingAccount, login, status, validateSession],
  )
  const shouldShowSessionLoading =
    status === 'checking' ||
    (status === 'authenticated' && isPublicPath(pathname)) ||
    (status === 'unauthenticated' && isPrivatePath(pathname))

  return (
    <AuthContext.Provider value={value}>
      {shouldShowSessionLoading ? <SessionLoading /> : children}
    </AuthContext.Provider>
  )
}
