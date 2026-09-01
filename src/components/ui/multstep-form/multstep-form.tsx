'use client'

import React, { useState } from 'react'
import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'
import { ProgressBar } from '@components/ui/progress-bar/progress-bar'

type MultiStepFormStepProps = {
  onNext: () => void
  onBack: () => void
  isLastStep: boolean
}

interface MultiStepFormProps<
  TIn extends FieldValues,
  TOut extends FieldValues = TIn,
  TStepProps extends object = object,
> {
  methods: UseFormReturn<TIn, unknown, TOut>
  onSubmit: (data: TOut) => void
  steps: Array<React.ComponentType<MultiStepFormStepProps & TStepProps>>

  currentStep?: number
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>
  stepProps?: TStepProps
}

export function MultiStepForm<
  TIn extends FieldValues,
  TOut extends FieldValues = TIn,
  TStepProps extends object = object,
>({
  methods,
  onSubmit,
  steps,
  currentStep,
  setCurrentStep,
  stepProps,
}: MultiStepFormProps<TIn, TOut, TStepProps>) {
  const [internalStep, setInternalStep] = useState(0)

  const step = currentStep ?? internalStep
  const setStep = setCurrentStep ?? setInternalStep

  const totalSteps = steps.length

  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1))
  const back = () => setStep((prev) => Math.max(prev - 1, 0))

  const CurrentStepComponent = steps[step]
  const isLastStep = step === totalSteps - 1
  const currentStepProps = {
    onNext: next,
    onBack: back,
    isLastStep,
    ...(stepProps ?? {}),
  } as MultiStepFormStepProps & TStepProps

  return (
    <>
      {totalSteps > 1 && <ProgressBar progress={((step + 1) / totalSteps) * 100} color="inherit" />}

      <FormProvider {...methods}>
        <form
          onSubmit={
            isLastStep
              ? methods.handleSubmit(onSubmit)
              : (event) => {
                  event.preventDefault()
                }
          }
        >
          <CurrentStepComponent {...currentStepProps} />
        </form>
      </FormProvider>
    </>
  )
}
