import { ArrowRight, KeyRound, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'

import { LogoLink } from '@components/account-signup/logo-link'

import {
  AsideCopy,
  AsideDescription,
  AsideEyebrow,
  AsideTitle,
  AsideSignupLink,
  LoginAside as StyledLoginAside,
  LoginResourceIcon,
  LoginResourceItem,
  LoginResourceList,
  LoginResourceText,
  LoginResourceTitle,
  SignupPanel,
  SignupPanelDescription,
  SignupPanelTitle,
} from './style'

const loginResources = [
  {
    icon: ShieldCheck,
    title: 'Segurança centralizada',
    text: 'Retome a gestão de acessos com os controles do seu workspace.',
  },
  {
    icon: KeyRound,
    title: 'Credenciais protegidas',
    text: 'Continue de onde parou com uma experiência de entrada clara e confiável.',
  },
]

export function LoginAside() {
  return (
    <StyledLoginAside>
      <LogoLink />

      <AsideCopy>
        <AsideEyebrow>
          <Sparkles size={14} />
          Login da conta
        </AsideEyebrow>
        <AsideTitle>Bem vindo de volta.</AsideTitle>
        <AsideDescription>
          Faça login para continuar sua jornada e aproveitar os recursos da plataforma Your Auth.
        </AsideDescription>

        <LoginResourceList>
          {loginResources.map(({ icon: Icon, title, text }) => (
            <LoginResourceItem key={title}>
              <LoginResourceIcon>
                <Icon size={16} />
              </LoginResourceIcon>
              <div>
                <LoginResourceTitle>{title}</LoginResourceTitle>
                <LoginResourceText>{text}</LoginResourceText>
              </div>
            </LoginResourceItem>
          ))}
        </LoginResourceList>
      </AsideCopy>

      <SignupPanel>
        <div>
          <SignupPanelTitle>Ainda não tem conta?</SignupPanelTitle>
          <SignupPanelDescription>
            Crie seu acesso inicial e configure a base da sua conta proprietária.
          </SignupPanelDescription>
        </div>
        <AsideSignupLink href="/cadastro">
          <UserPlus size={16} />
          Fazer cadastro
          <ArrowRight size={16} />
        </AsideSignupLink>
      </SignupPanel>
    </StyledLoginAside>
  )
}
