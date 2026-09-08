import type {
  BillingCycle,
  PlanFeatureResponse,
  PlanLimitResponse,
  PlanResponse,
  SubscriptionStatus,
} from '@/types/plan-types'

const numberFormatter = new Intl.NumberFormat('pt-BR')

const limitLabels: Record<string, string> = {
  MAX_PROJECTS: 'Projetos',
  MAX_USERS_TOTAL: 'Usuários ativos',
  MAX_ACTIVE_SESSIONS_TOTAL: 'Sessões ativas',
}

const periodSuffixes: Record<string, string> = {
  NONE: '',
  DAILY: 'por dia',
  MONTHLY: 'por mês',
  YEARLY: 'por ano',
}

const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Ativa',
  TRIALING: 'Em teste',
  PAST_DUE: 'Pagamento pendente',
  SUSPENDED: 'Suspensa',
  CANCELED: 'Cancelada',
}

const billingCycleLabels: Record<BillingCycle, string> = {
  NONE: 'Sem cobrança',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
}

function titleizeCode(code: string) {
  return code
    .split('_')
    .filter(Boolean)
    .map((word) => `${word.charAt(0)}${word.slice(1).toLowerCase()}`)
    .join(' ')
}

export function getPlanKey(plan?: PlanResponse) {
  return plan?.code ?? plan?.id ?? ''
}

export function getPlanName(plan?: PlanResponse) {
  return plan?.name?.trim() || plan?.code || 'Plano não informado'
}

export function getPlanDescription(plan?: PlanResponse) {
  return plan?.description?.trim() || 'Sem descrição cadastrada.'
}

export function getLimitLabel(code?: string) {
  if (!code) {
    return 'Limite'
  }

  return limitLabels[code] ?? titleizeCode(code)
}

export function getLimitValue(plan: PlanResponse, code: string) {
  return plan.limits?.find((limit) => limit.code === code)
}

export function formatLimitValue(limit: PlanLimitResponse) {
  if (limit.unlimited) {
    return 'Ilimitado'
  }

  const value = typeof limit.value === 'number' ? numberFormatter.format(limit.value) : 'N/A'
  const periodSuffix = limit.period ? periodSuffixes[limit.period] : ''

  return periodSuffix ? `${value} ${periodSuffix}` : value
}

export function getOrderedLimits(plan?: PlanResponse) {
  const limits = plan?.limits ?? []
  const knownLimitCodes = Object.keys(limitLabels)
  const sortedKnownLimits = knownLimitCodes
    .map((code) => (plan ? getLimitValue(plan, code) : undefined))
    .filter(Boolean) as PlanLimitResponse[]
  const extraLimits = limits.filter((limit) => !limit.code || !knownLimitCodes.includes(limit.code))

  return [...sortedKnownLimits, ...extraLimits]
}

export function getFeatureLabel(feature: PlanFeatureResponse) {
  const description = feature.description?.trim()

  if (description) {
    return description
  }

  return feature.code ? titleizeCode(feature.code) : 'Feature sem descrição'
}

export function getActiveFeatures(plan?: PlanResponse) {
  return plan?.features?.filter((feature) => feature.enabled !== false) ?? []
}

export function sortPlans(plans: PlanResponse[]) {
  return [...plans].sort((currentPlan, nextPlan) => {
    const currentOrder = currentPlan.displayOrder ?? Number.MAX_SAFE_INTEGER
    const nextOrder = nextPlan.displayOrder ?? Number.MAX_SAFE_INTEGER

    if (currentOrder !== nextOrder) {
      return currentOrder - nextOrder
    }

    return getPlanName(currentPlan).localeCompare(getPlanName(nextPlan), 'pt-BR')
  })
}

export function formatSubscriptionStatus(status?: SubscriptionStatus) {
  return status ? subscriptionStatusLabels[status] : 'Não informado'
}

export function formatBillingCycle(billingCycle?: BillingCycle) {
  return billingCycle ? billingCycleLabels[billingCycle] : 'Não informado'
}

export function formatDate(value?: string | null) {
  if (!value) {
    return 'Não definido'
  }

  const datePart = value.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (datePart) {
    const [, year, month, day] = datePart

    return `${day}/${month}/${year}`
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Não definido'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
