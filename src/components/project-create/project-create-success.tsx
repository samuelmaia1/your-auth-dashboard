'use client'

import { ArrowRight, CheckCircle2, Clipboard } from 'lucide-react'

import type { CreatedProjectApiKeyResponse, ProjectResponse } from '@/types/project-types'
import {
  ApiKeyBox,
  ApiKeyCode,
  ApiKeyLabel,
  FieldHelper,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  ProjectCreateHeader,
  ProjectCreateRoot,
  SuccessActions,
  SuccessButton,
  SuccessDescription,
  SuccessIcon,
  SuccessPanel,
  SuccessTitle,
} from './style'

type ProjectCreateSuccessProps = {
  copyMessage: string | null
  createdApiKey: CreatedProjectApiKeyResponse
  createdProject: ProjectResponse | null
  onCopyApiKey: () => void
  onCreateAnotherProject: () => void
}

export function ProjectCreateSuccess({
  copyMessage,
  createdApiKey,
  createdProject,
  onCopyApiKey,
  onCreateAnotherProject,
}: ProjectCreateSuccessProps) {
  const createdProjectHref = createdProject?.id
    ? `/projetos/${encodeURIComponent(createdProject.id)}`
    : '/projetos'

  return (
    <ProjectCreateRoot>
      <ProjectCreateHeader>
        <HeaderContent>
          <HeaderEyebrow>Projetos</HeaderEyebrow>
          <HeaderTitle>Projeto criado</HeaderTitle>
          <HeaderSubtitle>
            O projeto foi cadastrado e a API key inicial foi gerada para o ambiente escolhido.
          </HeaderSubtitle>
        </HeaderContent>
      </ProjectCreateHeader>

      <SuccessPanel>
        <SuccessIcon>
          <CheckCircle2 size={24} />
        </SuccessIcon>
        <div>
          <SuccessTitle>{createdProject?.name ?? 'Projeto criado com sucesso'}</SuccessTitle>
          <SuccessDescription>
            A chave bruta fica disponível apenas neste momento, garanta de copiá-la e guardá-la em
            um local seguro. Caso perca a chave, será necessário gerar uma nova.
          </SuccessDescription>
        </div>

        <ApiKeyBox>
          <ApiKeyLabel>API Key</ApiKeyLabel>
          {createdApiKey.key ? (
            <ApiKeyCode>{createdApiKey.key}</ApiKeyCode>
          ) : (
            <FieldHelper $error>Chave bruta não retornada pela API.</FieldHelper>
          )}
          {copyMessage && <FieldHelper>{copyMessage}</FieldHelper>}
        </ApiKeyBox>

        <SuccessActions>
          <SuccessButton
            type="button"
            variant="outline"
            size="lg"
            disabled={!createdApiKey.key}
            onClick={onCopyApiKey}
          >
            <Clipboard size={16} />
            Copiar API key
          </SuccessButton>
          <SuccessButton href={createdProjectHref} size="lg">
            Abrir projeto
            <ArrowRight size={16} />
          </SuccessButton>
          <SuccessButton
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCreateAnotherProject}
          >
            Criar outro
          </SuccessButton>
        </SuccessActions>
      </SuccessPanel>
    </ProjectCreateRoot>
  )
}
