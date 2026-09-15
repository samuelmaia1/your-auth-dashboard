'use client'

import type { ReactNode } from 'react'

import {
  defaultDocumentationSlug,
  documentationSteps,
  getDocumentationStep,
  type DocumentationSlug,
} from './documentation.shared'
import {
  Callout,
  CalloutText,
  CalloutTitle,
  CodeHeader,
  CodePanel,
  DocSection,
  DocumentationContent,
  DocumentationDescription,
  DocumentationEyebrow,
  DocumentationHeader,
  DocumentationMeta,
  DocumentationRoot,
  DocumentationTitle,
  EndpointPath,
  EndpointSummary,
  FieldDescription,
  FieldGrid,
  FieldItem,
  FieldName,
  InlineLink,
  MetaPill,
  MethodBadge,
  OrderedList,
  Paragraph,
  Pre,
  SectionHeading,
  SectionSubtitle,
  SectionTitle,
  StatusCode,
  StatusDescription,
  StatusRow,
  StatusTable,
  StepNavigation,
  StepNavKicker,
  StepNavLink,
  StepNavTitle,
  UnorderedList,
} from './style'

type DocumentationPageProps = {
  slug?: DocumentationSlug
}

type SectionProps = {
  children: ReactNode
  subtitle?: string
  title: string
}

type FieldItemContent = {
  name: string
  description: string
}

type StatusItem = {
  code: string
  description: string
}

const projectDataFields: FieldItemContent[] = [
  {
    name: 'name',
    description: 'Nome visível do projeto. Use algo reconhecível para o produto ou ambiente.',
  },
  {
    name: 'description',
    description: 'Descrição curta e opcional para identificar o uso do projeto.',
  },
  {
    name: 'environment',
    description:
      'Ambiente do projeto: DEVELOPMENT para desenvolvimento ou PRODUCTION para produção.',
  },
  {
    name: 'tokenAudience',
    description: 'Identificador de audiência usado nos tokens emitidos para esse projeto.',
  },
]

const passwordPolicyFields: FieldItemContent[] = [
  {
    name: 'minSize',
    description: 'Quantidade mínima de caracteres permitida para a senha do usuário final.',
  },
  {
    name: 'maxSize',
    description: 'Quantidade máxima de caracteres permitida para a senha do usuário final.',
  },
  {
    name: 'numberRequired',
    description: 'Quando ativo, exige ao menos um dígito na senha.',
  },
  {
    name: 'uppercaseRequired',
    description: 'Quando ativo, exige ao menos uma letra maiúscula.',
  },
  {
    name: 'lowercaseRequired',
    description: 'Quando ativo, exige ao menos uma letra minúscula.',
  },
  {
    name: 'specialCharRequired',
    description: 'Quando ativo, exige símbolo ou pontuação.',
  },
]

const authPolicyFields: FieldItemContent[] = [
  {
    name: 'Duração do access token',
    description: 'Tempo de vida do access token, em minutos.',
  },
  {
    name: 'Duração do refresh token',
    description: 'Tempo de vida do refresh token, em dias.',
  },
  {
    name: 'Modo de sessão',
    description:
      'Define se o usuário final pode ter múltiplas sessões, apenas uma sessão ativa ou um limite configurado de sessões.',
  },
  {
    name: 'Máximo de sessões ativas',
    description:
      'Número máximo de sessões ativas quando o modo escolhido for LIMITED_ACTIVE_SESSIONS.',
  },
  {
    name: 'Rotação de refresh token',
    description: 'Quando ativo, a renovação de sessão troca o refresh token usado por um novo.',
  },
  {
    name: 'Revogar ao trocar senha',
    description: 'Quando ativo, tokens existentes são invalidados após troca de senha.',
  },
  {
    name: 'Limite de tentativas de login',
    description: 'Quantidade máxima de falhas de login antes de aplicar bloqueio.',
  },
  {
    name: 'Tempo de bloqueio',
    description: 'Tempo de bloqueio aplicado após exceder o limite de falhas de login.',
  },
  {
    name: 'Verificação de e-mail obrigatória',
    description: 'Quando ativo, exige e-mail verificado para permitir acesso.',
  },
  {
    name: 'Cadastro de usuário habilitado',
    description: 'Quando ativo, permite novos cadastros de usuários finais no projeto.',
  },
]

const apiKeyFields: FieldItemContent[] = [
  {
    name: 'name',
    description: 'Nome interno para reconhecer a chave depois, como Chave inicial ou Produção.',
  },
  {
    name: 'scopes',
    description:
      'Permissões da chave: USERS_READ, USERS_WRITE, AUTH_LOGIN e AUTH_REGISTER conforme necessidade da integração.',
  },
  {
    name: 'expiresInHours',
    description:
      'Validade em horas. Quando não enviado, a expiração fica a cargo do comportamento aceito pela API.',
  },
]

const createUserStatuses: StatusItem[] = [
  { code: '201', description: 'Usuário criado e retornado no corpo da resposta.' },
  {
    code: '400',
    description: 'Corpo inválido, erro de validação ou API key mal formatada.',
  },
  { code: '401', description: 'API key ausente, inválida, expirada ou revogada.' },
  { code: '403', description: 'API key sem permissão para criar usuários.' },
  { code: '409', description: 'Usuário já existente no projeto.' },
  { code: '500', description: 'Falha ao processar a API key do projeto.' },
]

const loginStatuses: StatusItem[] = [
  {
    code: '200',
    description:
      'Usuário autenticado. A resposta inclui dados do usuário, token, sucesso e data do login; o header Set-Cookie define access-token e refresh_token HTTP-only.',
  },
  {
    code: '400',
    description: 'Corpo inválido, erro de validação ou API key mal formatada.',
  },
  {
    code: '401',
    description: 'Credenciais inválidas, login bloqueado ou API key inválida.',
  },
  { code: '403', description: 'API key sem permissão para autenticar usuários.' },
  { code: '409', description: 'Limite de sessões ativas atingido.' },
  { code: '500', description: 'Falha ao gerar tokens ou processar a API key do projeto.' },
]

const refreshStatuses: StatusItem[] = [
  {
    code: '200',
    description:
      'Sessão renovada. Novos cookies access-token e refresh_token são enviados no header Set-Cookie.',
  },
  { code: '400', description: 'Cookie refresh_token ausente.' },
  {
    code: '401',
    description: 'API key ausente ou inválida, ou refresh token inválido, expirado ou reutilizado.',
  },
  { code: '403', description: 'API key sem permissão para gerenciar a sessão deste projeto.' },
  { code: '404', description: 'Usuário ou sessão associados ao refresh token não encontrados.' },
  { code: '500', description: 'Falha ao validar, armazenar ou gerar tokens.' },
]

const logoutStatuses: StatusItem[] = [
  {
    code: '204',
    description: 'Sessão encerrada e cookies limpos pelo header Set-Cookie.',
  },
  { code: '400', description: 'Cookie refresh_token ausente.' },
  {
    code: '401',
    description: 'API key ausente ou inválida, ou refresh token inválido, expirado ou reutilizado.',
  },
  { code: '403', description: 'API key sem permissão para gerenciar a sessão deste projeto.' },
]

const createUserRequestJson = `{
  "email": "usuario@cliente.com",
  "password": "SenhaForte123!",
  "phone": {
    "ddd": "11",
    "number": "912345678"
  }
}`

const createUserResponseJson = `{
  "id": "usr_123",
  "projectId": "proj_123",
  "email": "usuario@cliente.com",
  "status": "ACTIVE",
  "createdAt": "2026-09-15T14:30:00Z",
  "updatedAt": "2026-09-15T14:30:00Z",
  "lastLoginAt": null,
  "lastPasswordChangedAt": null,
  "lastFailedLoginAt": null,
  "failedLoginAttempts": 0,
  "lockedUntil": null,
  "lastLoginIpAddress": null,
  "lastLoginUserAgent": null,
  "phone": {
    "ddd": "11",
    "number": "912345678"
  }
}`

const createUserAxiosCode = `import axios from 'axios'

const baseURL = '<URL_BASE_DA_API_YOUR_AUTH>'

const response = await axios.post(
  \`\${baseURL}/users\`,
  {
    email: 'usuario@cliente.com',
    password: 'SenhaForte123!',
    phone: {
      ddd: '11',
      number: '912345678',
    },
  },
  {
    headers: {
      'X-API-Key': '<SUA_API_KEY_DO_PROJETO>',
    },
  },
)

console.log(response.data)`

const loginRequestJson = `{
  "email": "usuario@cliente.com",
  "password": "SenhaForte123!"
}`

const loginResponseJson = `{
  "user": {
    "id": "usr_123",
    "projectId": "proj_123",
    "email": "usuario@cliente.com",
    "status": "ACTIVE",
    "lastLoginAt": "2026-09-15T14:30:00Z",
    "failedLoginAttempts": 0
  },
  "token": {
    "raw": "eyJhbGciOi...",
    "duration": "15m"
  },
  "success": true,
  "loggedAt": "2026-09-15T14:30:00Z"
}`

const loginAxiosCode = `import axios from 'axios'

const baseURL = '<URL_BASE_DA_API_YOUR_AUTH>'

const response = await axios.post(
  \`\${baseURL}/users/login\`,
  {
    email: 'usuario@cliente.com',
    password: 'SenhaForte123!',
  },
  {
    headers: {
      'X-API-Key': '<SUA_API_KEY_DO_PROJETO>',
      'X-Device-Name': 'Chrome macOS',
    },
    withCredentials: true,
  },
)

console.log(response.data.user)
console.log(response.data.token)`

const loginErrorJson = `{
  "message": "Descrição do erro retornada pela API.",
  "status": 401,
  "error": "Identificador do erro.",
  "time": "2026-09-15T14:30:00Z",
  "fields": {
    "email": "Mensagem de validação do campo."
  }
}`

const refreshAxiosCode = `import axios from 'axios'

const baseURL = '<URL_BASE_DA_API_YOUR_AUTH>'

await axios.post(
  \`\${baseURL}/users/refresh\`,
  null,
  {
    headers: {
      'X-API-Key': '<SUA_API_KEY_DO_PROJETO>',
    },
    withCredentials: true,
  },
)`

const logoutAxiosCode = `import axios from 'axios'

const baseURL = '<URL_BASE_DA_API_YOUR_AUTH>'

await axios.post(
  \`\${baseURL}/users/logout\`,
  null,
  {
    headers: {
      'X-API-Key': '<SUA_API_KEY_DO_PROJETO>',
    },
    withCredentials: true,
  },
)`

function Section({ children, subtitle, title }: SectionProps) {
  return (
    <DocSection>
      <SectionHeading>
        <SectionTitle>{title}</SectionTitle>
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      </SectionHeading>
      {children}
    </DocSection>
  )
}

function FieldList({ fields }: { fields: FieldItemContent[] }) {
  return (
    <FieldGrid>
      {fields.map((field) => (
        <FieldItem key={field.name}>
          <FieldName>{field.name}</FieldName>
          <FieldDescription>{field.description}</FieldDescription>
        </FieldItem>
      ))}
    </FieldGrid>
  )
}

function CodeBlock({ children, label }: { children: string; label: string }) {
  return (
    <CodePanel>
      <CodeHeader>{label}</CodeHeader>
      <Pre>
        <code>{children}</code>
      </Pre>
    </CodePanel>
  )
}

function StatusList({ statuses }: { statuses: StatusItem[] }) {
  return (
    <StatusTable>
      {statuses.map((status) => {
        const tone = status.code.startsWith('2') ? 'success' : 'error'

        return (
          <StatusRow key={status.code}>
            <StatusCode $tone={tone}>{status.code}</StatusCode>
            <StatusDescription>{status.description}</StatusDescription>
          </StatusRow>
        )
      })}
    </StatusTable>
  )
}

function Endpoint({ method, path }: { method: string; path: string }) {
  return (
    <EndpointSummary>
      <MethodBadge>{method}</MethodBadge>
      <EndpointPath>{path}</EndpointPath>
    </EndpointSummary>
  )
}

function StartContent() {
  return (
    <>
      <Section
        title="Criar sua conta"
        subtitle="A conta é o acesso administrativo usado para criar projetos, gerar API keys e acompanhar usuários finais."
      >
        <OrderedList>
          <li>
            Acesse <InlineLink href="/cadastro">/cadastro</InlineLink>.
          </li>
          <li>Preencha os dados do titular: nome, sobrenome e CPF.</li>
          <li>Informe os dados de contato: e-mail, DDD e telefone.</li>
          <li>Complete o endereço vinculado à conta.</li>
          <li>Defina a senha de acesso e revise os dados antes de confirmar o cadastro.</li>
          <li>Após a confirmação, siga para a tela de login.</li>
        </OrderedList>
      </Section>

      <Section
        title="Fazer login"
        subtitle="Depois de entrar, a conta consegue acessar home, projetos, assinatura, planos e documentação."
      >
        <OrderedList>
          <li>
            Acesse <InlineLink href="/login">/login</InlineLink>.
          </li>
          <li>Informe e-mail e senha da conta.</li>
          <li>Use os botões sociais quando preferir entrar com Google ou GitHub.</li>
          <li>Com a sessão validada, você será direcionado para /home.</li>
        </OrderedList>
        <Callout>
          <CalloutTitle>Sessão da conta</CalloutTitle>
          <CalloutText>
            A sessão autenticada é usada apenas para administrar recursos da sua conta e dos
            projetos aos quais ela tem acesso.
          </CalloutText>
        </Callout>
      </Section>
    </>
  )
}

function CreateProjectContent() {
  return (
    <>
      <Section
        title="Abrir o fluxo"
        subtitle="A criação de projeto acontece dentro da área logada."
      >
        <OrderedList>
          <li>Entre na sua conta.</li>
          <li>Acesse Projetos na sidebar.</li>
          <li>Escolha a ação para criar um novo projeto.</li>
          <li>Preencha as quatro etapas do formulário: dados, senha, autenticação e API key.</li>
        </OrderedList>
      </Section>

      <Section
        title="Dados do projeto"
        subtitle="Esses campos identificam o projeto e definem o contexto usado nos tokens emitidos."
      >
        <FieldList fields={projectDataFields} />
        <Paragraph>
          Token audience é a audiência do token. Use um identificador estável do produto ou serviço
          que vai consumir os tokens, por exemplo o slug do portal ou da API. Esse valor ajuda a
          diferenciar tokens emitidos para projetos diferentes e deve ser escolhido antes de colocar
          integrações em produção.
        </Paragraph>
      </Section>

      <Section
        title="Política de senha"
        subtitle="A política de senha define as regras aplicadas quando usuários finais são cadastrados ou têm senha alterada."
      >
        <FieldList fields={passwordPolicyFields} />
        <Paragraph>
          A política de senha protege o cadastro de usuários finais contra senhas fracas. Ela não
          autentica a conta administrativa: ela controla as credenciais dos usuários finais do
          projeto.
        </Paragraph>
      </Section>

      <Section
        title="Política de autenticação"
        subtitle="Essa política controla expiração de tokens, sessões, bloqueios e regras de cadastro dos usuários finais."
      >
        <FieldList fields={authPolicyFields} />
        <Paragraph>
          O modo de sessão afeta diretamente o login. MULTIPLE_DEVICES permite mais de uma sessão,
          SINGLE_ACTIVE_SESSION mantém apenas uma sessão ativa por usuário, e
          LIMITED_ACTIVE_SESSIONS aplica o limite informado em maxActiveSessions.
        </Paragraph>
      </Section>

      <Section
        title="API Key"
        subtitle="A API key conecta sua aplicação ao projeto e autoriza chamadas públicas da API."
      >
        <FieldList fields={apiKeyFields} />
        <Paragraph>
          Use os escopos para liberar somente o necessário. Para cadastrar usuários finais, a chave
          precisa permitir cadastro; para autenticar, precisa permitir login.
        </Paragraph>
        <Callout $tone="warning">
          <CalloutTitle>Guarde a chave no momento da criação</CalloutTitle>
          <CalloutText>
            A API key bruta só pode ser vista e copiada uma vez. Se você perder esse valor, será
            necessário criar outra chave para o projeto.
          </CalloutText>
        </Callout>
      </Section>
    </>
  )
}

function ProjectManagementContent() {
  return (
    <>
      <Section
        title="Resumo do projeto"
        subtitle="A tela de detalhes começa com os dados básicos retornados para o projeto."
      >
        <UnorderedList>
          <li>Nome, descrição, ambiente e status ajudam a confirmar o projeto aberto.</li>
          <li>A audiência do token mostra o identificador usado na emissão dos tokens.</li>
          <li>Datas de criação e atualização ajudam a acompanhar mudanças recentes.</li>
        </UnorderedList>
      </Section>

      <Section
        title="Aba Sessões"
        subtitle="Mostra sessões de usuários finais vinculadas ao projeto."
      >
        <UnorderedList>
          <li>Use status, período de último uso e e-mail do usuário para filtrar a lista.</li>
          <li>
            Cada sessão exibe usuário, dispositivo, IP, user agent, criação, último uso e revogação.
          </li>
          <li>
            Quando uma sessão ativa tem identificadores válidos, a tela permite revogar uma sessão
            ou todas as sessões do usuário.
          </li>
        </UnorderedList>
      </Section>

      <Section title="Aba Usuários" subtitle="Lista usuários finais cadastrados no projeto.">
        <UnorderedList>
          <li>Filtre por e-mail para encontrar um usuário específico.</li>
          <li>
            Observe status, tentativas falhas, último login, bloqueio, criação e IP do último login.
          </li>
          <li>
            Usuários bloqueados ou desativados aparecem com status próprio para análise operacional.
          </li>
        </UnorderedList>
      </Section>

      <Section title="Aba Membros" subtitle="Mostra contas que participam do projeto.">
        <UnorderedList>
          <li>Cada registro mostra papel, accountId, nome, sobrenome e data de entrada.</li>
          <li>
            A ação de convite permite adicionar novas contas ao projeto pelo fluxo disponível na
            tela.
          </li>
        </UnorderedList>
      </Section>

      <Section
        title="Aba Política de Senha"
        subtitle="Exibe a política atual aplicada às senhas dos usuários finais."
      >
        <UnorderedList>
          <li>Confira tamanho mínimo e máximo.</li>
          <li>Confira se número, maiúscula, minúscula e caractere especial são obrigatórios.</li>
        </UnorderedList>
      </Section>

      <Section
        title="Aba Política de autenticação"
        subtitle="Exibe a política de sessão e autenticação do projeto."
      >
        <UnorderedList>
          <li>Confira expiração de access token e refresh token.</li>
          <li>
            Confira modo de sessão, limite de sessões, rotação de refresh token e revogação após
            troca de senha.
          </li>
          <li>
            Confira limite de falhas, duração do bloqueio, exigência de e-mail verificado e cadastro
            habilitado.
          </li>
        </UnorderedList>
      </Section>

      <Section title="Aba API Keys" subtitle="Lista as chaves criadas para o projeto.">
        <UnorderedList>
          <li>
            Observe nome, prefixo/preview, ambiente, escopos, criador, criação, último uso,
            expiração e revogação.
          </li>
          <li>Crie novas chaves quando precisar separar ambientes, serviços ou permissões.</li>
          <li>
            A chave bruta aparece apenas na criação. Depois disso, a tela exibe somente metadados
            seguros.
          </li>
        </UnorderedList>
      </Section>
    </>
  )
}

function CreateUsersContent() {
  return (
    <>
      <Section
        title="Quando criar o usuário"
        subtitle="Cadastre o usuário na API Your Auth no mesmo momento em que ele for cadastrado no seu produto."
      >
        <Paragraph>
          A ideia é manter o usuário final do seu projeto refletido no banco do Your Auth. Quando o
          cadastro acontece na sua aplicação, envie e-mail, senha e, opcionalmente, telefone para a
          API pública usando a API key do projeto.
        </Paragraph>
      </Section>

      <Section title="Endpoint" subtitle="A API key identifica o projeto associado à chamada.">
        <Endpoint method="POST" path="/users" />
        <CodeBlock label="json">{createUserRequestJson}</CodeBlock>
        <CodeBlock label="axios">{createUserAxiosCode}</CodeBlock>
      </Section>

      <Section title="Resposta de sucesso">
        <CodeBlock label="json">{createUserResponseJson}</CodeBlock>
      </Section>

      <Section title="Status possíveis" subtitle="Erros seguem o formato padrão do contrato.">
        <StatusList statuses={createUserStatuses} />
        <CodeBlock label="json">{loginErrorJson}</CodeBlock>
      </Section>
    </>
  )
}

function LoginContent() {
  return (
    <>
      <Section
        title="Endpoint"
        subtitle="O login autentica um usuário final no projeto associado à API key enviada."
      >
        <Endpoint method="POST" path="/users/login" />
        <Paragraph>
          Envie a API key no header X-API-Key. Os headers X-Forwarded-User-Agent, X-End-User-IP e
          X-Device-Name são opcionais e ajudam a registrar contexto real da sessão.
        </Paragraph>
        <CodeBlock label="json">{loginRequestJson}</CodeBlock>
        <CodeBlock label="axios">{loginAxiosCode}</CodeBlock>
      </Section>

      <Section title="Tokens retornados">
        <Paragraph>
          Em caso de sucesso, o contrato retorna user, token, success e loggedAt. O objeto token
          possui raw e duration. Além disso, o endpoint define cookies HTTP-only access-token e
          refresh_token via Set-Cookie para o fluxo web.
        </Paragraph>
        <CodeBlock label="json">{loginResponseJson}</CodeBlock>
      </Section>

      <Section title="Erros e status possíveis">
        <StatusList statuses={loginStatuses} />
        <Paragraph>
          O OpenAPI define o formato de erro abaixo para os status de falha. As mensagens exatas são
          produzidas pela API conforme a causa.
        </Paragraph>
        <CodeBlock label="json">{loginErrorJson}</CodeBlock>
      </Section>

      <Section title="Impacto da política de autenticação">
        <UnorderedList>
          <li>
            Limite de tentativas de login define quantas falhas são toleradas antes do bloqueio.
          </li>
          <li>Tempo de bloqueio define por quanto tempo o usuário final fica bloqueado.</li>
          <li>Modo de sessão única faz com que apenas uma sessão permaneça ativa por usuário.</li>
          <li>
            Modo de sessão limitada pode gerar 409 quando o limite de sessões ativas é atingido.
          </li>
          <li>
            Máximo de sessões ativas só se aplica quando Modo de sessão é Número de sessões
            limitado.
          </li>
          <li>
            Verificação de e-mail obrigatória pode impedir login quando o e-mail exigido ainda não
            estiver verificado.
          </li>
          <li>
            Rotação de refresh token habilitada muda o comportamento do refresh, gerando novo
            refresh token a cada renovação.
          </li>
        </UnorderedList>
      </Section>
    </>
  )
}

function SessionsContent() {
  return (
    <>
      <Section
        title="Validação de tokens"
        subtitle="A documentação pública deve acompanhar estritamente o contrato OpenAPI."
      >
        <Callout $tone="warning">
          <CalloutTitle>Endpoint dedicado ainda não existe no contrato</CalloutTitle>
          <CalloutText>
            O OpenAPI atual não expõe uma rota pública para validação direta de access token de
            usuário final. Antes de documentar essa ação, a operação precisa existir no contrato.
          </CalloutText>
        </Callout>
      </Section>

      <Section
        title="Refresh de sessão"
        subtitle="Renova a sessão web usando API key do projeto e cookie refresh_token."
      >
        <Endpoint method="POST" path="/users/refresh" />
        <Paragraph>
          O cookie refresh_token é obrigatório e deve ser enviado pelo navegador. A resposta de
          sucesso redefine os cookies HTTP-only access-token e refresh_token pelo header Set-Cookie.
        </Paragraph>
        <CodeBlock label="axios">{refreshAxiosCode}</CodeBlock>
        <StatusList statuses={refreshStatuses} />
      </Section>

      <Section
        title="Logout de sessão"
        subtitle="Encerra a sessão web do usuário final e limpa os cookies."
      >
        <Endpoint method="POST" path="/users/logout" />
        <Paragraph>
          O logout usa a API key do projeto e o cookie refresh_token. Em sucesso, retorna 204 e
          limpa access-token e refresh_token via Set-Cookie.
        </Paragraph>
        <CodeBlock label="axios">{logoutAxiosCode}</CodeBlock>
        <StatusList statuses={logoutStatuses} />
      </Section>
    </>
  )
}

function renderStepContent(slug: DocumentationSlug) {
  switch (slug) {
    case 'criando-projeto':
      return <CreateProjectContent />
    case 'gerenciamento-do-projeto':
      return <ProjectManagementContent />
    case 'criacao-de-usuarios':
      return <CreateUsersContent />
    case 'login':
      return <LoginContent />
    case 'gerenciamento-de-sessoes':
      return <SessionsContent />
    case 'start':
    default:
      return <StartContent />
  }
}

export function DocumentationPage({ slug = defaultDocumentationSlug }: DocumentationPageProps) {
  const step = getDocumentationStep(slug)
  const currentStepIndex = documentationSteps.findIndex((item) => item.slug === step.slug)
  const previousStep = documentationSteps[currentStepIndex - 1]
  const nextStep = documentationSteps[currentStepIndex + 1]

  return (
    <DocumentationRoot>
      <DocumentationHeader>
        <DocumentationEyebrow>Documentação</DocumentationEyebrow>
        <DocumentationTitle>{step.title}</DocumentationTitle>
        <DocumentationDescription>{step.description}</DocumentationDescription>
        <DocumentationMeta>
          <MetaPill>OpenAPI 0.0.1-SNAPSHOT</MetaPill>
          <MetaPill>Conta e projeto</MetaPill>
        </DocumentationMeta>
      </DocumentationHeader>

      <DocumentationContent>{renderStepContent(step.slug)}</DocumentationContent>

      <StepNavigation aria-label="Navegação entre etapas da documentação">
        <StepNavLink
          href={previousStep?.href ?? step.href}
          $disabled={!previousStep}
          aria-disabled={!previousStep}
        >
          <StepNavKicker>Anterior</StepNavKicker>
          <StepNavTitle>{previousStep?.title ?? 'Início da documentação'}</StepNavTitle>
        </StepNavLink>
        <StepNavLink
          href={nextStep?.href ?? step.href}
          $disabled={!nextStep}
          aria-disabled={!nextStep}
        >
          <StepNavKicker>Próxima</StepNavKicker>
          <StepNavTitle>{nextStep?.title ?? 'Fim da documentação'}</StepNavTitle>
        </StepNavLink>
      </StepNavigation>
    </DocumentationRoot>
  )
}
