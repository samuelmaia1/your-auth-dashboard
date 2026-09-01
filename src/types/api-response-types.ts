export type ApiFieldErrorMap = Record<string, string>

export type ApiFieldErrorList = Array<
  | string
  | {
      field?: string
      name?: string
      path?: string
      message?: string
    }
>

export interface ApiErrorResponse {
  message?: string
  status?: number
  error?: string
  time?: string
  fields?: ApiFieldErrorMap | ApiFieldErrorList
}

export interface ApiPageResponse<TData> {
  content?: TData[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
}
