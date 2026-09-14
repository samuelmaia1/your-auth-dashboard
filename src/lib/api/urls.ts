export type BackendUrl = `/${string}`

export type SocialProvider = 'google' | 'github'

const pathParam = (value: string | number) => encodeURIComponent(String(value))

export const normalizeApiBaseUrl = (baseUrl?: string) => {
  const trimmedBaseUrl = baseUrl?.trim()

  if (!trimmedBaseUrl) {
    return ''
  }

  if (trimmedBaseUrl.startsWith('/')) {
    return trimmedBaseUrl.replace(/\/+$/, '') || '/'
  }

  const normalizedBaseUrl = /^https?:\/\//i.test(trimmedBaseUrl)
    ? trimmedBaseUrl
    : `http://${trimmedBaseUrl}`

  return normalizedBaseUrl.replace(/\/+$/, '')
}

export const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL)

export const buildBackendUrl = (path: BackendUrl) => {
  if (!apiBaseUrl || apiBaseUrl === '/') {
    return path
  }

  return `${apiBaseUrl}${path}`
}

export const apiUrls = {
  accounts: {
    byEmail: '/accounts',
    create: '/accounts/create',
    me: '/accounts/me',
    summary: '/accounts/me/summary',
    subscription: '/accounts/me/subscription',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    socialAuthorization: (provider: SocialProvider) =>
      `/oauth2/authorization/${provider}` as BackendUrl,
    socialExchange: '/auth/social/exchange',
    mobileLogin: '/auth/mobile/login',
    mobileRefresh: '/auth/mobile/refresh',
  },
  projects: {
    list: '/projects',
    create: '/projects/create',
    byId: (id: string | number) => `/projects/${pathParam(id)}` as BackendUrl,
    passwordConfig: (id: string | number) =>
      `/projects/${pathParam(id)}/password-config` as BackendUrl,
    authConfig: (projectId: string | number) =>
      `/projects/${pathParam(projectId)}/auth-config` as BackendUrl,
    apiKeys: {
      list: (projectId: string | number) =>
        `/projects/${pathParam(projectId)}/api-keys` as BackendUrl,
      byId: (projectId: string | number, apiKeyId: string | number) =>
        `/projects/${pathParam(projectId)}/api-keys/${pathParam(apiKeyId)}` as BackendUrl,
      revoke: (projectId: string | number, apiKeyId: string | number) =>
        `/projects/${pathParam(projectId)}/api-keys/${pathParam(apiKeyId)}/revoke` as BackendUrl,
    },
    sessions: {
      list: (projectId: string | number) =>
        `/projects/${pathParam(projectId)}/sessions` as BackendUrl,
    },
    users: {
      list: (projectId: string | number) => `/projects/${pathParam(projectId)}/users` as BackendUrl,
      byId: (projectId: string | number, userId: string | number) =>
        `/projects/${pathParam(projectId)}/users/${pathParam(userId)}` as BackendUrl,
      sessions: {
        list: (projectId: string | number, userId: string | number) =>
          `/projects/${pathParam(projectId)}/users/${pathParam(userId)}/sessions` as BackendUrl,
        byId: (projectId: string | number, userId: string | number, sessionId: string | number) =>
          `/projects/${pathParam(projectId)}/users/${pathParam(userId)}/sessions/${pathParam(
            sessionId,
          )}` as BackendUrl,
      },
    },
    members: {
      list: (projectId: string | number) =>
        `/projects/${pathParam(projectId)}/members` as BackendUrl,
      byAccountId: (projectId: string | number, accountId: string | number) =>
        `/projects/${pathParam(projectId)}/members/${pathParam(accountId)}` as BackendUrl,
    },
    invites: {
      send: (projectId: string | number) =>
        `/projects/${pathParam(projectId)}/invites` as BackendUrl,
    },
  },
  invites: {
    received: '/invites/received',
    accept: (inviteId: string | number) => `/invites/${pathParam(inviteId)}/accept` as BackendUrl,
  },
  plans: {
    list: '/plans',
  },
  users: {
    create: '/users',
    login: '/users/login',
    logout: '/users/logout',
    refresh: '/users/refresh',
  },
} as const satisfies Record<string, unknown>
