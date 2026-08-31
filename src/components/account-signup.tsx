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
import Link from 'next/link'
import { useState } from 'react'
import { useForm, useFormContext, type FieldPath, type UseFormTrigger } from 'react-hook-form'

import { Button } from '@components/ui/button/button'
import { MultiStepForm } from '@components/ui/multstep-form/multstep-form'
import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import {
  accountSignupDefaultValues,
  accountSignupSchema,
  toCreateAccountPayload,
  type AccountSignupFormValues,
  type CreateAccountPayload,
} from '@lib/validations/account-signup'
import { cn } from '@lib/utils'

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
    <Link href="/" className="flex items-center gap-2.5" aria-label="Your Auth, início">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <LockKeyhole className="size-4" strokeWidth={2.5} />
      </span>
      <span className="font-mono text-[15px] font-semibold">Your Auth</span>
    </Link>
  )
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {signupSteps.map(({ title, icon: Icon }, index) => {
        const isActive = index === currentStep
        const isComplete = index < currentStep

        return (
          <div
            key={title}
            aria-current={isActive ? 'step' : undefined}
            className={cn(
              'flex min-h-14 items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
              isActive && 'border-primary bg-secondary text-foreground',
              isComplete && 'border-accent/50 bg-accent/10 text-foreground',
              !isActive && !isComplete && 'border-border bg-background text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-md',
                isActive && 'bg-primary text-primary-foreground',
                isComplete && 'bg-accent text-accent-foreground',
                !isActive && !isComplete && 'bg-muted text-muted-foreground',
              )}
            >
              {isComplete ? <Check className="size-4" /> : <Icon className="size-4" />}
            </span>
            <span className="font-medium">{title}</span>
          </div>
        )
      })}
    </div>
  )
}

function OwnerStep({ onNext }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <RHFInput name="name" label="Nome" placeholder="Ana" type="text" />
        <RHFInput name="lastName" label="Sobrenome" placeholder="Martins" type="text" />
      </div>
      <RHFInput name="CPF" label="CPF" placeholder="000.000.000-00" mask={cpfMask} type="text" />

      <Button
        type="button"
        size="lg"
        className="mt-7 h-11 w-full gap-2 hover:bg-primary/90"
        onClick={() => validateStep(trigger, ownerStepFields, onNext)}
      >
        Continuar <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}

function ContactStep({ onNext, onBack }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <div className="space-y-5">
      <RHFInput name="email" label="E-mail" placeholder="ana@empresa.com" type="email" />

      <div className="grid gap-4 sm:grid-cols-[0.35fr_1fr]">
        <RHFInput name="phone.ddd" label="DDD" placeholder="11" mask={dddMask} type="text" />
        <RHFInput
          name="phone.number"
          label="Telefone"
          placeholder="99999-9999"
          mask={phoneNumberMask}
          type="text"
        />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-[.45fr_1fr]">
        <Button type="button" variant="outline" size="lg" className="h-11 gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-11 gap-2 hover:bg-primary/90"
          onClick={() => validateStep(trigger, contactStepFields, onNext)}
        >
          Continuar <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function AddressStep({ onNext, onBack }: StepProps) {
  const { trigger } = useFormContext<AccountSignupFormValues>()

  return (
    <div className="space-y-5">
      <RHFInput name="address.cep" label="CEP" placeholder="00000-000" mask={cepMask} type="text" />

      <div className="grid gap-4 sm:grid-cols-[1fr_0.35fr]">
        <RHFInput
          name="address.street"
          label="Logradouro"
          placeholder="Rua das Flores"
          type="text"
        />
        <RHFInput name="address.number" label="Número" placeholder="120" type="text" />
      </div>

      <RHFInput name="address.neighborhood" label="Bairro" placeholder="Centro" type="text" />

      <div className="grid gap-4 sm:grid-cols-[1fr_0.45fr]">
        <RHFInput name="address.city" label="Cidade" placeholder="São Paulo" type="text" />
        <RHFInput name="address.state" label="Estado" placeholder="SP" type="text" />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-[.45fr_1fr]">
        <Button type="button" variant="outline" size="lg" className="h-11 gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-11 gap-2 hover:bg-primary/90"
          onClick={() => validateStep(trigger, addressStepFields, onNext)}
        >
          Continuar <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
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
    <div className="grid gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-2">
      {rules.map((rule) => (
        <span
          key={rule.label}
          className={cn(
            'flex items-center gap-2 text-xs',
            rule.passed ? 'text-accent' : 'text-muted-foreground',
          )}
        >
          <Check className="size-3.5" />
          {rule.label}
        </span>
      ))}
    </div>
  )
}

function SecurityStep({ onBack }: StepProps) {
  const {
    formState: { isSubmitting },
    trigger,
  } = useFormContext<AccountSignupFormValues>()

  return (
    <div className="space-y-5">
      <RHFInput name="password" label="Senha" placeholder="********" type="password" />
      <PasswordChecklist />
      <RHFInput
        name="confirmPassword"
        label="Confirmar senha"
        placeholder="********"
        type="password"
      />

      <div className="mt-7 grid gap-3 sm:grid-cols-[.45fr_1fr]">
        <Button type="button" variant="outline" size="lg" className="h-11 gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 gap-2 hover:bg-primary/90"
          onClick={() => trigger(securityStepFields, { shouldFocus: true })}
        >
          Criar conta <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function SignupAside() {
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
    <aside className="hidden min-h-screen border-r border-border bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:px-10 lg:py-9 xl:px-14">
      <LogoLink />

      <div className="max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1.5 font-mono text-[11px] text-primary-foreground/70">
          <Sparkles className="size-3.5 text-accent" />
          Cadastro proprietário
        </div>
        <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] xl:text-6xl">
          Crie sua conta Your Auth com os dados certos desde o começo.
        </h1>
        <p className="mt-6 max-w-md text-pretty text-base leading-7 text-primary-foreground/70">
          Uma jornada curta para reunir identificação, contato, endereço e senha antes da ativação
          real da conta.
        </p>
      </div>

      <div className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/[0.06] p-5">
        <div className="flex items-center justify-between gap-4 border-b border-primary-foreground/10 pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase text-primary-foreground/50">
              POST /accounts/create
            </p>
            <p className="mt-1 text-sm font-medium">CreateAccountDTO</p>
          </div>
          <span className="rounded-md bg-accent px-2.5 py-1 font-mono text-[11px] font-semibold text-accent-foreground">
            201
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {setupItems.map(({ icon: Icon, title, status }) => (
            <div key={title} className="flex items-center gap-3 rounded-lg bg-background/10 p-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary-foreground/10">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-primary-foreground/55">{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function SuccessState({ data, onRestart }: { data: CreateAccountPayload; onRestart: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-8">
      <div className="flex size-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <CheckCircle2 className="size-6" />
      </div>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-accent">
        Cadastro validado
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
        Os dados da conta estão prontos.
      </h2>
      <p className="mt-4 leading-7 text-muted-foreground">
        O payload local segue o contrato de criação de conta proprietária. A chamada real ao backend
        entra quando conectarmos este fluxo.
      </p>

      <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Titular</p>
          <p className="mt-2 text-sm font-medium">
            {data.name} {data.lastName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{cpfMask(data.CPF)}</p>
        </div>
        <div className="bg-background p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Contato</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
            <Mail className="size-3.5" /> {data.email}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{formatPhone(data.phone)}</p>
        </div>
        <div className="bg-background p-4 sm:col-span-2">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Endereço</p>
          <p className="mt-2 text-sm font-medium">
            {data.address.street}, {data.address.number}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.address.neighborhood}, {data.address.city} - {data.address.state} - CEP{' '}
            {cepMask(data.address.cep)}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" className="h-11 flex-1" onClick={onRestart}>
          Revisar formulário
        </Button>
        <Link
          href="/"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Voltar para landing
        </Link>
      </div>
    </div>
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

  function handleRestart() {
    methods.reset(accountSignupDefaultValues)
    setSubmittedData(null)
    setCurrentStep(0)
  }

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[minmax(24rem,0.9fr)_minmax(0,1.1fr)]">
      <SignupAside />

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <LogoLink />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Landing
            </Link>
          </div>

          {submittedData ? (
            <SuccessState data={submittedData} onRestart={handleRestart} />
          ) : (
            <div className="rounded-lg border border-border bg-card p-5 shadow-2xl shadow-primary/10 sm:p-7">
              <StepIndicator currentStep={currentStep} />

              <div className="mt-8">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Etapa {currentStep + 1} de {signupSteps.length}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  {currentStepContent.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {currentStepContent.description}
                </p>
              </div>

              <MultiStepForm<AccountSignupFormValues>
                currentStep={currentStep}
                methods={methods}
                onSubmit={handleSubmit}
                setCurrentStep={setCurrentStep}
                steps={formSteps}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
