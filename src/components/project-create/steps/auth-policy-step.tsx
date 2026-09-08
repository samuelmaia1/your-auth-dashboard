'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { authPolicyStepFields, sessionModeOptions } from '../project-create.shared'
import {
  ActionGrid,
  FieldGroup,
  FieldGroupTitle,
  FormButton,
  FormStack,
  PrimaryFormButton,
  SwitchGrid,
  TwoColumnGrid,
} from '../style'
import { SelectField } from '../fields/select-field'
import { SwitchField } from '../fields/switch-field'
import type { ProjectCreateStepProps } from './types'

export function AuthPolicyStep({ isActive, onBack, onNext }: ProjectCreateStepProps) {
  const { clearErrors, control, setValue, trigger } = useFormContext<ProjectCreateFormValues>()
  const sessionMode = useWatch({
    control,
    name: 'authConfig.sessionMode',
  })
  const isLimitedSessionMode = sessionMode === 'LIMITED_ACTIVE_SESSIONS'

  useEffect(() => {
    if (!isActive || isLimitedSessionMode) {
      return
    }

    setValue('authConfig.maxActiveSessions', '', {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    })
    clearErrors('authConfig.maxActiveSessions')
  }, [clearErrors, isActive, isLimitedSessionMode, setValue])

  if (!isActive) {
    return null
  }

  async function handleNext() {
    const isValid = await trigger([...authPolicyStepFields], { shouldFocus: true })

    if (isValid) {
      onNext()
    }
  }

  return (
    <FormStack>
      <TwoColumnGrid>
        <RHFInput<ProjectCreateFormValues>
          name="authConfig.accessTokenExpirationMinutes"
          label="Access token (minutos)"
          placeholder="15"
          type="number"
        />
        <RHFInput<ProjectCreateFormValues>
          name="authConfig.refreshTokenExpirationDays"
          label="Refresh token (dias)"
          placeholder="30"
          type="number"
        />
      </TwoColumnGrid>

      <TwoColumnGrid>
        <SelectField
          name="authConfig.sessionMode"
          label="Modo de sessão"
          options={sessionModeOptions}
        />
        {isLimitedSessionMode && (
          <RHFInput<ProjectCreateFormValues>
            name="authConfig.maxActiveSessions"
            label="Máximo de sessões ativas"
            placeholder="5"
            type="number"
          />
        )}
      </TwoColumnGrid>

      <TwoColumnGrid>
        <RHFInput<ProjectCreateFormValues>
          name="authConfig.failedLoginAttemptsLimit"
          label="Limite de falhas de login"
          placeholder="5"
          type="number"
        />
        <RHFInput<ProjectCreateFormValues>
          name="authConfig.lockDurationMinutes"
          label="Bloqueio (minutos)"
          placeholder="30"
          type="number"
        />
      </TwoColumnGrid>

      <FieldGroup>
        <FieldGroupTitle>Comportamento</FieldGroupTitle>
        <SwitchGrid>
          <SwitchField
            name="authConfig.refreshTokenRotationEnabled"
            label="Rotação de refresh token"
            description="Renova o refresh token a cada troca."
          />
          <SwitchField
            name="authConfig.revokeTokensOnPasswordChange"
            label="Revogar ao trocar senha"
            description="Invalida tokens após alteração."
          />
          <SwitchField
            name="authConfig.requireEmailVerification"
            label="Verificação de e-mail"
            description="Exige e-mail verificado para acesso."
          />
          <SwitchField
            name="authConfig.registrationEnabled"
            label="Cadastro habilitado"
            description="Permite novos usuários finais."
          />
        </SwitchGrid>
      </FieldGroup>

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton type="button" size="lg" onClick={handleNext}>
          Continuar <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}
