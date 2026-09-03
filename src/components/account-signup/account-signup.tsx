'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type FieldPath } from 'react-hook-form'

import { Modal } from '@components/ui/modal'
import { MultiStepForm } from '@components/ui/multstep-form/multstep-form'
import { LogoLink } from './logo-link'
import { SignupAside } from './signup-aside'
import { StepIndicator } from './step-indicator'
import { SummaryState } from './summary-state'
import {
  accountSignupDefaultValues,
  accountSignupSchema,
  toCreateAccountPayload,
  type AccountSignupFormValues,
  type CreateAccountPayload,
} from '@lib/validations/account-signup'
import { accountSignupFieldNames, accountSignupSteps, formSteps, signupStepFields } from './steps'
import { createAccount, isCreateAccountServiceError } from '@/services/account.service'
import type { AccountResponse } from '@/types/account-types'
import type { ApiErrorResponse } from '@/types/api-response-types'
import { normalizeFieldName } from '@/utils/normalizer'

import {
  BackLink,
  FormAlert,
  FormCard,
  FormContent,
  FormDescription,
  FormHeading,
  FormSection,
  FormStepMeta,
  FormSwitchFooter,
  FormSwitchLink,
  FormSwitchText,
  FormTitle,
  MobileHeader,
  PageRoot,
  SuccessModalActions,
  SuccessModalButton,
  SuccessModalMessage,
} from './style'

const backendFieldAliases: Record<string, FieldPath<AccountSignupFormValues>> = {
  address: 'address.cep',
  cpf: 'CPF',
  phone: 'phone.ddd',
}

type NormalizedBackendFieldError = {
  field: FieldPath<AccountSignupFormValues>
  message: string
}

const defaultSignupErrorMessage =
  'Não foi possível criar a conta. Revise os dados e tente novamente.'

function getBackendFieldErrors(apiError: ApiErrorResponse) {
  const fallbackMessage = apiError.message ?? 'Revise este campo.'
  const { fields } = apiError

  if (!fields) {
    return []
  }

  if (Array.isArray(fields)) {
    return fields.reduce<NormalizedBackendFieldError[]>((errors, fieldError) => {
      const fieldName =
        typeof fieldError === 'string'
          ? fieldError
          : (fieldError.field ?? fieldError.name ?? fieldError.path)
      const field = fieldName
        ? normalizeFieldName(fieldName, {
            aliases: backendFieldAliases,
            fieldNames: accountSignupFieldNames,
          })
        : null

      if (field) {
        errors.push({
          field,
          message:
            typeof fieldError === 'string'
              ? fallbackMessage
              : (fieldError.message ?? fallbackMessage),
        })
      }

      return errors
    }, [])
  }

  return Object.entries(fields).reduce<NormalizedBackendFieldError[]>(
    (errors, [fieldName, message]) => {
      const field = normalizeFieldName(fieldName, {
        aliases: backendFieldAliases,
        fieldNames: accountSignupFieldNames,
      })

      if (field) {
        errors.push({
          field,
          message: message || fallbackMessage,
        })
      }

      return errors
    },
    [],
  )
}

function getStepIndexForField(field: FieldPath<AccountSignupFormValues>) {
  const stepIndex = signupStepFields.findIndex((fields) => fields.includes(field))

  return stepIndex === -1 ? 0 : stepIndex
}

export function AccountSignup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submittedData, setSubmittedData] = useState<CreateAccountPayload | null>(null)
  const [createdAccount, setCreatedAccount] = useState<AccountResponse | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [pendingFocusField, setPendingFocusField] =
    useState<FieldPath<AccountSignupFormValues> | null>(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const methods = useForm<AccountSignupFormValues>({
    defaultValues: accountSignupDefaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(accountSignupSchema),
  })
  const currentStepContent = accountSignupSteps[currentStep] ?? accountSignupSteps[0]
  const successAccountName = createdAccount
    ? `${createdAccount.name ?? ''} ${createdAccount.lastName ?? ''}`.trim() || 'sua conta'
    : 'sua conta'

  useEffect(() => {
    if (!pendingFocusField) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      methods.setFocus(pendingFocusField)
      setPendingFocusField(null)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [currentStep, methods, pendingFocusField])

  function handleReview(data: AccountSignupFormValues) {
    setSubmitErrorMessage(null)
    setSubmittedData(toCreateAccountPayload(data))
  }

  function handleBackToStart() {
    methods.clearErrors()
    setSubmitErrorMessage(null)
    setSubmittedData(null)
    setCurrentStep(0)
  }

  async function handleCreateAccount() {
    if (!submittedData) {
      return
    }

    setIsCreatingAccount(true)
    setSubmitErrorMessage(null)

    try {
      const account = await createAccount(submittedData)

      setCreatedAccount(account)
      setIsSuccessModalOpen(true)
    } catch (error: unknown) {
      const createAccountError = isCreateAccountServiceError(error) ? error : null
      const apiError = createAccountError?.response ?? null
      const fieldErrors = apiError ? getBackendFieldErrors(apiError) : []

      setSubmitErrorMessage(createAccountError?.message ?? defaultSignupErrorMessage)

      if (fieldErrors.length === 0) {
        return
      }

      setSubmittedData(null)

      fieldErrors.forEach(({ field, message }) => {
        methods.setError(field, {
          type: 'server',
          message,
        })
      })

      const [{ field: firstErrorField }] = fieldErrors
      const targetStep = getStepIndexForField(firstErrorField)

      setCurrentStep(targetStep)
      setPendingFocusField(firstErrorField)
    } finally {
      setIsCreatingAccount(false)
    }
  }

  return (
    <PageRoot>
      <SignupAside
        currentStep={currentStep}
        isSignupComplete={submittedData !== null || createdAccount !== null}
      />

      <FormSection>
        <FormContent>
          <MobileHeader>
            <LogoLink />
            <BackLink href="/">
              <ArrowLeft size={16} />
              Tela inicial
            </BackLink>
          </MobileHeader>

          {submittedData ? (
            <SummaryState
              data={submittedData}
              errorMessage={submitErrorMessage}
              isLoading={isCreatingAccount}
              onBackToStart={handleBackToStart}
              onCreate={handleCreateAccount}
            />
          ) : (
            <FormCard>
              <StepIndicator currentStep={currentStep} />

              <FormHeading>
                <FormStepMeta>
                  Etapa {currentStep + 1} de {accountSignupSteps.length}
                </FormStepMeta>
                <FormTitle>{currentStepContent.title}</FormTitle>
                <FormDescription>{currentStepContent.description}</FormDescription>
              </FormHeading>

              {submitErrorMessage && <FormAlert role="alert">{submitErrorMessage}</FormAlert>}

              <MultiStepForm<AccountSignupFormValues>
                currentStep={currentStep}
                methods={methods}
                onSubmit={handleReview}
                setCurrentStep={setCurrentStep}
                steps={formSteps}
              />

              <FormSwitchFooter>
                <FormSwitchText>Já tem uma conta?</FormSwitchText>
                <FormSwitchLink href="/login">
                  <LogIn size={16} />
                  Fazer login
                </FormSwitchLink>
              </FormSwitchFooter>
            </FormCard>
          )}
        </FormContent>
      </FormSection>

      <Modal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Conta criada com sucesso"
        subtitle={`Boas-vindas, ${successAccountName}.`}
        icon={<CheckCircle2 size={24} />}
      >
        <SuccessModalMessage>
          Sua conta Your Auth foi criada. Você já pode seguir para a tela de login.
        </SuccessModalMessage>
        <SuccessModalActions>
          <SuccessModalButton href="/login" size="lg">
            Ir para login
          </SuccessModalButton>
        </SuccessModalActions>
      </Modal>
    </PageRoot>
  )
}
