'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { AccountSignupFormValues } from '@lib/validations/account-signup'

import { ActionGrid, FormButton, FormStack, PrimaryFormButton } from '../style'
import { securityStepFields } from './fields'
import { PasswordChecklist } from './password-checklist'
import type { StepProps } from './types'

export function SecurityStep({ onBack }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <FormStack>
      <RHFInput name="password" label="Senha" placeholder="********" type="password" />
      <PasswordChecklist />
      <RHFInput
        name="confirmPassword"
        label="Confirmar senha"
        placeholder="********"
        type="password"
      />

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton
          type="submit"
          size="lg"
          onClick={() => trigger(securityStepFields, { shouldFocus: true })}
        >
          Revisar dados <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}
