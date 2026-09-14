import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { apiBaseUrl, apiUrls, type BackendUrl } from '@lib/api/urls'

type ApiRequestConfig<Data = unknown> = Omit<AxiosRequestConfig<Data>, 'data' | 'method' | 'url'>

type ApiRequestWithUrl<Data = unknown> = AxiosRequestConfig<Data> & {
  url: BackendUrl
}

interface RetriableRequestConfig<Data = unknown> extends AxiosRequestConfig<Data> {
  _retry?: boolean
}

const baseURL = apiBaseUrl || undefined
const authSessionRejectionListeners = new Set<() => void>()

export const axiosClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

let refreshRequest: Promise<AxiosResponse<unknown>> | null = null

function notifyAuthSessionRejection() {
  authSessionRejectionListeners.forEach((listener) => listener())
}

const refreshSession = () => {
  if (refreshRequest) {
    return refreshRequest
  }

  refreshRequest ??= refreshClient
    .post(apiUrls.auth.refresh)
    .catch((error: unknown) => {
      notifyAuthSessionRejection()
      throw error
    })
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}

const nonRefreshableUrls = [
  apiUrls.accounts.create,
  apiUrls.auth.login,
  apiUrls.auth.logout,
  apiUrls.auth.refresh,
  apiUrls.auth.socialExchange,
  apiUrls.auth.mobileLogin,
  apiUrls.auth.mobileRefresh,
  apiUrls.users.login,
  apiUrls.users.logout,
  apiUrls.users.refresh,
  apiUrls.plans.list,
]

function getRequestPath(url?: string) {
  if (!url) {
    return null
  }

  try {
    return new URL(url, 'http://your-auth.local').pathname
  } catch {
    return url.split('?')[0] ?? url
  }
}

const isNonRefreshableRequest = (url?: string) => {
  const requestPath = getRequestPath(url)

  return requestPath
    ? nonRefreshableUrls.some((nonRefreshableUrl) => requestPath === nonRefreshableUrl)
    : false
}
const shouldRefreshSession = (status?: number) => status === 401

export function subscribeToAuthSessionRejection(listener: () => void) {
  authSessionRejectionListeners.add(listener)

  return () => {
    authSessionRejectionListeners.delete(listener)
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (!shouldRefreshSession(error.response?.status) || !originalRequest) {
      return Promise.reject(error)
    }

    if (isNonRefreshableRequest(originalRequest.url)) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      notifyAuthSessionRejection()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    await refreshSession()

    return axiosClient(originalRequest)
  },
)

const unwrapData = <ResponseData>(response: AxiosResponse<ResponseData>) => response.data

export const api = {
  request: <ResponseData = unknown, BodyData = unknown>(config: ApiRequestWithUrl<BodyData>) =>
    axiosClient.request<ResponseData>(config).then(unwrapData),

  get: <ResponseData = unknown>(url: BackendUrl, config?: ApiRequestConfig) =>
    axiosClient.get<ResponseData>(url, config).then(unwrapData),

  post: <ResponseData = unknown, BodyData = unknown>(
    url: BackendUrl,
    data?: BodyData,
    config?: ApiRequestConfig<BodyData>,
  ) => axiosClient.post<ResponseData>(url, data, config).then(unwrapData),

  put: <ResponseData = unknown, BodyData = unknown>(
    url: BackendUrl,
    data?: BodyData,
    config?: ApiRequestConfig<BodyData>,
  ) => axiosClient.put<ResponseData>(url, data, config).then(unwrapData),

  patch: <ResponseData = unknown, BodyData = unknown>(
    url: BackendUrl,
    data?: BodyData,
    config?: ApiRequestConfig<BodyData>,
  ) => axiosClient.patch<ResponseData>(url, data, config).then(unwrapData),

  delete: <ResponseData = unknown>(url: BackendUrl, config?: ApiRequestConfig) =>
    axiosClient.delete<ResponseData>(url, config).then(unwrapData),
}
