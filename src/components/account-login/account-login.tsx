'use client'

import { ArrowLeft, CheckCircle2, GitBranch, LoaderCircle, LogIn, UserPlus } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'

import { Input } from '@components/ui/input/input'
import { LogoLink } from '@components/account-signup/logo-link'
import { useAuth } from '@/hooks/use-auth'
import { isAuthAccountServiceError, startSocialLogin } from '@/services/auth-account.service'
import type { AccountResponse, LoginAccountRequest } from '@/types/account-types'
import type { SocialProvider } from '@lib/api/urls'

import { LoginAside } from './login-aside'
import {
  BackLink,
  FormAlert,
  FormCard,
  FormContent,
  FormDescription,
  FormSection,
  FormStack,
  FormStepMeta,
  FormTitle,
  LoginForm,
  LoginFormHeading,
  LoginPrimaryButton,
  LoginSuccessAlert,
  LoginSignupFooter,
  LoginSignupFooterLink,
  LoginSignupFooterText,
  MobileHeader,
  PageRoot,
  SocialIconMark,
  SocialLoadingIcon,
  SocialLoginButton,
  SocialLoginGroup,
  SocialLoginSeparator,
  SubmitLoadingIcon,
} from './style'

type LoginFormValues = {
  email: string
  password: string
}

type LoginField = keyof LoginFormValues
type LoginFieldErrors = Partial<Record<LoginField, string>>

const initialLoginFormValues: LoginFormValues = {
  email: '',
  password: '',
}

const defaultLoginErrorMessage =
  'Não foi possível entrar. Confira suas credenciais e tente novamente.'
const defaultSocialLoginStartErrorMessage =
  'Não foi possível iniciar o login social. Tente novamente em alguns instantes.'

const socialProviderLabels: Record<SocialProvider, string> = {
  google: 'Google',
  github: 'GitHub',
}

function validateLoginForm(data: LoginFormValues) {
  const errors: LoginFieldErrors = {}
  const email = data.email.trim()

  if (!email) {
    errors.email = 'Informe seu e-mail.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!data.password) {
    errors.password = 'Informe sua senha.'
  }

  return errors
}

function toLoginAccountPayload(data: LoginFormValues): LoginAccountRequest {
  return {
    email: data.email.trim(),
    password: data.password,
  }
}

export function AccountLogin() {
  const { login } = useAuth()
  const [formValues, setFormValues] = useState(initialLoginFormValues)
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const [authenticatedAccount, setAuthenticatedAccount] = useState<AccountResponse | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authenticatingProvider, setAuthenticatingProvider] = useState<SocialProvider | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isLoginActionPending = isAuthenticating || !!authenticatingProvider
  const authenticatedAccountName = authenticatedAccount
    ? `${authenticatedAccount.name ?? ''} ${authenticatedAccount.lastName ?? ''}`.trim()
    : ''
  const successMessage = authenticatedAccount
    ? authenticatedAccountName
      ? `Login realizado. Boas-vindas, ${authenticatedAccountName}.`
      : 'Login realizado. Sua sessão foi iniciada com segurança.'
    : null

  function handleFieldChange(field: keyof LoginFormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }))
      setFieldErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors
        }

        const nextErrors = { ...currentErrors }
        delete nextErrors[field]

        return nextErrors
      })
      setSubmitErrorMessage(null)
      setAuthenticatedAccount(null)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoginActionPending) {
      return
    }

    const validationErrors = validateLoginForm(formValues)

    setFieldErrors(validationErrors)
    setSubmitErrorMessage(null)
    setAuthenticatedAccount(null)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsAuthenticating(true)

    try {
      const account = await login(toLoginAccountPayload(formValues))

      setAuthenticatedAccount(account)
    } catch (error: unknown) {
      const authAccountError = isAuthAccountServiceError(error) ? error : null

      setSubmitErrorMessage(authAccountError?.message ?? defaultLoginErrorMessage)
      setFieldErrors({})
    } finally {
      setIsAuthenticating(false)
    }
  }

  function handleSocialLogin(provider: SocialProvider) {
    if (isLoginActionPending) {
      return
    }

    setSubmitErrorMessage(null)
    setFieldErrors({})
    setAuthenticatedAccount(null)
    setAuthenticatingProvider(provider)

    try {
      startSocialLogin(provider)
    } catch {
      setAuthenticatingProvider(null)
      setSubmitErrorMessage(defaultSocialLoginStartErrorMessage)
    }
  }

  function renderSocialButtonIcon(provider: SocialProvider) {
    if (authenticatingProvider === provider) {
      return (
        <SocialLoadingIcon>
          <LoaderCircle size={16} />
        </SocialLoadingIcon>
      )
    }

    if (provider === 'github') {
      return <GitBranch size={16} />
    }

    return <SocialIconMark aria-hidden="true">G</SocialIconMark>
  }

  return (
    <PageRoot>
      <LoginAside />

      <FormSection>
        <FormContent>
          <MobileHeader>
            <LogoLink />
            <BackLink href="/">
              <ArrowLeft size={16} />
              Tela inicial
            </BackLink>
          </MobileHeader>

          <FormCard>
            <LoginFormHeading>
              <FormStepMeta>Acesso da conta</FormStepMeta>
              <FormTitle>Acesse sua conta</FormTitle>
              <FormDescription>
                Informe suas credenciais para entrar e continuar usando os recursos da plataforma.
              </FormDescription>
            </LoginFormHeading>

            {submitErrorMessage && <FormAlert role="alert">{submitErrorMessage}</FormAlert>}
            {successMessage && (
              <LoginSuccessAlert role="status">
                <CheckCircle2 size={16} />
                {successMessage}
              </LoginSuccessAlert>
            )}

            <SocialLoginGroup aria-label="Entrar com provedor social">
              {(['google', 'github'] as const).map((provider) => {
                const providerLabel = socialProviderLabels[provider]
                const isProviderLoading = authenticatingProvider === provider

                return (
                  <SocialLoginButton
                    key={provider}
                    type="button"
                    size="lg"
                    variant="outline"
                    disabled={isLoginActionPending}
                    aria-busy={isProviderLoading}
                    aria-label={`Continuar com ${providerLabel}`}
                    onClick={() => handleSocialLogin(provider)}
                  >
                    {renderSocialButtonIcon(provider)}
                    {isProviderLoading
                      ? `Conectando com ${providerLabel}...`
                      : `Continuar com ${providerLabel}`}
                  </SocialLoginButton>
                )
              })}
            </SocialLoginGroup>

            <SocialLoginSeparator aria-label="ou">
              <span>ou</span>
            </SocialLoginSeparator>

            <LoginForm onSubmit={handleSubmit} noValidate>
              <FormStack>
                <Input
                  label="E-mail"
                  name="email"
                  placeholder="voce@empresa.com"
                  type="email"
                  value={formValues.email}
                  onChange={handleFieldChange('email')}
                  disabled={isLoginActionPending}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />

                <Input
                  label="Senha"
                  name="password"
                  placeholder="********"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={formValues.password}
                  onChange={handleFieldChange('password')}
                  disabled={isLoginActionPending}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  endIcon={isPasswordVisible ? 'eye-off' : 'eye'}
                  endIconAriaLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  onEndIconClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
                />

                <LoginPrimaryButton
                  type="submit"
                  size="lg"
                  disabled={isLoginActionPending}
                  aria-busy={isAuthenticating}
                >
                  {isAuthenticating ? (
                    <SubmitLoadingIcon>
                      <LoaderCircle size={16} />
                    </SubmitLoadingIcon>
                  ) : (
                    <LogIn size={16} />
                  )}
                  {isAuthenticating ? 'Entrando...' : 'Entrar'}
                </LoginPrimaryButton>
              </FormStack>
            </LoginForm>

            <LoginSignupFooter>
              <LoginSignupFooterText>Não tem uma conta?</LoginSignupFooterText>
              <LoginSignupFooterLink href="/cadastro">
                <UserPlus size={16} />
                Fazer cadastro
              </LoginSignupFooterLink>
            </LoginSignupFooter>
          </FormCard>
        </FormContent>
      </FormSection>
    </PageRoot>
  )
}
