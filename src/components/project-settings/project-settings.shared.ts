import { isProjectsServiceError } from '@/services/project.service'
import type { ApiErrorResponse } from '@/types/api-response-types'
import { normalizeFieldName, normalizeFieldPath } from '@/utils/normalizer'

export type NormalizedProjectSettingsFieldError<TField extends string> = {
  field: TField
  message: string
}

type FieldErrorOptions<TField extends string> = {
  aliases?: Record<string, TField>
  fallbackMessage: string
  fieldNames: TField[]
}

export function getProjectSettingsServiceErrorMessage(error: unknown, fallbackMessage: string) {
  if (isProjectsServiceError(error)) {
    return error.response.message ?? error.message ?? fallbackMessage
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage
  }

  return fallbackMessage
}

export function getProjectSettingsBackendFieldErrors<TField extends string>(
  apiError: ApiErrorResponse | null,
  { aliases = {}, fallbackMessage, fieldNames }: FieldErrorOptions<TField>,
) {
  const fields = apiError?.fields
  const message = apiError?.message ?? fallbackMessage

  if (!fields) {
    return []
  }

  if (Array.isArray(fields)) {
    return fields.reduce<NormalizedProjectSettingsFieldError<TField>[]>((errors, fieldError) => {
      const fieldName =
        typeof fieldError === 'string'
          ? fieldError
          : (fieldError.field ?? fieldError.name ?? fieldError.path)
      const field = fieldName
        ? normalizeFieldName(normalizeFieldPath(fieldName), {
            aliases,
            fieldNames,
          })
        : null

      if (field) {
        errors.push({
          field,
          message: typeof fieldError === 'string' ? message : (fieldError.message ?? message),
        })
      }

      return errors
    }, [])
  }

  return Object.entries(fields).reduce<NormalizedProjectSettingsFieldError<TField>[]>(
    (errors, [fieldName, fieldMessage]) => {
      const field = normalizeFieldName(normalizeFieldPath(fieldName), {
        aliases,
        fieldNames,
      })

      if (field) {
        errors.push({
          field,
          message: fieldMessage || message,
        })
      }

      return errors
    },
    [],
  )
}
