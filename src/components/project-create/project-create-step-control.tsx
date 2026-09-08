import { CheckCircle2 } from 'lucide-react'

import {
  getProjectCreateStepStatus,
  projectCreateSteps,
  type ProjectCreateStep,
} from './project-create.shared'
import { StepCopy, StepIcon, StepItem, StepList, StepMeta, StepsPanel, StepTitle } from './style'

type ProjectCreateStepControlProps = {
  activeStep: ProjectCreateStep
}

export function ProjectCreateStepControl({ activeStep }: ProjectCreateStepControlProps) {
  return (
    <StepsPanel aria-label="Etapas de criação do projeto">
      <StepList>
        {projectCreateSteps.map(({ icon: Icon, key, title }, index) => {
          const status = getProjectCreateStepStatus(key, activeStep)

          return (
            <StepItem
              key={key}
              id={`project-create-step-${key}`}
              $status={status}
              aria-current={status === 'active' ? 'step' : undefined}
            >
              <StepIcon $status={status}>
                {status === 'complete' ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </StepIcon>
              <StepCopy>
                <StepTitle>{title}</StepTitle>
                <StepMeta>
                  Etapa {index + 1} de {projectCreateSteps.length}
                </StepMeta>
              </StepCopy>
            </StepItem>
          )
        })}
      </StepList>
    </StepsPanel>
  )
}
