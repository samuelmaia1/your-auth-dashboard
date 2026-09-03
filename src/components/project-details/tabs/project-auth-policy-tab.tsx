'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjectAuthConfig } from '@/services/project.service'
import type { ProjectAuthConfigResponse } from '@/types/project-types'

import {
  BooleanBadge,
  fetchResource,
  formatOptionalNumber,
  getSessionModeLabel,
  LoadingConfigGrid,
  renderConfigItem,
  ResourceError,
  type ResourceState,
} from '../project-details.shared'
import {
  ConfigGrid,
  EmptyDescription,
  EmptyState,
  SectionSubtitle,
  SectionTitle,
  TabHeader,
} from '../style'

type ProjectAuthPolicyTabProps = {
  isActive: boolean
  projectId: string
}

const defaultAuthConfigErrorMessage =
  'Não foi possível carregar a política de autenticação. Tente novamente em alguns instantes.'

export function ProjectAuthPolicyTab({ isActive, projectId }: ProjectAuthPolicyTabProps) {
  const [authConfigState, setAuthConfigState] = useState<ResourceState<ProjectAuthConfigResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const authConfigRequestIdRef = useRef(0)

  const loadAuthConfig = useCallback(async () => {
    const requestId = authConfigRequestIdRef.current + 1

    authConfigRequestIdRef.current = requestId
    setAuthConfigState({
      data: null,
      isLoading: true,
      errorMessage: null,
    })

    const { data, errorMessage } = await fetchResource(
      () => getProjectAuthConfig(projectId),
      defaultAuthConfigErrorMessage,
    )

    if (authConfigRequestIdRef.current === requestId) {
      setAuthConfigState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId])

  useEffect(() => {
    if (!isActive) {
      return
    }

    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadAuthConfig()
      }
    })

    return () => {
      shouldLoad = false
      authConfigRequestIdRef.current += 1
    }
  }, [isActive, loadAuthConfig])

  const authConfigItems = [
    {
      label: 'Expiração do access token',
      value: formatOptionalNumber(authConfigState.data?.accessTokenExpirationMinutes, 'minutos'),
    },
    {
      label: 'Expiração do refresh token',
      value: formatOptionalNumber(authConfigState.data?.refreshTokenExpirationDays, 'dias'),
    },
    {
      label: 'Modo de sessão',
      value: getSessionModeLabel(authConfigState.data?.sessionMode),
    },
    {
      label: 'Máximo de sessões ativas',
      value: formatOptionalNumber(authConfigState.data?.maxActiveSessions),
    },
    {
      label: 'Rotação de refresh token',
      value: <BooleanBadge value={authConfigState.data?.refreshTokenRotationEnabled} />,
    },
    {
      label: 'Revogar tokens ao trocar senha',
      value: <BooleanBadge value={authConfigState.data?.revokeTokensOnPasswordChange} />,
    },
    {
      label: 'Limite de falhas de login',
      value: formatOptionalNumber(authConfigState.data?.failedLoginAttemptsLimit),
    },
    {
      label: 'Duração do bloqueio',
      value: formatOptionalNumber(authConfigState.data?.lockDurationMinutes, 'minutos'),
    },
    {
      label: 'Verificação de e-mail obrigatória',
      value: <BooleanBadge value={authConfigState.data?.requireEmailVerification} />,
    },
    {
      label: 'Cadastro habilitado',
      value: <BooleanBadge value={authConfigState.data?.registrationEnabled} />,
    },
    {
      label: 'Máximo exigido no modo limitado',
      value: <BooleanBadge value={authConfigState.data?.maxActiveSessionsRequiredWhenLimited} />,
    },
  ]

  if (!isActive) {
    return null
  }

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>Política de autenticação</SectionTitle>
          <SectionSubtitle>Auth config do projeto</SectionSubtitle>
        </div>
      </TabHeader>

      {authConfigState.errorMessage ? (
        <ResourceError
          message={authConfigState.errorMessage}
          onRetry={() => {
            void loadAuthConfig()
          }}
        />
      ) : authConfigState.isLoading && !authConfigState.data ? (
        <LoadingConfigGrid />
      ) : authConfigState.data ? (
        <ConfigGrid>{authConfigItems.map(renderConfigItem)}</ConfigGrid>
      ) : (
        <EmptyState>
          <SectionTitle>Política de autenticação não encontrada</SectionTitle>
          <EmptyDescription>
            O endpoint não retornou configuração de autenticação para este projeto.
          </EmptyDescription>
        </EmptyState>
      )}
    </>
  )
}
