'use client'

import { Activity, ArrowLeft, Key, KeyRound, RefreshCcw, ShieldCheck, Users } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getProjectById } from '@/services/project.service'
import type { ProjectResponse } from '@/types/project-types'

import {
  fetchResource,
  ResourceError,
  type ProjectDetailsTab,
  type ProjectDetailsTabItem,
  type ResourceState,
} from './project-details.shared'
import { ProjectDetailsTabContent } from './project-details-tab-content'
import { ProjectOverviewDetails } from './project-overview-details'
import {
  BackLink,
  HeaderActions,
  HeaderButton,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  ProjectDetailsHeader,
  ProjectDetailsRoot,
  TabButton,
  TabList,
  TabsSection,
} from './style'

type ProjectDetailsProps = {
  projectId: string
}

const defaultProjectErrorMessage =
  'Não foi possível carregar o projeto. Tente novamente em alguns instantes.'

const projectDetailsTabs: ProjectDetailsTabItem[] = [
  {
    key: 'sessions',
    label: 'Sessões',
    icon: Activity,
  },
  {
    key: 'users',
    label: 'Usuários',
    icon: Users,
  },
  {
    key: 'password-policy',
    label: 'Política de Senha',
    icon: KeyRound,
  },
  {
    key: 'auth-policy',
    label: 'Política de autenticação',
    icon: ShieldCheck,
  },
  {
    key: 'api-keys',
    label: 'API Keys',
    icon: Key,
  },
]

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailsTab>('sessions')
  const [projectState, setProjectState] = useState<ResourceState<ProjectResponse>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  })
  const projectRequestIdRef = useRef(0)
  const project = projectState.data
  const projectTitle =
    projectState.isLoading && !project
      ? 'Carregando projeto'
      : project?.name?.trim() || 'Projeto sem nome'
  const projectSubtitle =
    projectState.isLoading && !project
      ? 'Buscando dados básicos do projeto.'
      : project?.description?.trim() || 'Sem descrição.'

  const loadProject = useCallback(async () => {
    const requestId = projectRequestIdRef.current + 1

    projectRequestIdRef.current = requestId
    setProjectState((currentState) => ({
      ...currentState,
      isLoading: true,
      errorMessage: null,
    }))

    const { data, errorMessage } = await fetchResource(
      () => getProjectById(projectId),
      defaultProjectErrorMessage,
    )

    if (projectRequestIdRef.current === requestId) {
      setProjectState({
        data,
        isLoading: false,
        errorMessage,
      })
    }
  }, [projectId])

  useEffect(() => {
    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadProject()
      }
    })

    return () => {
      shouldLoad = false
      projectRequestIdRef.current += 1
    }
  }, [loadProject])

  return (
    <ProjectDetailsRoot>
      <ProjectDetailsHeader>
        <HeaderContent>
          <HeaderEyebrow>Projeto</HeaderEyebrow>
          <HeaderTitle>{projectTitle}</HeaderTitle>
          <HeaderSubtitle>{projectSubtitle}</HeaderSubtitle>
        </HeaderContent>

        <HeaderActions>
          <BackLink href="/projetos">
            <ArrowLeft size={16} />
            Projetos
          </BackLink>
          <HeaderButton type="button" size="lg" variant="outline" onClick={loadProject}>
            <RefreshCcw size={16} />
            Atualizar
          </HeaderButton>
        </HeaderActions>
      </ProjectDetailsHeader>

      {projectState.errorMessage ? (
        <ResourceError message={projectState.errorMessage} onRetry={loadProject} />
      ) : (
        <>
          <ProjectOverviewDetails
            isLoading={projectState.isLoading}
            project={project}
            projectId={projectId}
          />

          <TabsSection>
            <TabList role="tablist" aria-label="Dados do projeto">
              {projectDetailsTabs.map(({ icon: Icon, key, label }) => {
                const isActive = activeTab === key

                return (
                  <TabButton
                    key={key}
                    id={`project-tab-${key}`}
                    type="button"
                    $active={isActive}
                    role="tab"
                    aria-controls={`project-tab-panel-${key}`}
                    aria-selected={isActive}
                    onClick={() => setActiveTab(key)}
                  >
                    <Icon size={16} />
                    {label}
                  </TabButton>
                )
              })}
            </TabList>

            <ProjectDetailsTabContent activeTab={activeTab} projectId={projectId} />
          </TabsSection>
        </>
      )}
    </ProjectDetailsRoot>
  )
}
