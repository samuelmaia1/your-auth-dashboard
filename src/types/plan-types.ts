export type PlanCode = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS'

export type PlanLimitPeriod = 'NONE' | 'DAILY' | 'MONTHLY' | 'YEARLY'

export interface PlanFeatureResponse {
  id?: string
  code?: string
  description?: string
  enabled?: boolean
}

export interface PlanLimitResponse {
  id?: string
  code?: string
  value?: number
  unit?: string
  period?: PlanLimitPeriod
  unlimited?: boolean
}

export interface PlanResponse {
  id?: string
  code?: PlanCode
  name?: string
  description?: string
  active?: boolean
  displayOrder?: number
  features?: PlanFeatureResponse[]
  limits?: PlanLimitResponse[]
}

export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELED'

export type BillingCycle = 'NONE' | 'MONTHLY' | 'YEARLY'

export interface AccountSubscriptionResponse {
  id?: string
  accountId?: string
  plan?: PlanResponse
  status?: SubscriptionStatus
  billingCycle?: BillingCycle
  currentPeriodStart?: string | null
  currentPeriodEnd?: string | null
  trialEndsAt?: string | null
  canceledAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}
