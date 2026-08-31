# Your Auth

Your Auth é um projeto de autenticação e identidade pensado para servir como base moderna para aplicações SaaS, produtos digitais e times de desenvolvimento que precisam lidar com usuários, contas, sessões e segurança de acesso.

Atualmente, este repositório contém uma landing page pública pronta em Next.js. Ela apresenta a proposta do produto, a identidade visual inicial e a narrativa de valor da plataforma, mas ainda não implementa cadastro, login, sessões, tokens, APIs de autenticação, painel administrativo ou backend.

## Objetivo

O objetivo do Your Auth é evoluir para uma solução organizada de identidade, com foco em:

- cadastro e login de usuários;
- gerenciamento de identidade;
- sessões e tokens;
- recuperação de senha;
- verificação de e-mail;
- permissões e papéis de usuário;
- boas práticas de segurança;
- integração futura com aplicações externas;
- experiência clara para usuários finais e desenvolvedores.

Esses pontos representam a direção do produto. Eles não devem ser lidos como funcionalidades já implementadas, exceto quando indicados na seção de estado atual.

## Estado Atual

O projeto está no estágio de frontend público inicial.

Já existe:

- landing page pública renderizada pela rota principal `/`;
- identidade visual inicial do produto;
- navegação por âncoras na própria página;
- menu responsivo para dispositivos móveis;
- metadados da aplicação e ícones em `app/layout.tsx`;
- configuração de estilos globais com Tailwind CSS;
- componente base de botão em `components/ui/button.tsx`;
- utilitário `cn` para combinar classes CSS em `lib/utils.ts`;
- Vercel Analytics carregado apenas em produção.

Ainda não existe neste repositório:

- backend de autenticação;
- rotas de API;
- banco de dados;
- cadastro ou login funcional;
- gerenciamento real de sessões ou tokens;
- recuperação de senha;
- verificação de e-mail;
- controle de permissões e papéis;
- integrações reais com provedores externos;
- SDK, dashboard ou documentação técnica de API.

## Stack Utilizada

Stack identificada no repositório:

- Next.js 16 com App Router;
- React 19;
- TypeScript;
- Tailwind CSS 4;
- shadcn/base-nova via `components.json`;
- Base UI para primitivos de UI;
- lucide-react para ícones;
- class-variance-authority, clsx e tailwind-merge para composição de classes;
- ESLint 9 com configurações do Next.js;
- Prettier 3;
- Vercel Analytics.

Não há backend implementado no estado atual do projeto.

## Instalar Dependências

O repositório contém `pnpm-lock.yaml`, `pnpm-workspace.yaml` e `package-lock.json`. Use apenas um gerenciador de pacotes por alteração para evitar divergência entre locks.

Com pnpm:

```bash
pnpm install
```

Com npm:

```bash
npm install
```

## Rodar Localmente

Com pnpm:

```bash
pnpm dev
```

Com npm:

```bash
npm run dev
```

Depois, acesse o endereço informado pelo Next.js no terminal, normalmente `http://localhost:3000`.

## Scripts Disponíveis

Os scripts definidos em `package.json` são:

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm build
pnpm start
```

Os mesmos scripts também podem ser executados com npm usando `npm run`, exceto `start`, que também aceita `npm start`.

## Estrutura Principal

```text
app/
  globals.css        Estilos globais, tema e tokens CSS.
  layout.tsx         Layout raiz, metadados, viewport e Analytics em produção.
  page.tsx           Rota principal que renderiza a landing page.

components/
  your-auth-landing.tsx  Landing page pública do Your Auth.
  ui/button.tsx          Componente base de botão.

lib/
  utils.ts           Utilitário `cn` para composição de classes.

public/
  ...                Ícones e imagens estáticas usadas ou disponíveis para o app.

components.json     Configuração de UI/shadcn.
next.config.mjs     Configuração do Next.js.
eslint.config.mjs   Configuração do ESLint.
prettier.config.mjs Configuração do Prettier.
tsconfig.json       Configuração TypeScript.
```

## Landing Page Pública

A landing page está em `components/your-auth-landing.tsx` e é renderizada por `app/page.tsx`.

Ela apresenta:

- navegação com links para seções internas;
- chamada principal do produto;
- blocos de benefícios;
- lista de capacidades pretendidas;
- chamada final para explorar a plataforma;
- rodapé com marca e status visual;
- menu mobile controlado com `useState`;
- ícones de `lucide-react`.

Os textos da landing comunicam a visão e o posicionamento do produto. O exemplo de requisição, endpoint, token falso, menções a login social, gestão de sessões, plano gratuito ou status operacional são elementos de apresentação e não comprovam que essas funcionalidades já existem.

## Funcionalidades Já Existentes

- Exibição da landing page pública.
- Layout responsivo com menu mobile.
- Navegação por âncoras.
- Tema visual com variáveis CSS e suporte a esquema claro/escuro.
- Metadados e ícones da aplicação.
- Analytics em ambiente de produção.

## Funcionalidades Planejadas

- Cadastro de usuários.
- Login e logout.
- Autenticação social.
- Gerenciamento de identidade.
- Gerenciamento de sessões.
- Emissão, validação e revogação de tokens.
- Recuperação de senha.
- Verificação de e-mail.
- Permissões e papéis de usuário.
- Auditoria e boas práticas de segurança.
- Integrações com aplicações externas.
- Documentação para desenvolvedores.
- Eventual backend, banco de dados, API ou SDK, caso o produto evolua nessa direção.

## Orientações Para Desenvolvimento

- Leia o código existente antes de propor ou executar mudanças.
- Preserve a landing page atual quando a tarefa não pedir alterações visuais explicitamente.
- Mantenha a separação entre o que está implementado e o que é planejamento.
- Use TypeScript e os aliases existentes, como `@/components` e `@/lib/utils`.
- Siga os scripts e ferramentas já configurados no `package.json`.
- Mantenha o padrão de estilos com Tailwind CSS e variáveis definidas em `app/globals.css`.
- Use ícones de `lucide-react` quando fizer sentido dentro do padrão atual.
- Evite adicionar bibliotecas novas sem necessidade clara.
- Não introduza backend, banco de dados, rotas de API ou autenticação real sem pedido explícito.

## Cuidados Importantes

- Não afirmar que o produto possui autenticação funcional enquanto isso não estiver implementado.
- Não criar mocks que pareçam integrações reais.
- Não usar tokens, endpoints ou chaves fictícias como se fossem configuração válida.
- Não conectar APIs externas sem decisão arquitetural explícita.
- Não alterar a identidade visual da landing sem pedido claro.
- Não tratar a landing como documentação técnica de API.
- Revisar `next.config.mjs` antes de mudanças de build, pois `ignoreBuildErrors` está ativado para TypeScript.

## Próximos Passos Sugeridos

- Definir a arquitetura alvo de autenticação e identidade.
- Escolher se haverá backend no próprio Next.js, serviço separado ou provedor externo.
- Definir modelo de dados para usuários, contas, sessões, tokens e papéis.
- Planejar estratégia de segurança, expiração de tokens, revogação e recuperação de senha.
- Separar a comunicação pública da landing da documentação técnica do produto.
- Adicionar testes e validações conforme funcionalidades reais forem implementadas.
