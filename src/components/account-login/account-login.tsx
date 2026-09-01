'use client'

import { ArrowLeft, ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'

import { Input } from '@components/ui/input/input'
import { LogoLink } from '@components/account-signup/logo-link'

import { LoginAside } from './login-aside'
import {
  BackLink,
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
  LoginSignupFooter,
  LoginSignupFooterLink,
  LoginSignupFooterText,
  MobileHeader,
  PageRoot,
} from './style'

type LoginFormValues = {
  email: string
  password: string
}

const initialLoginFormValues: LoginFormValues = {
  email: '',
  password: '',
}

export function AccountLogin() {
  const [formValues, setFormValues] = useState(initialLoginFormValues)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function handleFieldChange(field: keyof LoginFormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
              Landing
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

            <LoginForm onSubmit={handleSubmit} noValidate>
              <FormStack>
                <Input
                  label="E-mail"
                  name="email"
                  placeholder="voce@empresa.com"
                  type="email"
                  value={formValues.email}
                  onChange={handleFieldChange('email')}
                />

                <Input
                  label="Senha"
                  name="password"
                  placeholder="********"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={formValues.password}
                  onChange={handleFieldChange('password')}
                  endIcon={isPasswordVisible ? 'eye-off' : 'eye'}
                  endIconAriaLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  onEndIconClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
                />

                <LoginPrimaryButton type="submit" size="lg">
                  <LogIn size={16} />
                  Entrar
                  <ArrowRight size={16} />
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
