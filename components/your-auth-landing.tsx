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
    <a href="#inicio" className="flex items-center gap-2.5" aria-label="Your Auth, início">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <LockKeyhole className="size-4" strokeWidth={2.5} />
      </span>
      <span className="font-mono text-[15px] font-semibold tracking-[-0.04em]">Your Auth</span>
    </a>
  )
}

export function YourAuthLanding() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main id="inicio" className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8"
        aria-label="Navegação principal"
      >
        <Logo />

        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#recursos">
            Recursos
          </a>
          <a className="transition-colors hover:text-foreground" href="#seguranca">
            Segurança
          </a>
          <a className="transition-colors hover:text-foreground" href="#docs">
            Documentação
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contato"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Fale com a gente
          </a>
          <a
            href="#comecar"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Começar agora
          </a>
        </div>

        <button
          className="rounded-md p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mx-6 flex flex-col gap-4 border-t border-border py-5 text-sm md:hidden">
          <a href="#recursos" onClick={() => setMenuOpen(false)}>
            Recursos
          </a>
          <a href="#seguranca" onClick={() => setMenuOpen(false)}>
            Segurança
          </a>
          <a href="#docs" onClick={() => setMenuOpen(false)}>
            Documentação
          </a>
          <a
            href="#comecar"
            className="font-medium text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Começar agora <ArrowRight className="ml-1 inline size-4" />
          </a>
        </div>
      )}

      <section className="relative mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-accent" />
            Autenticação para produtos que crescem
          </div>

          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl">
            A identidade do seu produto, <span className="text-primary">bem cuidada.</span>
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
            O caminho mais simples entre seu produto e uma experiência de autenticação segura,
            flexível e feita para escalar.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              id="comecar"
              href="#docs"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Começar gratuitamente{' '}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#recursos"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Conhecer recursos <ChevronRight className="size-4" />
            </a>
          </div>

          <div className="mt-9 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="size-3.5 text-accent" />
              Sem cartão de crédito
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-3.5 text-accent" />
              Plano gratuito
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute -inset-10 bg-[radial-gradient(circle_at_center,var(--glow),transparent_65%)]"
            aria-hidden="true"
          />

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="ml-3 font-mono text-[10px] text-muted-foreground">
                your-auth / quickstart
              </span>
            </div>

            <div className="p-6 font-mono text-xs leading-7">
              <div className="text-muted-foreground">{'// conecte a identidade em minutos'}</div>
              <div className="mt-4">
                <span className="text-accent">await</span> axios.post(
              </div>
              <div className="pl-5">
                <span className="text-primary">&apos;/users/login&apos;</span>,
              </div>
              <div className="pl-5">userCredentials,</div>
              <div className="pl-5">{'{'}</div>
              <div className="pl-10">headers: {'{'}</div>
              <div className="pl-14">
                Authorization:{' '}
                <span className="text-primary">&apos;Bearer fake_api_key_123&apos;</span>,
              </div>
              <div className="pl-10">{'}'},</div>
              <div className="pl-5">{'}'},</div>
              <div>)</div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-px bg-border md:grid-cols-3">
          <div className="bg-card p-8 lg:p-10 md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Por que Your Auth
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Menos complexidade. Mais confiança.
            </h2>
          </div>
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-card p-8 lg:p-10">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="seguranca"
        className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-32"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Feito para o futuro
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Tudo que você precisa para cuidar de cada identidade.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-muted-foreground">
            Uma fundação confiável para construir produtos melhores, com segurança que acompanha o
            ritmo do seu time.
          </p>
        </div>
        <div id="docs" className="divide-y divide-border border-y border-border">
          {capabilities.map(([number, title, text]) => (
            <div key={number} className="grid gap-4 py-6 sm:grid-cols-[3rem_1fr] sm:gap-6">
              <span className="font-mono text-xs text-accent">{number}</span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contato"
        className="mx-6 mb-16 overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 lg:mx-auto lg:max-w-6xl lg:py-16"
      >
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
              A próxima camada do seu produto
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-[-0.04em] text-balance">
              Sua equipe já pode começar a construir.
            </h2>
          </div>
          <a
            href="#inicio"
            className="shrink-0 rounded-lg bg-card px-5 py-3 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            Explorar a plataforma <ArrowRight className="ml-2 inline size-4" />
          </a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-border px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Logo />
        <span>© 2025 Your Auth. Identidade, sem complicação.</span>
        <span className="font-mono">
          status: <span className="text-accent">operacional</span>
        </span>
      </footer>
    </main>
  )
}
