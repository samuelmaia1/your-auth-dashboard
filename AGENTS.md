# AGENTS.md

Este arquivo orienta futuros agentes Codex que trabalharem no projeto Your Auth. Leia este documento e o código existente antes de propor ou executar mudanças.

## Contexto do Produto

Your Auth é uma iniciativa de autenticação e identidade para aplicações SaaS, produtos digitais e times de desenvolvimento. A intenção do produto é oferecer uma base organizada para lidar com usuários, contas, sessões, tokens, recuperação de senha, verificação de e-mail, permissões, papéis e segurança de acesso.

No estado atual do repositório, essa é uma visão de produto, não uma plataforma de autenticação implementada.

## Intenção Arquitetural

A direção arquitetural esperada é evoluir com clareza e segurança para um sistema de identidade real, separando:

- interface pública e comunicação do produto;
- experiência de usuário final;
- experiência para desenvolvedores;
- lógica real de autenticação;
- persistência de usuários, contas e sessões;
- integrações externas;
- regras de segurança, autorização e auditoria.

Não presuma qual backend, banco de dados, provedor de autenticação, SDK ou estratégia de tokens será usado. Essas decisões ainda não estão implementadas no repositório e devem ser propostas ou executadas apenas quando solicitadas.

## Escopo Atual

O projeto contém uma landing page pública em Next.js.

Arquivos centrais:

- `app/page.tsx`: renderiza a landing page.
- `app/layout.tsx`: define metadados, viewport, ícones, idioma `pt-BR` e Vercel Analytics em produção.
- `app/globals.css`: define imports do Tailwind, tema, tokens CSS, modo claro/escuro e estilos base.
- `components/your-auth-landing.tsx`: componente client-side da landing page.
- `components/ui/button.tsx`: componente base de botão com Base UI e class-variance-authority.
- `lib/utils.ts`: utilitário `cn` com `clsx` e `tailwind-merge`.

Não há backend, rotas de API, banco de dados, autenticação real ou integrações reais implementadas neste momento.

## O Que Pode Ser Alterado

Sem pedido explícito, limite mudanças a documentação, ajustes pequenos e manutenções diretamente relacionadas à tarefa.

Pode ser alterado quando a tarefa pedir:

- documentação do projeto;
- componentes existentes, se a solicitação envolver frontend;
- estilos globais, se a solicitação envolver identidade visual ou layout;
- configurações de lint, formatação, build ou TypeScript, se houver motivo direto;
- estrutura de frontend, quando a tarefa exigir uma nova experiência.

## O Que Não Deve Ser Alterado Sem Pedido Explícito

- Não alterar a landing page pública sem solicitação clara.
- Não criar novas páginas.
- Não implementar cadastro, login, logout ou fluxos de autenticação por conta própria.
- Não criar backend novo.
- Não criar rotas de API.
- Não conectar banco de dados.
- Não integrar provedores externos.
- Não adicionar SDKs, clientes HTTP ou bibliotecas de autenticação sem necessidade aprovada.
- Não trocar a identidade visual existente sem direção do usuário.
- Não remover ou reescrever estruturas existentes apenas por preferência.

## Regra Essencial Sobre Funcionalidades

Sempre distinga com precisão:

- funcionalidades implementadas no código atual;
- textos de marketing ou exemplos visuais da landing;
- funcionalidades planejadas para o produto;
- propostas técnicas ainda não aprovadas.

Não afirme que login social, gestão de sessões, tokens, verificação de e-mail, recuperação de senha, permissões, planos, APIs ou status operacional existem como funcionalidade real enquanto não houver implementação correspondente no repositório.

O snippet visual da landing com endpoint, credenciais e chave falsa é apenas demonstrativo. Não trate esse trecho como API existente.

## Padrões de Código

- Use TypeScript.
- Respeite `strict: true` no `tsconfig.json`.
- Use aliases existentes, especialmente `@/*`, `@/components`, `@/components/ui`, `@/lib` e `@/lib/utils`.
- Siga o estilo do Prettier: sem ponto e vírgula, aspas simples, trailing commas e largura de 100 colunas.
- Use ESLint conforme configurado em `eslint.config.mjs`.
- Prefira componentes pequenos, claros e coesos.
- Evite abstrações novas sem ganho real.
- Não adicione comentários óbvios; comente apenas decisões que ajudem a entender uma parte menos evidente.

## Convenções de Componentes e Estilos

- A aplicação usa Next.js App Router.
- Componentes interativos devem ser client components com `'use client'` quando necessário.
- Estilos são feitos principalmente com classes Tailwind CSS.
- Tokens de cor, raio e tema ficam em `app/globals.css`.
- A configuração de UI está em `components.json`, com estilo `base-nova`, CSS variables e ícones `lucide`.
- Use `lucide-react` para ícones quando houver ícone adequado.
- Use `cn` de `@/lib/utils` para combinar classes condicionais.
- Preserve a linguagem visual da landing: layout limpo, tipografia forte, tons neutros, acento verde, bordas sutis, cards simples e botões arredondados.

## Frontend e Backend

Frontend existente:

- Next.js;
- React;
- Tailwind CSS;
- componentes em `components/`;
- rota principal em `app/page.tsx`.

Backend existente:

- nenhum backend foi encontrado no repositório.

Se uma tarefa pedir backend ou autenticação real, primeiro leia a base atual, explique as opções compatíveis e implemente apenas o escopo solicitado. Não simule segurança real com mocks enganosos.

## Comandos Úteis

Os scripts disponíveis em `package.json` são:

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm build
pnpm start
```

O repositório contém locks de pnpm e npm. Mantenha consistência com o gerenciador escolhido para a tarefa. Scripts equivalentes podem ser executados com `npm run`, quando a equipe optar por npm.

## Validação

Antes de finalizar mudanças de código, quando aplicável:

- rode `pnpm lint` ou comando equivalente com npm;
- rode `pnpm build` para validar build do Next.js;
- rode `pnpm format:check` quando houver mudanças amplas de formatação.

Para mudanças apenas em documentação, a validação pode ser leitura manual dos arquivos alterados.

## Cuidados Com Autenticação

- Não criar autenticação falsa.
- Não criar endpoints falsos fora de exemplos claramente marcados como ilustrativos.
- Não salvar tokens fictícios como se fossem configuração real.
- Não usar variáveis de ambiente não documentadas no projeto.
- Não afirmar conformidade de segurança sem implementação e validação.
- Não expor ou inventar chaves, segredos, provedores ou credenciais.
- Não transformar copy de landing em contrato técnico.

## Ao Iniciar Uma Nova Tarefa

1. Leia a estrutura do projeto com `rg --files`.
2. Abra os arquivos relevantes antes de editar.
3. Confira `package.json` para scripts e dependências reais.
4. Verifique se a tarefa pede documentação, frontend, backend ou produto.
5. Preserve alterações do usuário e não reverta trabalho que você não fez.
6. Antes de responder, deixe claro o que foi implementado, o que foi apenas documentado e o que permanece planejado.
