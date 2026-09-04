'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ProgressBar } from '@components/ui/progress-bar/progress-bar'
import {
  createProject,
  createProjectApiKey,
  isProjectsServiceError,
} from '@/services/project.service'
import type { ApiErrorResponse } from '@/types/api-response-types'
import type { CreatedProjectApiKeyResponse, ProjectResponse } from '@/types/project-types'
import {
  getNextProjectCreateStep,
  getPreviousProjectCreateStep,
  getProjectCreateBackendFieldErrors,
  getProjectCreateServiceErrorMessage,
  getProjectCreateStepContent,
  getProjectCreateStepForField,
  getProjectCreateStepIndex,
  projectCreateFieldNames,
  projectCreateSteps,
  type ProjectCreateFieldName,
  type ProjectCreateRequestStage,
  type ProjectCreateStep,
} from './project-create.shared'
import { ProjectCreateStepContent } from './project-create-step-content'
import { ProjectCreateStepControl } from './project-create-step-control'
import { ProjectCreateSuccess } from './project-create-success'
import {
  projectCreateDefaultValues,
  projectCreateFormSchema,
  toCreateProjectApiKeyPayload,
  toCreateProjectPayload,
  type ProjectCreateFormValues,
  type ProjectCreateSubmitValues,
} from '@lib/validations/project-create'

import {
  BackLink,
  FormAlert,
  FormDescription,
  FormHeading,
  FormPanel,
  FormStepMeta,
  FormTitle,
  HeaderActions,
  HeaderContent,
  HeaderEyebrow,
  HeaderSubtitle,
  HeaderTitle,
  ProjectCreateHeader,
  ProjectCreateRoot,
  WizardLayout,
} from './style'

export function ProjectCreate() {
  const [activeStep, setActiveStep] = useState<ProjectCreateStep>('project-data')
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const [createdProject, setCreatedProject] = useState<ProjectResponse | null>(null)
  const [createdApiKey, setCreatedApiKey] = useState<CreatedProjectApiKeyResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [pendingFocusField, setPendingFocusField] = useState<ProjectCreateFieldName | null>(null)
  const methods = useForm<ProjectCreateFormValues, unknown, ProjectCreateSubmitValues>({
    defaultValues: projectCreateDefaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(projectCreateFormSchema),
  })
  const activeStepContent = getProjectCreateStepContent(activeStep)
  const activeStepIndex = getProjectCreateStepIndex(activeStep)
  const progress = ((activeStepIndex + 1) / projectCreateSteps.length) * 100

  useEffect(() => {
    if (!pendingFocusField) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      methods.setFocus(pendingFocusField)
      setPendingFocusField(null)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [activeStep, methods, pendingFocusField])

  function goToNextStep() {
    setSubmitErrorMessage(null)
    setActiveStep((step) => getNextProjectCreateStep(step))
  }

  function goToPreviousStep() {
    setSubmitErrorMessage(null)
    setActiveStep((step) => getPreviousProjectCreateStep(step))
  }

  function applyBackendFieldErrors(
    apiError: ApiErrorResponse | null,
    stage: ProjectCreateRequestStage,
  ) {
    const fieldErrors = apiError ? getProjectCreateBackendFieldErrors(apiError, stage) : []

    if (fieldErrors.length === 0) {
      return
    }

    fieldErrors.forEach(({ field, message }) => {
      methods.setError(field, {
        type: 'server',
        message,
      })
    })

    const [{ field: firstErrorField }] = fieldErrors

    setActiveStep(getProjectCreateStepForField(firstErrorField))
    setPendingFocusField(firstErrorField)
  }

  function handleInvalidSubmit() {
    const firstErrorField = projectCreateFieldNames.find((fieldName) => {
      return Boolean(methods.getFieldState(fieldName).error)
    })

    if (!firstErrorField) {
      return
    }

    setActiveStep(getProjectCreateStepForField(firstErrorField))
    setPendingFocusField(firstErrorField)
  }

  async function handleCreateProject(data: ProjectCreateSubmitValues) {
    let stage: ProjectCreateRequestStage = createdProject ? 'apiKey' : 'project'

    setIsSubmitting(true)
    setSubmitErrorMessage(null)
    setCopyMessage(null)

    try {
      let project = createdProject

      if (!project) {
        stage = 'project'
        project = await createProject(toCreateProjectPayload(data))
        setCreatedProject(project)
      }

      stage = 'apiKey'

      if (!project.id) {
        throw new Error('Projeto criado, mas a resposta não retornou ID para gerar a API key.')
      }

      const apiKey = await createProjectApiKey({
        projectId: project.id,
        data: toCreateProjectApiKeyPayload(data),
      })

      setCreatedApiKey(apiKey)
    } catch (error: unknown) {
      const projectServiceError = isProjectsServiceError(error) ? error : null

      setSubmitErrorMessage(getProjectCreateServiceErrorMessage(error, stage))
      applyBackendFieldErrors(projectServiceError?.response ?? null, stage)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCopyApiKey() {
    const key = createdApiKey?.key

    if (!key) {
      return
    }

    try {
      await navigator.clipboard.writeText(key)
      setCopyMessage('API key copiada.')
    } catch {
      setCopyMessage('Não foi possível copiar a API key.')
    }
  }

  function handleCreateAnotherProject() {
    methods.reset(projectCreateDefaultValues)
    setActiveStep('project-data')
    setSubmitErrorMessage(null)
    setCreatedProject(null)
    setCreatedApiKey(null)
    setCopyMessage(null)
  }

  if (createdApiKey) {
    return (
      <ProjectCreateSuccess
        copyMessage={copyMessage}
        createdApiKey={createdApiKey}
        createdProject={createdProject}
        onCopyApiKey={handleCopyApiKey}
        onCreateAnotherProject={handleCreateAnotherProject}
      />
    )
  }

  return (
    <ProjectCreateRoot>
      <ProjectCreateHeader>
        <HeaderContent>
          <HeaderEyebrow>Projetos</HeaderEyebrow>
          <HeaderTitle>Novo projeto</HeaderTitle>
          <HeaderSubtitle>
            Configure dados básicos, políticas de acesso e uma API key inicial para o projeto.
          </HeaderSubtitle>
        </HeaderContent>

        <HeaderActions>
          <BackLink href="/projetos">
            <ArrowLeft size={16} />
            Projetos
          </BackLink>
        </HeaderActions>
      </ProjectCreateHeader>

      <WizardLayout>
        <ProjectCreateStepControl activeStep={activeStep} />

        <FormPanel>
          <FormHeading>
            <FormStepMeta>
              Etapa {activeStepIndex + 1} de {projectCreateSteps.length}
            </FormStepMeta>
            <FormTitle>{activeStepContent.title}</FormTitle>
            <FormDescription>{activeStepContent.description}</FormDescription>
          </FormHeading>

          <ProgressBar progress={progress} color="inherit" />

          {submitErrorMessage && <FormAlert role="alert">{submitErrorMessage}</FormAlert>}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleCreateProject, handleInvalidSubmit)}>
              <ProjectCreateStepContent
                activeStep={activeStep}
                isSubmitting={isSubmitting}
                onBack={goToPreviousStep}
                onNext={goToNextStep}
                projectAlreadyCreated={Boolean(createdProject)}
              />
            </form>
          </FormProvider>
        </FormPanel>
      </WizardLayout>
    </ProjectCreateRoot>
  )
}
