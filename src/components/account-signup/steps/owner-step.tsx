'use client'

import { ArrowRight } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { AccountSignupFormValues } from '@lib/validations/account-signup'
import { cpfMask } from '@/utils/mask'

import { FormStack, FullWidthPrimaryButton, TwoColumnGrid } from '../style'
import { ownerStepFields } from './fields'
import type { StepProps } from './types'
import { validateStep } from './validate-step'

export function OwnerStep({ onNext }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <FormStack>
      <TwoColumnGrid>
        <RHFInput name="name" label="Nome" placeholder="Ana" type="text" />
        <RHFInput name="lastName" label="Sobrenome" placeholder="Martins" type="text" />
      </TwoColumnGrid>
      <RHFInput name="CPF" label="CPF" placeholder="000.000.000-00" mask={cpfMask} type="text" />

      <FullWidthPrimaryButton
        type="button"
        size="lg"
        onClick={() => validateStep(trigger, ownerStepFields, onNext)}
      >
        Continuar <ArrowRight size={16} />
      </FullWidthPrimaryButton>
    </FormStack>
  )
}
