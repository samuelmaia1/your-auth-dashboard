import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

import { apiUrls, type BackendUrl } from '@lib/api/urls'

type ApiRequestConfig<Data = unknown> = Omit<AxiosRequestConfig<Data>, 'data' | 'method' | 'url'>

type ApiRequestWithUrl<Data = unknown> = AxiosRequestConfig<Data> & {
  url: BackendUrl
}

interface RetriableRequestConfig<Data = unknown> extends InternalAxiosRequestConfig<Data> {
  _retry?: boolean
}

const normalizeBaseUrl = (baseUrl?: string) => {
  const trimmedBaseUrl = baseUrl?.trim()

  if (!trimmedBaseUrl) {
    return undefined
  }

  if (/^https?:\/\//i.test(trimmedBaseUrl)) {
    return trimmedBaseUrl
  }

  return `http://${trimmedBaseUrl}`
}

const baseURL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL)

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

const refreshSession = () => {
  refreshRequest ??= refreshClient.post(apiUrls.auth.refresh).finally(() => {
    refreshRequest = null
  })

  return refreshRequest
}

const nonRefreshableUrls = [
  apiUrls.auth.login,
  apiUrls.auth.refresh,
  apiUrls.auth.mobileLogin,
  apiUrls.auth.mobileRefresh,
  apiUrls.users.login,
  apiUrls.users.logout,
  apiUrls.users.refresh,
]

const isNonRefreshableRequest = (url?: string) =>
  url ? nonRefreshableUrls.some((nonRefreshableUrl) => url.includes(nonRefreshableUrl)) : false
const shouldRefreshSession = (status?: number) => status === 401 || status === 403

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (
      !shouldRefreshSession(error.response?.status) ||
      !originalRequest ||
      originalRequest._retry ||
      isNonRefreshableRequest(originalRequest.url)
    ) {
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
