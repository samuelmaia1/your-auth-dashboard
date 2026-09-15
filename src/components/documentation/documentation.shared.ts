export type DocumentationSlug =
  | 'start'
  | 'criando-projeto'
  | 'gerenciamento-do-projeto'
  | 'criacao-de-usuarios'
  | 'login'
  | 'gerenciamento-de-sessoes'

export type DocumentationStep = {
  slug: DocumentationSlug
  title: string
  shortTitle: string
  href: `/docs/${DocumentationSlug}`
  description: string
}

export const documentationSteps = [
  {
    slug: 'start',
    title: 'Start',
    shortTitle: 'Start',
    href: '/docs/start',
    description: 'Crie sua conta Your Auth e entre no ambiente autenticado.',
  },
  {
    slug: 'criando-projeto',
    title: 'Criando projeto',
    shortTitle: 'Criando projeto',
    href: '/docs/criando-projeto',
    description: 'Configure dados do projeto, políticas e a API key inicial.',
  },
  {
    slug: 'gerenciamento-do-projeto',
    title: 'Gerenciamento do projeto',
    shortTitle: 'Gerenciamento',
    href: '/docs/gerenciamento-do-projeto',
    description: 'Entenda as abas de detalhes e os dados operacionais exibidos.',
  },
  {
    slug: 'criacao-de-usuarios',
    title: 'Criação de usuários',
    shortTitle: 'Usuários',
    href: '/docs/criacao-de-usuarios',
    description: 'Cadastre usuários finais no projeto pela API pública.',
  },
  {
    slug: 'login',
    title: 'Login',
    shortTitle: 'Login',
    href: '/docs/login',
    description: 'Autentique usuários finais e trate respostas de sucesso e erro.',
  },
  {
    slug: 'gerenciamento-de-sessoes',
    title: 'Gerenciamento de sessões',
    shortTitle: 'Sessões',
    href: '/docs/gerenciamento-de-sessoes',
    description: 'Renove ou encerre sessões de usuários finais conforme o contrato.',
  },
] as const satisfies readonly DocumentationStep[]

export const defaultDocumentationSlug = 'start' satisfies DocumentationSlug

export function isDocumentationSlug(value: string): value is DocumentationSlug {
  return documentationSteps.some((step) => step.slug === value)
}

export function getDocumentationStep(slug: DocumentationSlug) {
  return documentationSteps.find((step) => step.slug === slug) ?? documentationSteps[0]
}

export function isDocumentationPath(pathname: string) {
  return pathname === '/docs' || pathname.startsWith('/docs/')
}

export function isDocumentationStepActive(pathname: string, step: DocumentationStep) {
  if (step.slug === defaultDocumentationSlug && pathname === '/docs') {
    return true
  }

  return pathname === step.href
}
