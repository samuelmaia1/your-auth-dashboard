'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  IdCard,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm, useFormContext, type FieldPath, type UseFormTrigger } from 'react-hook-form'

import { MultiStepForm } from '@components/ui/multstep-form/multstep-form'
import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import { getAddressByCep, isViaCepLookupError, type ViaCepAddress } from '@lib/api/via-cep'
import {
  accountSignupDefaultValues,
  accountSignupSchema,
  toCreateAccountPayload,
  type AccountSignupFormValues,
  type CreateAccountPayload,
} from '@lib/validations/account-signup'

import {
  ActionGrid,
  AsideCopy,
  AsideDescription,
  AsideEyebrow,
  AsideTitle,
  BackLink,
  CityGrid,
  DataCell,
  DataDetail,
  DataGrid,
  DataLabel,
  DataValue,
  FormButton,
  FormCard,
  FormContent,
  FormDescription,
  FormHeading,
  FormSection,
  FormStack,
  FormStepMeta,
  FormTitle,
  FullWidthPrimaryButton,
  LogoLink as StyledLogoLink,
  LogoMark,
  LogoText,
  MobileHeader,
  PageRoot,
  PasswordRule,
  PasswordRules,
  PhoneGrid,
  PrimaryFormButton,
  SetupIcon,
  SetupItem,
  SetupItemStatus,
  SetupItemTitle,
  SetupList,
  SetupPanel,
  SetupPanelHeader,
  SetupPanelTitle,
  SignupAside as StyledSignupAside,
  StepIndicatorGrid,
  StepIndicatorIcon,
  StepIndicatorItem,
  StepIndicatorTitle,
  StreetGrid,
  SuccessActions,
  SuccessButton,
  SuccessCard,
  SuccessDescription,
  SuccessIcon,
  SuccessMeta,
  SuccessTitle,
  TwoColumnGrid,
  WelcomeBadge,
  type StepStatus,
} from './style'

type StepProps = {
  onNext: () => void
  onBack: () => void
  isLastStep: boolean
}

const signupSteps = [
  {
    title: 'Titular',
    description: 'Nome e documento da conta proprietária.',
    icon: UserRound,
  },
  {
    title: 'Contato',
    description: 'E-mail e telefone do responsável.',
    icon: Phone,
  },
  {
    title: 'Endereço',
    description: 'Endereço vinculado à conta.',
    icon: MapPin,
  },
  {
    title: 'Acesso',
    description: 'Senha de acesso da conta.',
    icon: ShieldCheck,
  },
]

const ownerStepFields: Array<FieldPath<AccountSignupFormValues>> = ['name', 'lastName', 'CPF']

const contactStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'email',
  'phone.ddd',
  'phone.number',
]

const addressStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'address.cep',
  'address.street',
  'address.number',
  'address.neighborhood',
  'address.city',
  'address.state',
]

const securityStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'password',
  'confirmPassword',
]

const formSteps = [OwnerStep, ContactStep, AddressStep, SecurityStep]

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function cpfMask(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

function cepMask(value: string) {
  const digits = onlyDigits(value).slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function dddMask(value: string) {
  return onlyDigits(value).slice(0, 2)
}

function phoneNumberMask(value: string) {
  const digits = onlyDigits(value).slice(0, 9)

  if (digits.length <= 4) {
    return digits
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function formatPhone(phone: CreateAccountPayload['phone']) {
  return `(${phone.ddd}) ${phoneNumberMask(phone.number)}`
}

async function validateStep(
  trigger: UseFormTrigger<AccountSignupFormValues>,
  fields: Array<FieldPath<AccountSignupFormValues>>,
  onNext: () => void,
) {
  const isValid = await trigger(fields, { shouldFocus: true })

  if (isValid) {
    onNext()
  }
}

function LogoLink() {
  return (
    <StyledLogoLink href="/" aria-label="Your Auth, início">
      <LogoMark>
        <LockKeyhole size={16} strokeWidth={2.5} />
      </LogoMark>
      <LogoText>Your Auth</LogoText>
    </StyledLogoLink>
  )
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <StepIndicatorGrid>
      {signupSteps.map(({ title, icon: Icon }, index) => {
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

function OwnerStep({ onNext }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <FormStack>
      <TwoColumnGrid>
        <RHFInput name="name" label="Nome" placeholder="Ana" type="text" />
        <RHFInput name="lastName" label="Sobrenome" placeholder="Martins" type="text" />
      </TwoColumnGrid>
      <RHFInput name="CPF" label="CPF" placeholder="000.000.000-00" mask={cpfMask} type="text" />

      <FullWidthPrimaryButton
        type="button"
        size="lg"
        onClick={() => validateStep(trigger, ownerStepFields, onNext)}
      >
        Continuar <ArrowRight size={16} />
      </FullWidthPrimaryButton>
    </FormStack>
  )
}

function ContactStep({ onNext, onBack }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <FormStack>
      <RHFInput name="email" label="E-mail" placeholder="ana@empresa.com" type="email" />

      <PhoneGrid>
        <RHFInput name="phone.ddd" label="DDD" placeholder="11" mask={dddMask} type="text" />
        <RHFInput
          name="phone.number"
          label="Telefone"
          placeholder="99999-9999"
          mask={phoneNumberMask}
          type="text"
        />
      </PhoneGrid>

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton
          type="button"
          size="lg"
          onClick={() => validateStep(trigger, contactStepFields, onNext)}
        >
          Continuar <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}

function AddressStep({ onNext, onBack }: StepProps) {
  const { clearErrors, setError, setValue, trigger } = useFormContext<AccountSignupFormValues>()
  const [isAddressLookupLoading, setIsAddressLookupLoading] = useState(false)
  const addressLookupControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      addressLookupControllerRef.current?.abort()
    }
  }, [])

  function clearAddressFields() {
    setValue('address.street', '', { shouldDirty: true })
    setValue('address.neighborhood', '', { shouldDirty: true })
    setValue('address.city', '', { shouldDirty: true })
    setValue('address.state', '', { shouldDirty: true })
  }

  function fillAddressFields(address: ViaCepAddress) {
    setValue('address.street', address.street, { shouldDirty: true, shouldValidate: true })
    setValue('address.neighborhood', address.neighborhood, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('address.city', address.city, { shouldDirty: true, shouldValidate: true })
    setValue('address.state', address.state, { shouldDirty: true, shouldValidate: true })
    clearErrors([
      'address.cep',
      'address.street',
      'address.neighborhood',
      'address.city',
      'address.state',
    ])
  }

  function handleCepChange(nextCep: string) {
    const cepDigits = onlyDigits(nextCep)

    clearErrors('address.cep')
    addressLookupControllerRef.current?.abort()
    addressLookupControllerRef.current = null

    if (cepDigits.length !== 8) {
      setIsAddressLookupLoading(false)
      return
    }

    const controller = new AbortController()

    addressLookupControllerRef.current = controller
    setIsAddressLookupLoading(true)
    clearAddressFields()

    void getAddressByCep(cepDigits, controller.signal)
      .then((address) => {
        if (addressLookupControllerRef.current !== controller) {
          return
        }

        fillAddressFields(address)
      })
      .catch((error: unknown) => {
        if (addressLookupControllerRef.current !== controller || controller.signal.aborted) {
          return
        }

        setError('address.cep', {
          type: 'manual',
          message: isViaCepLookupError(error)
            ? error.message
            : 'Não foi possível buscar o endereço pelo CEP.',
        })
      })
      .finally(() => {
        if (addressLookupControllerRef.current === controller) {
          addressLookupControllerRef.current = null
          setIsAddressLookupLoading(false)
        }
      })
  }

  return (
    <FormStack>
      <RHFInput
        name="address.cep"
        label="CEP"
        placeholder="00000-000"
        mask={cepMask}
        onValueChange={handleCepChange}
        type="text"
      />

      <StreetGrid>
        <RHFInput
          name="address.street"
          label="Logradouro"
          placeholder="Rua das Flores"
          disabled={isAddressLookupLoading}
          type="text"
        />
        <RHFInput
          name="address.number"
          label="Número"
          placeholder="120"
          disabled={isAddressLookupLoading}
          type="text"
        />
      </StreetGrid>

      <RHFInput
        name="address.neighborhood"
        label="Bairro"
        placeholder="Centro"
        disabled={isAddressLookupLoading}
        type="text"
      />

      <CityGrid>
        <RHFInput
          name="address.city"
          label="Cidade"
          placeholder="São Paulo"
          disabled={isAddressLookupLoading}
          type="text"
        />
        <RHFInput
          name="address.state"
          label="Estado"
          placeholder="SP"
          disabled={isAddressLookupLoading}
          type="text"
        />
      </CityGrid>

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton
          type="button"
          size="lg"
          disabled={isAddressLookupLoading}
          onClick={() => validateStep(trigger, addressStepFields, onNext)}
        >
          Continuar <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}

function PasswordChecklist() {
  const { watch } = useFormContext<AccountSignupFormValues>()
  const password = watch('password')
  const rules = [
    {
      label: '8 caracteres',
      passed: password.length >= 8,
    },
    {
      label: 'Letra minúscula',
      passed: /[a-z]/.test(password),
    },
    {
      label: 'Letra maiúscula',
      passed: /[A-Z]/.test(password),
    },
    {
      label: 'Número',
      passed: /[0-9]/.test(password),
    },
  ]

  return (
    <PasswordRules>
      {rules.map((rule) => (
        <PasswordRule key={rule.label} passed={rule.passed}>
          <Check size={14} />
          {rule.label}
        </PasswordRule>
      ))}
    </PasswordRules>
  )
}

function SecurityStep({ onBack }: StepProps) {
  const {
    formState: { isSubmitting },
    trigger,
  } = useFormContext<AccountSignupFormValues>()

  return (
    <FormStack>
      <RHFInput name="password" label="Senha" placeholder="********" type="password" />
      <PasswordChecklist />
      <RHFInput
        name="confirmPassword"
        label="Confirmar senha"
        placeholder="********"
        type="password"
      />

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton
          type="submit"
          size="lg"
          disabled={isSubmitting}
          onClick={() => trigger(securityStepFields, { shouldFocus: true })}
        >
          Criar conta <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}

type SignupAsideProps = {
  currentStep: number
  isSignupComplete: boolean
}

function SignupAside({ currentStep, isSignupComplete }: SignupAsideProps) {
  const setupItems = [
    {
      icon: IdCard,
      title: 'Conta proprietária',
      status: 'Nome, sobrenome e CPF',
    },
    {
      icon: Mail,
      title: 'Contato principal',
      status: 'E-mail e telefone',
    },
    {
      icon: MapPin,
      title: 'Endereço cadastral',
      status: 'Dados completos',
    },
    {
      icon: KeyRound,
      title: 'Credenciais',
      status: 'Senha forte',
    },
  ]

  return (
    <StyledSignupAside>
      <LogoLink />

      <AsideCopy>
        <AsideEyebrow>
          <Sparkles size={14} />
          Cadastro de conta
        </AsideEyebrow>
        <AsideTitle>Crie sua conta Your Auth.</AsideTitle>
        <AsideDescription>
          Uma jornada curta para reunir identificação, contato, endereço e senha antes da ativação
          real da conta.
        </AsideDescription>
      </AsideCopy>

      <SetupPanel>
        <SetupPanelHeader>
          <SetupPanelTitle>Dados para criação da conta:</SetupPanelTitle>
          <WelcomeBadge>Bem vindo!</WelcomeBadge>
        </SetupPanelHeader>

        <SetupList>
          {setupItems.map(({ icon: Icon, title, status: statusText }, index) => {
            const status: StepStatus =
              isSignupComplete || index < currentStep
                ? 'complete'
                : index === currentStep
                  ? 'active'
                  : 'pending'
            const StatusIcon = status === 'complete' ? CheckCircle2 : Icon

            return (
              <SetupItem key={title} status={status}>
                <SetupIcon complete={status === 'complete'}>
                  <StatusIcon size={16} />
                </SetupIcon>
                <div>
                  <SetupItemTitle>{title}</SetupItemTitle>
                  <SetupItemStatus status={status}>
                    {status === 'complete' ? 'Concluído' : statusText}
                  </SetupItemStatus>
                </div>
              </SetupItem>
            )
          })}
        </SetupList>
      </SetupPanel>
    </StyledSignupAside>
  )
}

function SuccessState({ data, onEdit }: { data: CreateAccountPayload; onEdit: () => void }) {
  return (
    <SuccessCard>
      <SuccessIcon>
        <CheckCircle2 size={24} />
      </SuccessIcon>
      <SuccessMeta>Cadastro validado</SuccessMeta>
      <SuccessTitle>Os dados da conta estão prontos.</SuccessTitle>
      <SuccessDescription>
        O payload local segue o contrato de criação de conta proprietária. A chamada real ao backend
        entra quando conectarmos este fluxo.
      </SuccessDescription>

      <DataGrid>
        <DataCell>
          <DataLabel>Titular</DataLabel>
          <DataValue>
            {data.name} {data.lastName}
          </DataValue>
          <DataDetail>{cpfMask(data.CPF)}</DataDetail>
        </DataCell>
        <DataCell>
          <DataLabel>Contato</DataLabel>
          <DataValue>
            <Mail size={14} /> {data.email}
          </DataValue>
          <DataDetail>{formatPhone(data.phone)}</DataDetail>
        </DataCell>
        <DataCell wide>
          <DataLabel>Endereço</DataLabel>
          <DataValue>
            {data.address.street}, {data.address.number}
          </DataValue>
          <DataDetail>
            {data.address.neighborhood}, {data.address.city} - {data.address.state} - CEP{' '}
            {cepMask(data.address.cep)}
          </DataDetail>
        </DataCell>
      </DataGrid>

      <SuccessActions>
        <SuccessButton type="button" size="lg">
          Criar conta
        </SuccessButton>
        <SuccessButton type="button" variant="outline" size="lg" onClick={onEdit}>
          Editar dados
        </SuccessButton>
      </SuccessActions>
    </SuccessCard>
  )
}

export function AccountSignup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submittedData, setSubmittedData] = useState<CreateAccountPayload | null>(null)
  const methods = useForm<AccountSignupFormValues>({
    defaultValues: accountSignupDefaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(accountSignupSchema),
  })
  const currentStepContent = signupSteps[currentStep] ?? signupSteps[0]

  function handleSubmit(data: AccountSignupFormValues) {
    setSubmittedData(toCreateAccountPayload(data))
  }

  function handleEdit() {
    setSubmittedData(null)
  }

  return (
    <PageRoot>
      <SignupAside currentStep={currentStep} isSignupComplete={submittedData !== null} />

      <FormSection>
        <FormContent>
          <MobileHeader>
            <LogoLink />
            <BackLink href="/">
              <ArrowLeft size={16} />
              Landing
            </BackLink>
          </MobileHeader>

          {submittedData ? (
            <SuccessState data={submittedData} onEdit={handleEdit} />
          ) : (
            <FormCard>
              <StepIndicator currentStep={currentStep} />

              <FormHeading>
                <FormStepMeta>
                  Etapa {currentStep + 1} de {signupSteps.length}
                </FormStepMeta>
                <FormTitle>{currentStepContent.title}</FormTitle>
                <FormDescription>{currentStepContent.description}</FormDescription>
              </FormHeading>

              <MultiStepForm<AccountSignupFormValues>
                currentStep={currentStep}
                methods={methods}
                onSubmit={handleSubmit}
                setCurrentStep={setCurrentStep}
                steps={formSteps}
              />
            </FormCard>
          )}
        </FormContent>
      </FormSection>
    </PageRoot>
  )
}
