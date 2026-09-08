import axios from 'axios'

import { api } from '@lib/api/axios'
import { apiUrls } from '@lib/api/urls'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type { PlanResponse } from '@/types/plan-types'

const defaultPlansErrorMessage =
  'Não foi possível carregar os planos. Tente novamente em alguns instantes.'

export class PlansServiceError extends Error {
  response: ApiErrorResponse

  constructor(response: ApiErrorResponse) {
    const message = response.message || response.error || defaultPlansErrorMessage

    super(message)
    this.name = 'PlansServiceError'
    this.response = {
      ...response,
      message,
    }
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null
}

function normalizePlansError(error: unknown): ApiErrorResponse {
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
      message: error.message || defaultPlansErrorMessage,
      status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || defaultPlansErrorMessage,
    }
  }

  return {
    message: defaultPlansErrorMessage,
  }
}

export function isPlansServiceError(error: unknown): error is PlansServiceError {
  return error instanceof PlansServiceError
}

export async function getPlans() {
  try {
    return await api.get<PlanResponse[]>(apiUrls.plans.list)
  } catch (error: unknown) {
    throw new PlansServiceError(normalizePlansError(error))
  }
}
