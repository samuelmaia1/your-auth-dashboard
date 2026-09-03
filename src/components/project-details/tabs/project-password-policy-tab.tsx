'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjectPasswordConfig } from '@/services/project.service'
import type { ProjectPasswordConfigResponse } from '@/types/project-types'

import {
  BooleanBadge,
  fetchResource,
  formatOptionalNumber,
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

type ProjectPasswordPolicyTabProps = {
  isActive: boolean
  projectId: string
}

const defaultPasswordConfigErrorMessage =
  'Não foi possível carregar a política de senha. Tente novamente em alguns instantes.'

export function ProjectPasswordPolicyTab({ isActive, projectId }: ProjectPasswordPolicyTabProps) {
  const [passwordConfigState, setPasswordConfigState] = useState<
    ResourceState<ProjectPasswordConfigResponse>
  >({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const passwordConfigRequestIdRef = useRef(0)

  const loadPasswordConfig = useCallback(async () => {
    const requestId = passwordConfigRequestIdRef.current + 1

    passwordConfigRequestIdRef.current = requestId
    setPasswordConfigState({
      data: null,
      isLoading: true,
      errorMessage: null,
    })

    const { data, errorMessage } = await fetchResource(
      () => getProjectPasswordConfig(projectId),
      defaultPasswordConfigErrorMessage,
    )

    if (passwordConfigRequestIdRef.current === requestId) {
      setPasswordConfigState({
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
        void loadPasswordConfig()
      }
    })

    return () => {
      shouldLoad = false
      passwordConfigRequestIdRef.current += 1
    }
  }, [isActive, loadPasswordConfig])

  const passwordConfigItems = [
    {
      label: 'Tamanho mínimo',
      value: formatOptionalNumber(passwordConfigState.data?.minSize, 'caracteres'),
    },
    {
      label: 'Tamanho máximo',
      value: formatOptionalNumber(passwordConfigState.data?.maxSize, 'caracteres'),
    },
    {
      label: 'Número obrigatório',
      value: <BooleanBadge value={passwordConfigState.data?.numberRequired} />,
    },
    {
      label: 'Maiúscula obrigatória',
      value: <BooleanBadge value={passwordConfigState.data?.uppercaseRequired} />,
    },
    {
      label: 'Minúscula obrigatória',
      value: <BooleanBadge value={passwordConfigState.data?.lowercaseRequired} />,
    },
    {
      label: 'Caractere especial obrigatório',
      value: <BooleanBadge value={passwordConfigState.data?.specialCharRequired} />,
    },
    {
      label: 'Intervalo válido',
      value: <BooleanBadge value={passwordConfigState.data?.validRange} />,
    },
  ]

  if (!isActive) {
    return null
  }

  return (
    <>
      <TabHeader>
        <div>
          <SectionTitle>Política de Senha</SectionTitle>
          <SectionSubtitle>Password config do projeto</SectionSubtitle>
        </div>
      </TabHeader>

      {passwordConfigState.errorMessage ? (
        <ResourceError
          message={passwordConfigState.errorMessage}
          onRetry={() => {
            void loadPasswordConfig()
          }}
        />
      ) : passwordConfigState.isLoading && !passwordConfigState.data ? (
        <LoadingConfigGrid />
      ) : passwordConfigState.data ? (
        <ConfigGrid>{passwordConfigItems.map(renderConfigItem)}</ConfigGrid>
      ) : (
        <EmptyState>
          <SectionTitle>Política de senha não encontrada</SectionTitle>
          <EmptyDescription>
            O endpoint não retornou configuração de senha para este projeto.
          </EmptyDescription>
        </EmptyState>
      )}
    </>
  )
}
