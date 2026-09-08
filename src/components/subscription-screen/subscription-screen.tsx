'use client'

import {
  CalendarDays,
  Check,
  CircleDashed,
  CreditCard,
  Gauge,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import {
  getAccountSubscription,
  isAccountSubscriptionServiceError,
} from '@/services/account.service'
import type { AccountSubscriptionResponse, SubscriptionStatus } from '@/types/plan-types'
import {
  formatBillingCycle,
  formatDate,
  formatLimitValue,
  formatSubscriptionStatus,
  getActiveFeatures,
  getFeatureLabel,
  getLimitLabel,
  getOrderedLimits,
  getPlanDescription,
  getPlanName,
} from '@/utils/plan-formatters'

import {
  CurrentPlanBadge,
  DetailCard,
  DetailIcon,
  DetailLabel,
  DetailList,
  DetailValue,
  ErrorActions,
  ErrorMessage,
  FeatureEmptyItem,
  FeatureItem,
  FeatureList,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  LimitItem,
  LimitLabel,
  LimitList,
  LimitValue,
  LoadingBlock,
  PlanDescription,
  PlanHeader,
  PlanIcon,
  PlanName,
  PlanPanel,
  PlanTitleContent,
  PlanTitleRow,
  RetryButton,
  SectionHeader,
  SectionTitle,
  StatusBadge,
  SubscriptionHeader,
  SubscriptionRoot,
  SubscriptionSection,
  ViewPlansButton,
} from './style'

type DetailTone = 'success' | 'danger' | 'neutral' | 'info'

type Detail = {
  label: string
  value: string
  icon: ReactNode
  tone?: DetailTone
}

const defaultSubscriptionScreenErrorMessage =
  'Não foi possível carregar a assinatura da conta. Tente novamente em alguns instantes.'

const statusToneByStatus: Record<SubscriptionStatus, DetailTone> = {
  ACTIVE: 'success',
  TRIALING: 'info',
  PAST_DUE: 'danger',
  SUSPENDED: 'danger',
  CANCELED: 'neutral',
}

function getSubscriptionScreenErrorMessage(error: unknown) {
  if (isAccountSubscriptionServiceError(error)) {
    return error.response.message ?? defaultSubscriptionScreenErrorMessage
  }

  return defaultSubscriptionScreenErrorMessage
}

async function fetchSubscription() {
  try {
    return {
      data: await getAccountSubscription(),
      errorMessage: null,
    }
  } catch (error: unknown) {
    return {
      data: null,
      errorMessage: getSubscriptionScreenErrorMessage(error),
    }
  }
}

function LoadingSubscription() {
  return (
    <>
      <PlanPanel aria-hidden="true">
        <PlanHeader>
          <PlanTitleRow>
            <LoadingBlock $height={44} $width={44} />
            <PlanTitleContent>
              <LoadingBlock $height={24} $width={128} />
              <LoadingBlock $height={24} $width={88} />
            </PlanTitleContent>
          </PlanTitleRow>
          <LoadingBlock $height={18} $width="74%" />
          <LoadingBlock $height={18} $width="58%" />
        </PlanHeader>
      </PlanPanel>

      <DetailList aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <DetailCard key={index}>
            <LoadingBlock $height={36} $width={36} />
            <LoadingBlock $height={16} $width="56%" />
            <LoadingBlock $height={20} $width="64%" />
          </DetailCard>
        ))}
      </DetailList>
    </>
  )
}

function SubscriptionScreen() {
  const requestIdRef = useRef(0)
  const [subscription, setSubscription] = useState<AccountSubscriptionResponse | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)
  const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState<string | null>(null)
  const plan = subscription?.plan
  const limits = useMemo(() => getOrderedLimits(plan), [plan])
  const features = useMemo(() => getActiveFeatures(plan), [plan])
  const details = useMemo<Detail[]>(
    () =>
      subscription
        ? [
            {
              label: 'Status',
              value: formatSubscriptionStatus(subscription.status),
              icon: <ShieldCheck size={18} />,
              tone: subscription.status ? statusToneByStatus[subscription.status] : 'neutral',
            },
            {
              label: 'Ciclo',
              value: formatBillingCycle(subscription.billingCycle),
              icon: <CreditCard size={18} />,
              tone: 'info',
            },
            {
              label: 'Início do período',
              value: formatDate(subscription.currentPeriodStart),
              icon: <CalendarDays size={18} />,
            },
            {
              label: 'Fim do período',
              value: formatDate(subscription.currentPeriodEnd),
              icon: <CalendarDays size={18} />,
            },
            {
              label: 'Criada em',
              value: formatDate(subscription.createdAt),
              icon: <Gauge size={18} />,
            },
            {
              label: 'Atualizada em',
              value: formatDate(subscription.updatedAt),
              icon: <Gauge size={18} />,
            },
            ...(subscription.trialEndsAt
              ? [
                  {
                    label: 'Fim do teste',
                    value: formatDate(subscription.trialEndsAt),
                    icon: <CalendarDays size={18} />,
                    tone: 'info' as DetailTone,
                  },
                ]
              : []),
            ...(subscription.canceledAt
              ? [
                  {
                    label: 'Cancelada em',
                    value: formatDate(subscription.canceledAt),
                    icon: <CalendarDays size={18} />,
                    tone: 'danger' as DetailTone,
                  },
                ]
              : []),
          ]
        : [],
    [subscription],
  )

  const fetchAndApplySubscription = useCallback(async () => {
    const requestId = requestIdRef.current + 1

    requestIdRef.current = requestId

    const { data, errorMessage } = await fetchSubscription()

    if (requestIdRef.current === requestId) {
      setSubscription(data)
      setSubscriptionErrorMessage(errorMessage)
      setIsLoadingSubscription(false)
    }
  }, [])

  const loadSubscription = useCallback(() => {
    setIsLoadingSubscription(true)
    setSubscription(null)
    setSubscriptionErrorMessage(null)

    void fetchAndApplySubscription()
  }, [fetchAndApplySubscription])

  useEffect(() => {
    void fetchAndApplySubscription()

    return () => {
      requestIdRef.current += 1
    }
  }, [fetchAndApplySubscription])

  return (
    <SubscriptionRoot>
      <SubscriptionHeader>
        <HeaderContent>
          <HeaderEyebrow>Assinatura</HeaderEyebrow>
          <HeaderTitle>Assinatura da conta</HeaderTitle>
          <HeaderSubtitle>
            Acompanhe o plano contratado, status da assinatura, ciclo de cobrança e limites
            disponíveis.
          </HeaderSubtitle>
        </HeaderContent>

        <ViewPlansButton href="/planos" size="lg" variant="outline">
          <CreditCard size={16} />
          Ver planos
        </ViewPlansButton>
      </SubscriptionHeader>

      {subscriptionErrorMessage ? (
        <ErrorMessage role="alert">
          {subscriptionErrorMessage}
          <ErrorActions>
            <RetryButton type="button" size="sm" variant="outline" onClick={loadSubscription}>
              <RefreshCcw size={16} />
              Tentar novamente
            </RetryButton>
          </ErrorActions>
        </ErrorMessage>
      ) : isLoadingSubscription ? (
        <LoadingSubscription />
      ) : (
        <>
          <PlanPanel>
            <PlanHeader>
              <PlanTitleRow>
                <PlanIcon>
                  <CreditCard size={20} />
                </PlanIcon>

                <PlanTitleContent>
                  <PlanName>{getPlanName(plan)}</PlanName>
                  <CurrentPlanBadge>Plano atual</CurrentPlanBadge>
                  {subscription?.status && (
                    <StatusBadge $tone={statusToneByStatus[subscription.status]}>
                      {formatSubscriptionStatus(subscription.status)}
                    </StatusBadge>
                  )}
                </PlanTitleContent>
              </PlanTitleRow>

              <PlanDescription>{getPlanDescription(plan)}</PlanDescription>
            </PlanHeader>
          </PlanPanel>

          <SubscriptionSection>
            <SectionHeader>
              <SectionTitle>Dados da assinatura</SectionTitle>
            </SectionHeader>

            <DetailList>
              {details.map((detail) => (
                <DetailCard key={detail.label}>
                  <DetailIcon $tone={detail.tone ?? 'neutral'}>{detail.icon}</DetailIcon>
                  <DetailLabel>{detail.label}</DetailLabel>
                  <DetailValue>{detail.value}</DetailValue>
                </DetailCard>
              ))}
            </DetailList>
          </SubscriptionSection>

          <SubscriptionSection>
            <SectionHeader>
              <SectionTitle>Limites do plano atual</SectionTitle>
            </SectionHeader>

            <LimitList>
              {limits.map((limit, index) => (
                <LimitItem key={limit.code ?? `limit-${index}`}>
                  <LimitLabel>{getLimitLabel(limit.code)}</LimitLabel>
                  <LimitValue>{formatLimitValue(limit)}</LimitValue>
                </LimitItem>
              ))}
            </LimitList>
          </SubscriptionSection>

          <SubscriptionSection>
            <SectionHeader>
              <SectionTitle>Features do plano atual</SectionTitle>
            </SectionHeader>

            <FeatureList>
              {features.length > 0 ? (
                features.map((feature, index) => (
                  <FeatureItem key={feature.code ?? `feature-${index}`}>
                    <Check size={16} />
                    <span>{getFeatureLabel(feature)}</span>
                  </FeatureItem>
                ))
              ) : (
                <FeatureEmptyItem>
                  <CircleDashed size={16} />
                  <span>Nenhuma feature cadastrada neste plano</span>
                </FeatureEmptyItem>
              )}
            </FeatureList>
          </SubscriptionSection>
        </>
      )}
    </SubscriptionRoot>
  )
}

export { SubscriptionScreen }
