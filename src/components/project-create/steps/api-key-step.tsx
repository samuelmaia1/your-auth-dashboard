'use client'

import { ArrowLeft, ArrowRight, Key, LoaderCircle } from 'lucide-react'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { ActionGrid, FormButton, FormStack, PrimaryFormButton, SubmitLoadingIcon } from '../style'
import { ScopeField } from '../fields/scope-field'
import type { ProjectCreateStepProps } from './types'

type ApiKeyStepProps = ProjectCreateStepProps & {
  isSubmitting: boolean
  projectAlreadyCreated: boolean
}

export function ApiKeyStep({
  isActive,
  isSubmitting,
  onBack,
  projectAlreadyCreated,
}: ApiKeyStepProps) {
  if (!isActive) {
    return null
  }

  return (
    <FormStack>
      <RHFInput<ProjectCreateFormValues>
        name="apiKey.name"
        label="Nome da API key"
        placeholder="Chave inicial"
        type="text"
      />
      <ScopeField />
      <RHFInput<ProjectCreateFormValues>
        name="apiKey.expiresInHours"
        label="Validade em horas"
        placeholder="720"
        type="number"
      />

      <ActionGrid>
        <FormButton
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting || projectAlreadyCreated}
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <SubmitLoadingIcon>
                <LoaderCircle size={16} />
              </SubmitLoadingIcon>
              Criando
            </>
          ) : projectAlreadyCreated ? (
            <>
              Gerar API key <Key size={16} />
            </>
          ) : (
            <>
              Criar projeto e gerar key <ArrowRight size={16} />
            </>
          )}
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}
