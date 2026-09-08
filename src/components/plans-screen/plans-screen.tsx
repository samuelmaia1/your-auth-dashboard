'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Check,
  CircleDashed,
  CreditCard,
  KeyRound,
  RefreshCcw,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  getAccountSubscription,
  isAccountSubscriptionServiceError,
} from '@/services/account.service'
import { getPlans, isPlansServiceError } from '@/services/plan.service'
import type { AccountSubscriptionResponse, PlanCode, PlanResponse } from '@/types/plan-types'
import {
  formatLimitValue,
  getActiveFeatures,
  getFeatureLabel,
  getLimitLabel,
  getOrderedLimits,
  getPlanDescription,
  getPlanKey,
  getPlanName,
  sortPlans,
} from '@/utils/plan-formatters'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@components/ui/carousel'

import {
  CarouselSection,
  CurrentPlanBadge,
  EmptyDescription,
  EmptyState,
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
  PlanCard,
  PlanDescription,
  PlanHeader,
  PlanIcon,
  PlanName,
  PlansHeader,
  PlansRoot,
  PlanSection,
  PlanSectionTitle,
  PlanStatusBadge,
  PlanTitleContent,
  PlanTitleRow,
  RetryButton,
  SectionHeader,
  SectionTitle,
} from './style'

type PlanIconConfig = {
  icon: LucideIcon
}

const defaultPlansScreenErrorMessage =
  'Não foi possível carregar os planos. Tente novamente em alguns instantes.'

const planIcons: Record<PlanCode, PlanIconConfig> = {
  FREE: {
    icon: KeyRound,
  },
  STARTER: {
    icon: Rocket,
  },
  PRO: {
    icon: ShieldCheck,
  },
  BUSINESS: {
    icon: Building2,
  },
}

function getPlansScreenErrorMessage(error: unknown) {
  if (isPlansServiceError(error) || isAccountSubscriptionServiceError(error)) {
    return error.response.message ?? defaultPlansScreenErrorMessage
  }

  return defaultPlansScreenErrorMessage
}

function getPlanIcon(plan: PlanResponse) {
  return plan.code ? (planIcons[plan.code]?.icon ?? CreditCard) : CreditCard
}

async function fetchPlansScreenData() {
  try {
    const [plans, subscription] = await Promise.all([getPlans(), getAccountSubscription()])

    return {
      data: {
        plans,
        subscription,
      },
      errorMessage: null,
    }
  } catch (error: unknown) {
    return {
      data: null,
      errorMessage: getPlansScreenErrorMessage(error),
    }
  }
}

function LoadingPlanCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <CarouselItem key={index} basis="min(354px, calc(100vw - 108px))">
          <PlanCard $current={false} aria-hidden="true">
            <PlanHeader>
              <PlanTitleRow>
                <LoadingBlock $height={40} $width={40} />
                <PlanTitleContent>
                  <LoadingBlock $height={22} $width={116} />
                </PlanTitleContent>
              </PlanTitleRow>
              <LoadingBlock $height={18} $width="88%" />
              <LoadingBlock $height={18} $width="72%" />
            </PlanHeader>

            <PlanSection>
              <LoadingBlock $height={18} $width={72} />
              <LimitList>
                {Array.from({ length: 3 }).map((__, limitIndex) => (
                  <LimitItem key={limitIndex}>
                    <LoadingBlock $height={16} $width="70%" />
                    <LoadingBlock $height={20} $width="46%" />
                  </LimitItem>
                ))}
              </LimitList>
            </PlanSection>

            <PlanSection>
              <LoadingBlock $height={18} $width={84} />
              <FeatureList>
                {Array.from({ length: 3 }).map((__, featureIndex) => (
                  <FeatureItem key={featureIndex}>
                    <LoadingBlock $height={16} $width={16} />
                    <LoadingBlock $height={16} $width="74%" />
                  </FeatureItem>
                ))}
              </FeatureList>
            </PlanSection>
          </PlanCard>
        </CarouselItem>
      ))}
    </>
  )
}

function PlansScreen() {
  const requestIdRef = useRef(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [plans, setPlans] = useState<PlanResponse[]>([])
  const [subscription, setSubscription] = useState<AccountSubscriptionResponse | null>(null)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [plansErrorMessage, setPlansErrorMessage] = useState<string | null>(null)
  const orderedPlans = useMemo(() => sortPlans(plans), [plans])
  const currentPlanKey = getPlanKey(subscription?.plan)
  const currentPlanName = subscription?.plan ? getPlanName(subscription.plan) : null

  const fetchAndApplyPlansScreenData = useCallback(async () => {
    const requestId = requestIdRef.current + 1

    requestIdRef.current = requestId

    const { data, errorMessage } = await fetchPlansScreenData()

    if (requestIdRef.current === requestId) {
      setPlans(data?.plans ?? [])
      setSubscription(data?.subscription ?? null)
      setPlansErrorMessage(errorMessage)
      setIsLoadingPlans(false)
    }
  }, [])

  const loadPlansScreenData = useCallback(() => {
    setIsLoadingPlans(true)
    setPlans([])
    setSubscription(null)
    setPlansErrorMessage(null)

    void fetchAndApplyPlansScreenData()
  }, [fetchAndApplyPlansScreenData])

  useEffect(() => {
    void fetchAndApplyPlansScreenData()

    return () => {
      requestIdRef.current += 1
    }
  }, [fetchAndApplyPlansScreenData])

  useEffect(() => {
    if (!carouselApi || isLoadingPlans || plansErrorMessage || !currentPlanKey) {
      return
    }

    const currentPlanIndex = orderedPlans.findIndex((plan) => getPlanKey(plan) === currentPlanKey)

    if (currentPlanIndex >= 0) {
      window.setTimeout(() => carouselApi.scrollTo(currentPlanIndex), 0)
    }
  }, [carouselApi, currentPlanKey, isLoadingPlans, orderedPlans, plansErrorMessage])

  return (
    <PlansRoot>
      <PlansHeader>
        <HeaderContent>
          <HeaderEyebrow>Planos</HeaderEyebrow>
          <HeaderTitle>Planos disponíveis</HeaderTitle>
          <HeaderSubtitle>
            {isLoadingPlans
              ? 'Carregando catálogo de planos...'
              : currentPlanName
                ? `Seu plano atual é ${currentPlanName}. Compare limites e features disponíveis.`
                : 'Compare limites e features disponíveis para a conta.'}
          </HeaderSubtitle>
        </HeaderContent>
      </PlansHeader>

      <CarouselSection>
        <SectionHeader>
          <SectionTitle>Catálogo de planos</SectionTitle>
        </SectionHeader>

        {plansErrorMessage ? (
          <ErrorMessage role="alert">
            {plansErrorMessage}
            <ErrorActions>
              <RetryButton type="button" size="sm" variant="outline" onClick={loadPlansScreenData}>
                <RefreshCcw size={16} />
                Tentar novamente
              </RetryButton>
            </ErrorActions>
          </ErrorMessage>
        ) : isLoadingPlans ? (
          <Carousel
            options={{
              align: 'start',
              containScroll: 'trimSnaps',
              duration: 14,
              watchDrag: false,
            }}
            aria-label="Carregando planos disponíveis"
          >
            <CarouselContent>
              <LoadingPlanCards />
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : orderedPlans.length > 0 ? (
          <Carousel
            options={{
              align: 'start',
              containScroll: 'trimSnaps',
              duration: 14,
              watchDrag: false,
            }}
            setApi={setCarouselApi}
            aria-label="Lista de planos disponíveis"
          >
            <CarouselContent>
              {orderedPlans.map((plan, planIndex) => {
                const Icon = getPlanIcon(plan)
                const isCurrentPlan = getPlanKey(plan) === currentPlanKey
                const limits = getOrderedLimits(plan)
                const features = getActiveFeatures(plan)

                return (
                  <CarouselItem
                    key={getPlanKey(plan) || `plan-${planIndex}`}
                    basis="min(354px, calc(100vw - 108px))"
                  >
                    <PlanCard $current={isCurrentPlan}>
                      <PlanHeader>
                        <PlanTitleRow>
                          <PlanIcon $current={isCurrentPlan}>
                            <Icon size={20} />
                          </PlanIcon>

                          <PlanTitleContent>
                            <PlanName>{getPlanName(plan)}</PlanName>
                            {isCurrentPlan && <CurrentPlanBadge>Plano atual</CurrentPlanBadge>}
                            {plan.active === false && <PlanStatusBadge>Inativo</PlanStatusBadge>}
                          </PlanTitleContent>
                        </PlanTitleRow>

                        <PlanDescription>{getPlanDescription(plan)}</PlanDescription>
                      </PlanHeader>

                      <PlanSection>
                        <PlanSectionTitle>Limites</PlanSectionTitle>
                        <LimitList aria-label={`Limites do plano ${getPlanName(plan)}`}>
                          {limits.map((limit, limitIndex) => (
                            <LimitItem key={limit.code ?? `limit-${limitIndex}`}>
                              <LimitLabel>{getLimitLabel(limit.code)}</LimitLabel>
                              <LimitValue>{formatLimitValue(limit)}</LimitValue>
                            </LimitItem>
                          ))}
                        </LimitList>
                      </PlanSection>

                      <PlanSection>
                        <PlanSectionTitle>Features</PlanSectionTitle>
                        <FeatureList aria-label={`Features do plano ${getPlanName(plan)}`}>
                          {features.length > 0 ? (
                            features.map((feature, featureIndex) => (
                              <FeatureItem key={feature.code ?? `feature-${featureIndex}`}>
                                <Check size={16} />
                                <span>{getFeatureLabel(feature)}</span>
                              </FeatureItem>
                            ))
                          ) : (
                            <FeatureEmptyItem>
                              <CircleDashed size={16} />
                              <span>Nenhuma feature cadastrada</span>
                            </FeatureEmptyItem>
                          )}
                        </FeatureList>
                      </PlanSection>
                    </PlanCard>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <EmptyState>
            <SectionTitle>Nenhum plano encontrado</SectionTitle>
            <EmptyDescription>
              Quando houver planos ativos cadastrados, eles aparecerão nesta área.
            </EmptyDescription>
          </EmptyState>
        )}
      </CarouselSection>
    </PlansRoot>
  )
}

export { PlansScreen }
