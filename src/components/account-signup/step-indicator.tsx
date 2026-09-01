import { Check } from 'lucide-react'

import { accountSignupSteps } from './steps'
import {
  StepIndicatorGrid,
  StepIndicatorIcon,
  StepIndicatorItem,
  StepIndicatorTitle,
  type StepStatus,
} from './style'

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <StepIndicatorGrid>
      {accountSignupSteps.map(({ title, icon: Icon }, index) => {
        const status: StepStatus =
          index === currentStep ? 'active' : index < currentStep ? 'complete' : 'pending'

        return (
          <StepIndicatorItem
            key={title}
            aria-current={status === 'active' ? 'step' : undefined}
            status={status}
          >
            <StepIndicatorIcon status={status}>
              {status === 'complete' ? <Check size={16} /> : <Icon size={16} />}
            </StepIndicatorIcon>
            <StepIndicatorTitle>{title}</StepIndicatorTitle>
          </StepIndicatorItem>
        )
      })}
    </StepIndicatorGrid>
  )
}
