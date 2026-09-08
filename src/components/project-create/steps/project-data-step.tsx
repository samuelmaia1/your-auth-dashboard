'use client'

import { ArrowRight } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { projectDataStepFields, projectEnvironmentOptions } from '../project-create.shared'
import { FullWidthPrimaryButton, FormStack, TwoColumnGrid } from '../style'
import { SelectField } from '../fields/select-field'
import type { ProjectCreateStepProps } from './types'

export function ProjectDataStep({ isActive, onNext }: ProjectCreateStepProps) {
  const { trigger } = useFormContext<ProjectCreateFormValues>()

  if (!isActive) {
    return null
  }

  async function handleNext() {
    const isValid = await trigger([...projectDataStepFields], { shouldFocus: true })

    if (isValid) {
      onNext()
    }
  }

  return (
    <FormStack>
      <TwoColumnGrid>
        <RHFInput<ProjectCreateFormValues>
          name="name"
          label="Nome do projeto"
          placeholder="Portal de clientes"
          type="text"
        />
        <SelectField name="environment" label="Ambiente" options={projectEnvironmentOptions} />
      </TwoColumnGrid>
      <RHFInput<ProjectCreateFormValues>
        name="tokenAudience"
        label="Audiência do token"
        placeholder="portal-clientes"
        type="text"
      />
      <RHFInput<ProjectCreateFormValues>
        name="description"
        label="Descrição"
        placeholder="Autenticação do portal de clientes"
        type="text"
      />

      <FullWidthPrimaryButton type="button" size="lg" onClick={handleNext}>
        Continuar <ArrowRight size={16} />
      </FullWidthPrimaryButton>
    </FormStack>
  )
}
