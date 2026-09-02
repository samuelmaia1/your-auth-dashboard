export type BackendUrl = `/${string}`

const pathParam = (value: string | number) => encodeURIComponent(String(value))

export const apiUrls = {
  accounts: {
    create: '/accounts/create',
    me: '/accounts/me',
    summary: '/accounts/me/summary',
  },
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
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
    users: {
      list: (projectId: string | number) => `/projects/${pathParam(projectId)}/users` as BackendUrl,
      byId: (projectId: string | number, userId: string | number) =>
        `/projects/${pathParam(projectId)}/users/${pathParam(userId)}` as BackendUrl,
    },
  },
  users: {
    create: '/users',
    login: '/users/login',
    logout: '/users/logout',
    refresh: '/users/refresh',
  },
} as const satisfies Record<string, unknown>
