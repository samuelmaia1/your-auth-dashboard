'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { AccountSignupFormValues } from '@lib/validations/account-signup'
import { dddMask, phoneNumberMask } from '@/utils/mask'

import { ActionGrid, FormButton, FormStack, PhoneGrid, PrimaryFormButton } from '../style'
import { contactStepFields } from './fields'
import type { StepProps } from './types'
import { validateStep } from './validate-step'

export function ContactStep({ onNext, onBack }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <FormStack>
      <RHFInput name="email" label="E-mail" placeholder="ana@empresa.com" type="email" />

      <PhoneGrid>
        <RHFInput name="phone.ddd" label="DDD" placeholder="11" mask={dddMask} type="text" />
        <RHFInput
          name="phone.number"
          label="Telefone"
          placeholder="99999-9999"
          mask={phoneNumberMask}
          type="text"
        />
      </PhoneGrid>

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton
          type="button"
          size="lg"
          onClick={() => validateStep(trigger, contactStepFields, onNext)}
        >
          Continuar <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}
