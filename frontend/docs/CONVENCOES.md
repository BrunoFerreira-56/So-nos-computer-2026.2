# Convenções do frontend

Padrões adotados no frontend do UTMarket. Siga-os ao criar ou alterar telas para manter o código consistente com o
Figma e com os requisitos.

## Sumário

1. [Organização de pastas](#1-organização-de-pastas)
2. [Nomes](#2-nomes)
3. [Padrão de feature: api → hooks → componentes](#3-padrão-de-feature-api--hooks--componentes)
4. [Dados com TanStack Query](#4-dados-com-tanstack-query)
5. [Formulários com React Hook Form + Zod](#5-formulários-com-react-hook-form--zod)
6. [Componentes e HeroUI](#6-componentes-e-heroui)
7. [Tokens e tema](#7-tokens-e-tema)
8. [Responsividade](#8-responsividade)
9. [Next.js 16: Cache Components e Proxy](#9-nextjs-16-cache-components-e-proxy)
10. [Acessibilidade](#10-acessibilidade)
11. [Documentação no código](#11-documentação-no-código)
12. [Como adicionar uma tela](#12-como-adicionar-uma-tela)
13. [Commits e PRs](#13-commits-e-prs)

## 1. Organização de pastas

| Pasta | O que vai nela |
| --- | --- |
| `src/app` | **Só roteamento**: `page.tsx`, `layout.tsx` e Route Handlers. Páginas são finas e renderizam um componente de `features/`. |
| `src/features/<domínio>` | Tudo de um domínio de negócio: `api.ts`, `hooks.ts`, `schemas.ts`, `components/`. |
| `src/components/ui` | Peças visuais genéricas da biblioteca do Figma (ícone, avatar, badge, chip, estado vazio…). Sem regra de negócio. |
| `src/components/form` | Campos de formulário ligados ao React Hook Form. |
| `src/components/layout` | Estrutura de página: header, menu lateral, barras mobile, título de seção. |
| `src/lib` | Infraestrutura sem React: Axios, QueryClient, query keys, formatação, constantes. |
| `src/mocks` | Banco em memória e utilitários da API mock. **Nunca** importe de componentes de cliente. |
| `src/styles` | `tokens.css` (espelho do Figma) e `heroui-overrides.css`. |
| `src/types` | Tipos de domínio compartilhados (contrato da API). |

Uma feature pode importar de `components/`, `lib/`, `hooks/`, `types/` e de outras features (ex.: `listings` usa o
`ReportModal` de `reports`). Componentes genéricos **não** importam de features.

## 2. Nomes

| Item | Padrão | Exemplo |
| --- | --- | --- |
| Pastas e arquivos | kebab-case | `listing-card.tsx`, `use-online-status.ts` |
| Componentes | PascalCase, exportação nomeada | `export function ListingCard()` |
| Hooks | `useAlgo` | `useToggleFavorite` |
| Schemas Zod | `algoSchema` + tipos `AlgoInput` / `AlgoFormValues` | `listingSchema`, `ListingInput` |
| Rotas | português, como o produto | `/anuncios/novo`, `/meus-anuncios` |
| Textos da interface | português, copiados do Figma | "Conversar com a vendedora" |
| Código (variáveis, funções) | inglês | `priceCents`, `sellerId` |

`export default` só onde o Next exige (`page.tsx`, `layout.tsx`, `not-found.tsx`).

## 3. Padrão de feature: api → hooks → componentes

```
features/listings/
├── api.ts        // funções Axios tipadas — nenhuma lógica de UI
├── hooks.ts      // useQuery/useMutation usando api.ts e queryKeys
├── schemas.ts    // Zod: validação do formulário e do Route Handler
└── components/   // telas e peças da feature, usando só os hooks
```

- Componentes **não** chamam `api` nem Axios diretamente: sempre por um hook.
- Toda chamada HTTP passa por `src/lib/axios.ts`, que converte erros em `ApiError` com mensagem em português.

## 4. Dados com TanStack Query

- **Query keys** só via `queryKeys` (`src/lib/query-keys.ts`). Nada de arrays soltos.
- Depois de uma mutation, invalide as listas afetadas (veja `useInvalidateListings` em `features/listings/hooks.ts`).
- **Atualização otimista** quando a ação precisa parecer instantânea: favoritar, alterar status, enviar mensagem.
  Sempre com rollback em `onError`.
- **Tempo real do chat** é simulado com `refetchInterval` (2 s) enquanto há conexão.
- Estados obrigatórios de toda tela com dados: **carregando** (Skeleton), **erro** (AlertBanner com "Tentar de novo")
  e **vazio** (EmptyState).

## 5. Formulários com React Hook Form + Zod

- O schema fica em `features/<domínio>/schemas.ts` e é usado **no formulário e no Route Handler mock**, então a
  mensagem de erro é a mesma dos dois lados.
- Mensagens de erro em português e **iguais às do Figma** (ex.: "Informe um título para o anúncio.").
- Use os campos de `components/form` (`FormTextField`, `FormSelectField`, `FormPriceField`, `FormTextAreaField`).
  Eles já aplicam os estados Default/Foco/Erro do Figma (nó 26:60).
- Selects começam vazios (`""`). Para tipar isso, use `formResolver<Valores, Saída>(schema)` de `src/lib/form.ts`.
- Erros por campo vindos da API (`ApiError.fields`) vão para o campo com `setError` (exemplo: `register-form.tsx`).
- Formulários usam `noValidate` e `validationBehavior="aria"`: a validação é do Zod, não do navegador.

## 6. Componentes e HeroUI

- **HeroUI v3** (componentes compostos, sem Provider): `Button`, `TextField`, `Select`, `Modal`, `Dropdown`, `Sheet`,
  `RadioGroup`, `Skeleton`, `Avatar`, `Toast`… A documentação da versão instalada está em
  `node_modules/@heroui/react/docs/components/*.md`.
- Mapeamento das variantes de botão do Figma: **Primário** → `variant="primary"`, **Secundário** → `"secondary"`,
  **Fantasma** → `"ghost"`.
- Links com aparência de botão: `ButtonLink` / `IconLink` (`components/ui/button-link.tsx`).
- Gatilho personalizado de Dropdown: use `<Dropdown.Trigger className=…>` em vez de `<button>` nativo.
- Ícones: sempre `<Icon name="…" />`. Os SVGs originais do Figma ficam em `public/icons` e são aplicados como máscara
  CSS, então herdam `currentColor` e funcionam no modo escuro. **Não edite nem redesenhe os SVGs.**
- Confirmações curtas: `notify("…")` (toast do Figma, 26:111).

## 7. Tokens e tema

- **Fonte da verdade:** `src/styles/tokens.css`, espelho da coleção "Tokens" do Figma (modos Claro e Escuro).
  Ao mudar uma cor no Figma, mude aqui.
- Use as classes geradas dos tokens: `bg-ut-canvas`, `bg-ut-subtle`, `text-ut-text-secondary`, `border-ut-border`,
  `bg-brand`, `text-brand-text`, `rounded-ut-md`… **Não use hex soltos nem cores padrão do Tailwind** (`gray-500`).
- Tipografia do Figma como utilitários: `type-display`, `type-title-1`, `type-title-2`, `type-title-3`, `type-body`,
  `type-body-strong`, `type-caption`, `type-price`.
- Fontes: League Spartan (títulos) e Inter (texto), via `next/font`.
- Tema: classe `.dark` no `<html>` (next-themes). Use a variante `dark:` só quando o token não resolver sozinho.
- Ajustes visuais de componentes HeroUI vão em `src/styles/heroui-overrides.css`, nunca com `!important` espalhado.

## 8. Responsividade

Breakpoints usados (RNF04 — sem rolagem horizontal em nenhuma largura):

| Faixa | Layout |
| --- | --- |
| `< 768px` | Mobile (M01–M07b): `MobileTopBar` por página + `MobileBottomNav` fixa |
| `≥ 768px` (`md`) | Header desktop; telas em duas colunas onde o Figma pede |
| `≥ 1024px` (`lg`) | Menu lateral (hub, favoritos, meus anúncios), prévia do anúncio |
| `≥ 1280px` (`xl`) | Grade do hub com 4 colunas |

Telas com ação fixa no rodapé (detalhes, conversa, formulário) escondem a barra inferior — lista em
`components/layout/mobile-bottom-nav.tsx`.

## 9. Next.js 16: Cache Components e Proxy

Esta versão do Next tem mudanças em relação ao que costuma aparecer em tutoriais. Antes de usar uma API do Next,
consulte `node_modules/next/dist/docs/`.

- **`middleware.ts` virou `proxy.ts`.** A checagem de sessão fica em `src/proxy.ts`.
- **Cache Components está ligado.** Componentes de cliente que leem a URL (`useParams`, `usePathname`,
  `useSearchParams`, `useSelectedLayoutSegment`) em rotas dinâmicas precisam estar dentro de `<Suspense>` — de
  preferência com o skeleton da tela como `fallback`.
- **Rotas anteriores ficam montadas e escondidas** (`<Activity>`): feche menus/modais transitórios ao sair da tela e
  não confie em "desmontou = limpou estado".
- `next/image`: `priority` foi descontinuado. Use `loading="eager"` (ou a prop `eager` de `ProductImage`) para a
  imagem principal visível e `preload` só em imagem de destaque renderizada no servidor.

## 10. Acessibilidade

- Componentes HeroUI já trazem teclado e ARIA (React Aria). Não substitua por `div` clicável.
- Botões só com ícone **sempre** têm `label`/`aria-label` (o `IconButton` exige).
- Cards de anúncio usam "link esticado" (o card todo abre os detalhes) sem aninhar botões dentro de links.
- Erros de formulário: `role="alert"` no `AlertBanner` e `FieldError` ligado ao campo.
- Movimento: animações respeitam `prefers-reduced-motion`.
- Contraste: use os tokens; eles foram definidos no Figma para os dois modos.

## 11. Documentação no código

- **Toda `page.tsx` começa com o bloco padrão** que liga a rota ao Figma e aos requisitos:

  ```tsx
  /**
   * Tela:   Detalhes do anúncio · Reportar anúncio · Denúncia registrada
   * Figma:  D06 (83:4592) · D06b (83:4650) · D06c (83:4724) · M03 (83:5404)
   * US:     US03, US04, US05, US13
   * RF/RNF: RF03, RF04, RF05, RF13
   */
  ```

- Componentes de tela citam o nó do Figma e a US no JSDoc (ex.: `/** Card de anúncio (27:261) — US02, US03, US04. */`).
- Comentários explicam **por quê**, não o quê.
- Ao adicionar ou mudar uma tela, atualize [`RASTREABILIDADE.md`](RASTREABILIDADE.md).

## 12. Como adicionar uma tela

1. Localize o frame no Figma (página **Telas**) e anote o nó (ex.: `83:4592`) e as US/RF da anotação "Anotação/HU".
2. Se faltar endpoint, crie o Route Handler em `src/app/api/…` e o schema em `features/<domínio>/schemas.ts`.
3. Crie as funções em `api.ts` e os hooks em `hooks.ts` (com `queryKeys`).
4. Crie o componente da tela em `features/<domínio>/components/<nome>-view.tsx`, com estados de carregando, erro e vazio
   e a versão mobile (`MobileTopBar`).
5. Crie a rota em `src/app/(main)/…/page.tsx` com o bloco de documentação e, se ler a URL, `<Suspense>`.
6. Adicione a linha em `docs/RASTREABILIDADE.md`.
7. Rode `npm run check` e confira a tela no navegador em 390 px e 1440 px, nos modos claro e escuro.

## 13. Commits e PRs

- Mensagens no imperativo, em português, com prefixo do tipo:
  `feat: adiciona filtro por campus no hub`, `fix: corrige rolagem do chat no mobile`, `docs: …`, `refactor: …`, `style: …`.
- Cite a história quando fizer sentido: `feat(US08): filtro por campus`.
- Antes do PR: `npm run check` sem erros e `npm run build` passando.
