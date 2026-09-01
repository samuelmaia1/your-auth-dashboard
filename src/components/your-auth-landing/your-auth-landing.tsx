'use client'

import {
  ArrowRight,
  Check,
  ChevronRight,
  Fingerprint,
  LockKeyhole,
  Menu,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

import {
  AccentCode,
  BenefitArticle,
  BenefitsGrid,
  BenefitsHeading,
  BenefitsSection,
  BenefitText,
  BenefitTitle,
  CallToAction,
  CallToActionEyebrow,
  CallToActionInner,
  CallToActionLink,
  CallToActionTitle,
  CapabilityItem,
  CapabilityList,
  CapabilityNumber,
  CapabilityText,
  CapabilityTitle,
  CodeCard,
  CodeContent,
  CodeHeader,
  CodeLine,
  CodeMuted,
  CodeTitle,
  ContactLink,
  DesktopActions,
  DesktopNavigation,
  Eyebrow,
  Footer,
  FooterStatus,
  FooterStatusValue,
  HeroActions,
  HeroCopy,
  HeroDescription,
  HeroFootnote,
  HeroFootnotes,
  HeroGlow,
  HeroPrimaryLink,
  HeroSecondaryLink,
  HeroSection,
  HeroTitle,
  HeroTitleAccent,
  HeroVisual,
  LogoAnchor,
  LogoMark,
  LogoText,
  Main,
  MobileMenu,
  MobileMenuButton,
  MobileSignupLink,
  Navigation,
  NavigationLink,
  PrimaryCode,
  PrimaryLink,
  SecuritySection,
  SecurityText,
  SecurityTitle,
  SectionEyebrow,
  SectionTitle,
  StatusDot,
  WindowDot,
} from './style'

const benefits = [
  {
    icon: Zap,
    title: 'Integração sem atrito',
    text: 'Autenticação pronta para entrar em produção com poucas linhas de código.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança por padrão',
    text: 'Proteções modernas para que seu time possa focar no produto, não na infraestrutura.',
  },
  {
    icon: Fingerprint,
    title: 'Identidade unificada',
    text: 'Uma experiência consistente para cada usuário, em todos os seus produtos.',
  },
]

const capabilities = [
  [
    '01',
    'Login social',
    'Google, GitHub e mais — conecte os provedores que seus usuários já conhecem.',
  ],
  [
    '02',
    'Gestão de sessões',
    'Sessões seguras, revogação instantânea e controle total para seu time.',
  ],
  [
    '03',
    'Múltiplos ambientes',
    'Desenvolvimento, staging e produção sem configurações duplicadas.',
  ],
]

function Logo() {
  return (
    <LogoAnchor href="#inicio" aria-label="Your Auth, início">
      <LogoMark>
        <LockKeyhole size={16} strokeWidth={2.5} />
      </LogoMark>
      <LogoText>Your Auth</LogoText>
    </LogoAnchor>
  )
}

export function YourAuthLanding() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Main id="inicio">
      <Navigation aria-label="Navegação principal">
        <Logo />

        <DesktopNavigation>
          <NavigationLink href="#recursos">Recursos</NavigationLink>
          <NavigationLink href="#seguranca">Segurança</NavigationLink>
          <NavigationLink href="#docs">Documentação</NavigationLink>
        </DesktopNavigation>

        <DesktopActions>
          <ContactLink href="#contato">Fale com a gente</ContactLink>
          <PrimaryLink href="/cadastro">Começar agora</PrimaryLink>
        </DesktopActions>

        <MobileMenuButton
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </MobileMenuButton>
      </Navigation>

      {menuOpen && (
        <MobileMenu>
          <a href="#recursos" onClick={() => setMenuOpen(false)}>
            Recursos
          </a>
          <a href="#seguranca" onClick={() => setMenuOpen(false)}>
            Segurança
          </a>
          <a href="#docs" onClick={() => setMenuOpen(false)}>
            Documentação
          </a>
          <MobileSignupLink href="/cadastro" onClick={() => setMenuOpen(false)}>
            Começar agora <ArrowRight size={16} />
          </MobileSignupLink>
        </MobileMenu>
      )}

      <HeroSection>
        <HeroCopy>
          <Eyebrow>
            <StatusDot />
            Autenticação para produtos que crescem
          </Eyebrow>

          <HeroTitle>
            A identidade do seu produto, <HeroTitleAccent>bem cuidada.</HeroTitleAccent>
          </HeroTitle>

          <HeroDescription>
            O caminho mais simples entre seu produto e uma experiência de autenticação segura,
            flexível e feita para escalar.
          </HeroDescription>

          <HeroActions>
            <HeroPrimaryLink href="/cadastro">
              Começar gratuitamente <ArrowRight size={16} />
            </HeroPrimaryLink>
            <HeroSecondaryLink href="#recursos">
              Conhecer recursos <ChevronRight size={16} />
            </HeroSecondaryLink>
          </HeroActions>

          <HeroFootnotes>
            <HeroFootnote>
              <Check size={14} />
              Sem cartão de crédito
            </HeroFootnote>
            <HeroFootnote>
              <Check size={14} />
              Plano gratuito
            </HeroFootnote>
          </HeroFootnotes>
        </HeroCopy>

        <HeroVisual>
          <HeroGlow aria-hidden="true" />

          <CodeCard>
            <CodeHeader>
              <WindowDot />
              <WindowDot />
              <WindowDot />
              <CodeTitle>your-auth / quickstart</CodeTitle>
            </CodeHeader>

            <CodeContent>
              <CodeMuted>{'// conecte a identidade em minutos'}</CodeMuted>
              <CodeLine spaced>
                <AccentCode>await</AccentCode> axios.post(
              </CodeLine>
              <CodeLine indent={20}>
                <PrimaryCode>&apos;/users/login&apos;</PrimaryCode>,
              </CodeLine>
              <CodeLine indent={20}>userCredentials,</CodeLine>
              <CodeLine indent={20}>{'{'}</CodeLine>
              <CodeLine indent={40}>headers: {'{'}</CodeLine>
              <CodeLine indent={56}>
                Authorization: <PrimaryCode>&apos;Bearer fake_api_key_123&apos;</PrimaryCode>,
              </CodeLine>
              <CodeLine indent={40}>{'}'},</CodeLine>
              <CodeLine indent={20}>{'}'},</CodeLine>
              <CodeLine>)</CodeLine>
            </CodeContent>
          </CodeCard>
        </HeroVisual>
      </HeroSection>

      <BenefitsSection id="recursos">
        <BenefitsGrid>
          <BenefitsHeading>
            <SectionEyebrow>Por que Your Auth</SectionEyebrow>
            <SectionTitle>Menos complexidade. Mais confiança.</SectionTitle>
          </BenefitsHeading>
          {benefits.map(({ icon: Icon, title, text }) => (
            <BenefitArticle key={title}>
              <Icon size={20} />
              <BenefitTitle>{title}</BenefitTitle>
              <BenefitText>{text}</BenefitText>
            </BenefitArticle>
          ))}
        </BenefitsGrid>
      </BenefitsSection>

      <SecuritySection id="seguranca">
        <div>
          <SectionEyebrow>Feito para o futuro</SectionEyebrow>
          <SecurityTitle>Tudo que você precisa para cuidar de cada identidade.</SecurityTitle>
          <SecurityText>
            Uma fundação confiável para construir produtos melhores, com segurança que acompanha o
            ritmo do seu time.
          </SecurityText>
        </div>
        <CapabilityList id="docs">
          {capabilities.map(([number, title, text]) => (
            <CapabilityItem key={number}>
              <CapabilityNumber>{number}</CapabilityNumber>
              <div>
                <CapabilityTitle>{title}</CapabilityTitle>
                <CapabilityText>{text}</CapabilityText>
              </div>
            </CapabilityItem>
          ))}
        </CapabilityList>
      </SecuritySection>

      <CallToAction id="contato">
        <CallToActionInner>
          <div>
            <CallToActionEyebrow>A próxima camada do seu produto</CallToActionEyebrow>
            <CallToActionTitle>Sua equipe já pode começar a construir.</CallToActionTitle>
          </div>
          <CallToActionLink href="#inicio">
            Explorar a plataforma <ArrowRight size={16} />
          </CallToActionLink>
        </CallToActionInner>
      </CallToAction>

      <Footer>
        <Logo />
        <span>© 2025 Your Auth. Identidade, sem complicação.</span>
        <FooterStatus>
          status: <FooterStatusValue>operacional</FooterStatusValue>
        </FooterStatus>
      </Footer>
    </Main>
  )
}
