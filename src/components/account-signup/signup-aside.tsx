import { CheckCircle2, IdCard, KeyRound, Mail, MapPin, Sparkles } from 'lucide-react'

import { LogoLink } from './logo-link'
import {
  AsideCopy,
  AsideDescription,
  AsideEyebrow,
  AsideTitle,
  SetupIcon,
  SetupItem,
  SetupItemStatus,
  SetupItemTitle,
  SetupList,
  SetupPanel,
  SetupPanelHeader,
  SetupPanelTitle,
  SignupAside as StyledSignupAside,
  WelcomeBadge,
  type StepStatus,
} from './style'

type SignupAsideProps = {
  currentStep: number
  isSignupComplete: boolean
}

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

export function SignupAside({ currentStep, isSignupComplete }: SignupAsideProps) {
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
