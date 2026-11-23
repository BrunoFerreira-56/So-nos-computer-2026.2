# UTMarket — Frontend

Interface do **UTMarket**, marketplace para alunos e servidores da UTFPR, implementada a partir do
[protótipo no Figma](https://www.figma.com/design/Ln6nbHHKBtO6WjIEM36aDL/Marketplace?node-id=1-3) e dos
requisitos em [`../Requisitos de Sistema`](../Requisitos%20de%20Sistema) e
[`../Requisitos de Usuário`](../Requisitos%20de%20Usu%C3%A1rio).

> **Escopo:** apenas o frontend. Não há backend: os dados vêm de uma **API mock** (Route Handlers do Next em
> `src/app/api`) que guarda tudo em memória. As telas consomem essa API via Axios + TanStack Query exatamente como
> consumiriam a API real.

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar](#como-rodar)
- [Contas de demonstração](#contas-de-demonstração)
- [Scripts](#scripts)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Telas e rotas](#telas-e-rotas)
- [API mock](#api-mock)
- [Trocando o mock pela API real](#trocando-o-mock-pela-api-real)
- [Documentação complementar](#documentação-complementar)

## Stack

| Tecnologia | Uso |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Cache Components) | Rotas, layouts, Route Handlers da API mock, `proxy.ts` |
| TypeScript (strict) | Tipagem de todo o código |
| [HeroUI v3](https://heroui.com) + Tailwind CSS v4 | Componentes acessíveis (React Aria) estilizados com os tokens do Figma |
| [TanStack Query v5](https://tanstack.com/query) | Cache, carregamento, atualizações otimistas e "tempo real" por polling |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Formulários e validação (schemas compartilhados com a API mock) |
| [Axios](https://axios-http.com) | Cliente HTTP único (`src/lib/axios.ts`) |
| next-themes | Modo claro/escuro (botão lua/sol do header) |

## Pré-requisitos

- **Node.js 20.9+** (testado com Node 26 LTS) e npm.

## Como rodar

```bash
cd frontend
npm install
npm run dev
```

Abra <http://localhost:3000>. Sem sessão, o app redireciona para o login.

Build de produção:

```bash
npm run build
npm start
```

## Contas de demonstração

Todas usam a senha **`utmarket123`**.

| Usuário | E-mail | Para testar |
| --- | --- | --- |
| João Silva | `joao.silva@alunos.utfpr.edu.br` | Conta principal: tem anúncios próprios (disponível, vendido, inativo), favoritos e conversas |
| Ana Souza | `ana.souza@alunos.utfpr.edu.br` | Vendedora da calculadora; recebe as mensagens do João |

Outros comportamentos úteis para testar os critérios de aceitação:

- **E-mail não institucional** (ex.: `joao@gmail.com`) → erro no campo (D01b).
- **Senha errada** → alerta "E-mail ou senha incorretos" (D01c).
- **Recuperar senha:** a tela de "Verifique seu e-mail" tem um atalho "abrir o link do e-mail" (não há servidor de e-mail no mock).
- **Chat sem conexão:** DevTools → Network → *Offline*. A mensagem fica como "Aguardando conexão…" e é enviada ao voltar (D07b, RNF07).
- **Dados do mock** voltam ao estado inicial quando o servidor de desenvolvimento reinicia.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint (regras do Next + React Compiler) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier (com ordenação de classes Tailwind) |
| `npm run check` | typecheck + lint + format:check — rode antes de abrir PR |

## Variáveis de ambiente

Copie `.env.example` para `.env.local`.

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `/api` | Base da API usada pelo Axios. Vazia = API mock interna. |

## Estrutura de pastas

```
frontend/
├── docs/                      # Convenções e rastreabilidade tela ↔ requisito
├── public/
│   ├── icons/                 # 33 ícones SVG exportados do Figma
│   ├── mock/                  # Fotos dos anúncios de exemplo (Figma)
│   └── logo-utmarket*.svg     # Logo claro e escuro
└── src/
    ├── app/
    │   ├── (auth)/            # Login, cadastro, recuperar senha, nova senha
    │   ├── (main)/            # Telas logadas (header + navegação mobile)
    │   │   ├── (explorar)/    # Com menu lateral: hub, favoritos, meus anúncios
    │   │   ├── anuncios/      # Detalhes, novo, editar
    │   │   ├── conversas/     # Chat (lista + conversa)
    │   │   └── perfil/        # Perfil público e "meu perfil"
    │   ├── api/               # API mock (Route Handlers)
    │   ├── layout.tsx         # Fontes, metadados, providers
    │   └── providers.tsx      # TanStack Query, tema, toasts
    ├── components/
    │   ├── form/              # Campos ligados ao React Hook Form
    │   ├── layout/            # Header, menu lateral, barras mobile
    │   └── ui/                # Ícone, logo, avatar, badge, chip, estado vazio…
    ├── features/<domínio>/    # auth, listings, favorites, chat, profile, reports, reviews
    │   ├── api.ts             # Chamadas Axios tipadas
    │   ├── hooks.ts           # useQuery / useMutation
    │   ├── schemas.ts         # Schemas Zod (formulário + API mock)
    │   └── components/        # Componentes da feature
    ├── hooks/                 # Hooks genéricos (ex.: status de conexão)
    ├── lib/                   # axios, query client, query keys, formatação, constantes
    ├── mocks/                 # Banco em memória e utilitários da API mock
    ├── styles/                # tokens.css (Figma) e ajustes do HeroUI
    ├── types/                 # Tipos de domínio
    └── proxy.ts               # Redireciona para o login sem sessão
```

Detalhes e regras de organização: [`docs/CONVENCOES.md`](docs/CONVENCOES.md).

## Telas e rotas

| Rota | Tela (Figma) | Histórias |
| --- | --- | --- |
| `/login` | D01, D01b, D01c, M01 | US01 |
| `/cadastro` | D01d | US01 |
| `/recuperar-senha` | D02, D02b | US12 |
| `/nova-senha?email=` | D02c | US12 |
| `/` (`?q=`, `?campus=`) | D03, D03b, D04, M02 | US02, US08, US09 |
| `/favoritos` | D05 | US04 |
| `/anuncios/[id]` | D06, D06b, D06c, M03 | US03, US04, US05, US13 |
| `/conversas`, `/conversas/[id]` | D07, D07b, M04, M05 | US05, US11 |
| `/anuncios/novo` | D08, D08b, M06 | US06 |
| `/anuncios/[id]/editar` | D08c | US07 |
| `/meus-anuncios` | D09, D09a, D09b, D09c, M07, M07b | US07, US10 |
| `/perfil/[id]`, `/perfil/me` | D10, D10b, D10c | US13, US14 |

A matriz completa (nós do Figma, RF/RNF e componentes) está em
[`docs/RASTREABILIDADE.md`](docs/RASTREABILIDADE.md).

## API mock

Endpoints em `src/app/api` (todos exigem o cookie de sessão `utm_session`, exceto os de autenticação):

| Método e rota | Descrição |
| --- | --- |
| `POST /api/auth/login` · `register` · `logout` · `forgot-password` · `reset-password` | Autenticação |
| `GET/PATCH /api/auth/me` | Usuário logado / trocar campus |
| `GET/POST /api/listings` | Hub (`?q=`, `?campus=`) / criar anúncio |
| `GET/PATCH/DELETE /api/listings/:id` | Detalhes / editar / excluir (só o dono) |
| `PATCH /api/listings/:id/status` | Disponível, vendido ou inativo (só o dono) |
| `GET /api/me/listings` | Meus anúncios + contadores |
| `GET /api/me/favorites` · `PUT/DELETE /api/me/favorites/:listingId` | Favoritos |
| `GET/POST /api/conversations` | Conversas / abrir conversa sobre um anúncio |
| `GET /api/conversations/:id` · `POST …/messages` | Mensagens / enviar |
| `GET /api/users/:id` (aceita `me`) · `POST …/reviews` | Perfil público / avaliar |
| `POST /api/reports` | Denunciar anúncio ou perfil |

Erros seguem o formato `{ message, code?, fields? }` — `fields` traz erros por campo (HTTP 422).

## Trocando o mock pela API real

1. Defina `NEXT_PUBLIC_API_URL` com a URL do backend.
2. Garanta que o backend siga os contratos de `src/types/domain.ts` e o formato de erro acima (ou adapte `src/features/*/api.ts`).
3. Remova `src/app/api` e `src/mocks`.
4. Ajuste o `proxy.ts` para o cookie/sessão reais.
5. Troque o "tempo real" por polling no chat (`refetchInterval` em `src/features/chat/hooks.ts`) por WebSocket/SSE se o backend oferecer.

## Documentação complementar

- [`docs/CONVENCOES.md`](docs/CONVENCOES.md) — padrões de código, nomes, formulários, tokens, acessibilidade e commits.
- [`docs/RASTREABILIDADE.md`](docs/RASTREABILIDADE.md) — cada tela do Figma ligada à rota, às histórias e aos requisitos.
