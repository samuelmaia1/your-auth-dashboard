'use client'

import type { ProjectCreateStep } from './project-create.shared'
import { ApiKeyStep, AuthPolicyStep, PasswordPolicyStep, ProjectDataStep } from './steps'
import { StepPanel } from './style'

type ProjectCreateStepContentProps = {
  activeStep: ProjectCreateStep
  isSubmitting: boolean
  onBack: () => void
  onNext: () => void
  projectAlreadyCreated: boolean
}

export function ProjectCreateStepContent({
  activeStep,
  isSubmitting,
  onBack,
  onNext,
  projectAlreadyCreated,
}: ProjectCreateStepContentProps) {
  return (
    <StepPanel
      id={`project-create-step-panel-${activeStep}`}
      role="tabpanel"
      aria-labelledby={`project-create-step-${activeStep}`}
    >
      <ProjectDataStep isActive={activeStep === 'project-data'} onBack={onBack} onNext={onNext} />
      <PasswordPolicyStep
        isActive={activeStep === 'password-policy'}
        onBack={onBack}
        onNext={onNext}
      />
      <AuthPolicyStep isActive={activeStep === 'auth-policy'} onBack={onBack} onNext={onNext} />
      <ApiKeyStep
        isActive={activeStep === 'api-key'}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onNext={onNext}
        projectAlreadyCreated={projectAlreadyCreated}
      />
    </StepPanel>
  )
}
