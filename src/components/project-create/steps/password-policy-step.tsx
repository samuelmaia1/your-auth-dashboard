'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { passwordPolicyStepFields } from '../project-create.shared'
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
import { SwitchField } from '../fields/switch-field'
import type { ProjectCreateStepProps } from './types'

export function PasswordPolicyStep({ isActive, onBack, onNext }: ProjectCreateStepProps) {
  const { trigger } = useFormContext<ProjectCreateFormValues>()

  if (!isActive) {
    return null
  }

  async function handleNext() {
    const isValid = await trigger([...passwordPolicyStepFields], { shouldFocus: true })

    if (isValid) {
      onNext()
    }
  }

  return (
    <FormStack>
      <TwoColumnGrid>
        <RHFInput<ProjectCreateFormValues>
          name="passwordConfig.minSize"
          label="Tamanho mínimo"
          placeholder="8"
          type="number"
        />
        <RHFInput<ProjectCreateFormValues>
          name="passwordConfig.maxSize"
          label="Tamanho máximo"
          placeholder="120"
          type="number"
        />
      </TwoColumnGrid>

      <FieldGroup>
        <FieldGroupTitle>Requisitos</FieldGroupTitle>
        <SwitchGrid>
          <SwitchField
            name="passwordConfig.numberRequired"
            label="Número obrigatório"
            description="Exige ao menos um dígito."
          />
          <SwitchField
            name="passwordConfig.uppercaseRequired"
            label="Maiúscula obrigatória"
            description="Exige ao menos uma letra maiúscula."
          />
          <SwitchField
            name="passwordConfig.lowercaseRequired"
            label="Minúscula obrigatória"
            description="Exige ao menos uma letra minúscula."
          />
          <SwitchField
            name="passwordConfig.specialCharRequired"
            label="Caractere especial"
            description="Exige símbolo ou pontuação."
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
