# Rastreabilidade: telas ↔ requisitos

Liga cada tela do protótipo no Figma (arquivo **Marketplace**, página **Telas**) à rota do frontend, às histórias de
usuário ([`HistoriasUsuario.md`](../../Requisitos%20de%20Usu%C3%A1rio/HistoriasUsuario.md)), aos requisitos
([`RF.md`](../../Requisitos%20de%20Sistema/RF.md), [`RNF.md`](../../Requisitos%20de%20Sistema/RNF.md)) e aos
principais componentes.

Os nós são do **modo claro** (seção `83:4269`). Cada tela tem uma versão escura equivalente na seção `85:3532`
(ex.: D01 claro `83:4270` ↔ escuro `85:3533`), atendida pelo mesmo código via tokens.

## 1. Telas desktop

| Figma | Nó | Rota | US | RF/RNF | Componentes principais |
| --- | --- | --- | --- | --- | --- |
| D01 · Login | `83:4270` | `/login` | US01 | RF01, RNF01 | `LoginForm`, `FormTextField`, `AuthHeading` |
| D01b · Login — e-mail não institucional | `83:4292` | `/login` (erro de validação) | US01 | RNF01 | `institutionalEmail` (Zod), `FieldMessage` |
| D01c · Login — credenciais inválidas | `83:4314` | `/login` (erro da API) | US01 | RF01 | `AlertBanner` (erro), `forceInvalid` |
| D01d · Cadastro | `83:4337` | `/cadastro` | US01 | RF01, RNF01 | `RegisterForm`, `FormSelectField` |
| D02 · Recuperar senha | `83:4359` | `/recuperar-senha` | US12 | RF12 | `ForgotPasswordFlow` |
| D02b · Instruções enviadas | `83:4377` | `/recuperar-senha` (após enviar) | US12 | RF12 | `InstructionsSent`, `AlertBanner` (info) |
| D02c · Nova senha | `83:4395` | `/nova-senha?email=` | US12 | RF12 | `ResetPasswordForm` |
| D03 · Hub principal | `83:4412` | `/` | US02, US04, US08, US15 | RF02, RF04, RF08, RNF02, RNF04, RNF05 | `HubView`, `ListingCard`, `CampusFilter`, `SideMenu`, `AppHeader` |
| D03b · Hub — carregando | `83:4455` | `/` (carregando) | US02 | RNF02 | `ListingCardSkeleton` |
| D04 · Busca sem resultados | `83:4530` | `/?q=…&campus=…` | US08, US09 | RF08, RF09 | `HeaderSearch`, `EmptyState` |
| D05 · Favoritos | `83:4566` | `/favoritos` | US04 | RF04 | `FavoritesView`, `useToggleFavorite` |
| D06 · Detalhes do anúncio | `83:4592` | `/anuncios/[id]` | US03, US04, US05 | RF03, RF04, RF05 | `ListingDetailView`, `ListingGallery`, `SellerSummary` |
| D06b · Reportar anúncio | `83:4650` | `/anuncios/[id]` (modal) | US13 | RF13 | `ReportModal` |
| D06c · Denúncia registrada | `83:4724` | `/anuncios/[id]` (toast) | US13 | RF13 | `notify` (Toast) |
| D07 · Chat interno | `83:4783` | `/conversas/[id]` | US05, US11 | RF05, RF11, RNF03, RNF04 | `ChatShell`, `ConversationList`, `ConversationThread`, `MessageBubble`, `MessageComposer` |
| D07b · Chat — sem conexão | `83:4823` | `/conversas/[id]` (offline) | US11 | RNF07 | `useOnlineStatus`, `pendingStore`, `useChatOutbox`, `AlertBanner` (conexão) |
| D08 · Criar anúncio | `83:4866` | `/anuncios/novo` | US06, US15 | RF06, RNF05 | `ListingForm`, `PhotoPicker`, `ListingPreview` |
| D08b · Criar anúncio — campos faltando | `83:4919` | `/anuncios/novo` (erros) | US06 | RF06 | `listingSchema`, resumo "Faltam N campos" |
| D08c · Editar anúncio | `83:4973` | `/anuncios/[id]/editar` | US07 | RF07 | `EditListingView`, `ListingForm`, `DeleteListingModal` |
| D09 · Meus anúncios | `83:5030` | `/meus-anuncios` | US07, US10 | RF07, RF10 | `MyListingsView`, `SellerListingRow`, `StatusBadge` |
| D09a · Alterar status | `83:5074` | `/meus-anuncios` (menu) | US10 | RF10 | `Dropdown` "Alterar status", `useSetListingStatus` |
| D09b · Meus anúncios — vazio | `83:5129` | `/meus-anuncios` (sem anúncios) | US06, US07 | RF06 | `EmptyState` |
| D09c · Confirmar exclusão | `83:5148` | `/meus-anuncios` (modal) | US07 | RF07 | `DeleteListingModal` |
| D10 · Perfil do vendedor | `83:5201` | `/perfil/[id]` | US13, US14 | RF13, RF14 | `ProfileView`, `ReviewCard` |
| D10b · Avaliar usuário | `83:5250` | `/perfil/[id]` (modal) · `/conversas/[id]` | US14 | RF14 | `ReviewModal`, `RatingInput` |
| D10c · Avaliação registrada | `83:5322` | `/perfil/[id]` (toast) | US14 | RF14 | `notify` (Toast) |

## 2. Telas mobile (390 px)

| Figma | Nó | Rota | US | RF/RNF | Particularidades |
| --- | --- | --- | --- | --- | --- |
| M01 · Login | `83:5372` | `/login` | US01 | RF01, RNF01, RNF04 | Painel institucional oculto |
| M02 · Hub | `83:5388` | `/` | US02, US08, US09, US15 | RF02, RF08, RF09, RNF04, RNF05 | Busca na página, chips com rolagem horizontal, grade de 2 colunas, `MobileBottomNav` |
| M03 · Detalhes do anúncio | `83:5404` | `/anuncios/[id]` | US03, US04, US05, US13 | RF03, RF04, RF05, RF13 | Ações Favoritar/Reportar/Perfil, `SellerCardLink`, CTA fixo |
| M04 · Conversas | `83:5428` | `/conversas` | US11 | RF11, RNF04 | Só a lista |
| M05 · Conversa | `83:5436` | `/conversas/[id]` | US11 | RF11, RNF04, RNF07 | Só a conversa; barra inferior oculta |
| M06 · Criar anúncio | `83:5454` | `/anuncios/novo` | US06 | RF06, RNF04 | Prévia oculta; "Publicar" fixo no rodapé |
| M07 · Meus anúncios | `83:5469` | `/meus-anuncios` | US07, US10 | RF07, RF10 | Linha compacta com botão "mais" |
| M07b · Ações do anúncio | `83:5506` | `/meus-anuncios` (bottom sheet) | US07, US10 | RF07, RF10 | `Sheet` com editar, status e excluir |

## 3. Histórias de usuário → onde estão atendidas

| US | Critérios de aceitação | Como o frontend atende |
| --- | --- | --- |
| US01 | Só e-mail institucional; credenciais válidas entram; inválidas mostram erro e mantêm no login; funciona no app e no site | Zod `institutionalEmail` (D01b); API mock 401 → alerta (D01c); `proxy.ts` protege as rotas; layout responsivo (M01) |
| US02 | Hub lista anúncios resumidos; carrega em até 2 s; 100% responsivo | `HubView` + `ListingCard`; skeleton enquanto carrega (D03b); grade 2→4 colunas, sem rolagem horizontal em 390/768/1440 px |
| US03 | Abrir anúncio mostra detalhes; ações favoritar, contatar, reportar | Card inteiro leva a `/anuncios/[id]`; ações no topo (D06) e na barra mobile (M03) |
| US04 | Favoritar na listagem e nos detalhes; remover; ver lista | `useToggleFavorite` (otimista) no card e nos detalhes; `/favoritos`; contador no header |
| US05 | Opção de contato; abre conversa no chat; sem voz/ligação | "Conversar com o vendedor" e mensagem rápida → `POST /conversations` → `/conversas/[id]` |
| US06 | Formulário acessível; cria e aparece na listagem; aponta campos faltando | `/anuncios/novo` a 1 clique; publica → detalhes e hub; resumo + erro por campo (D08b) |
| US07 | Editar/excluir só nos próprios; edição aparece; exclusão some da listagem | Ações só em "Meus anúncios"/dono; API mock devolve 403 para outros; `DeleteListingModal` + invalidação |
| US08 | Filtro por campus; mostra só o campus; remover filtro | `CampusFilter` (13 campus, "Mais campus"); `?campus=` na URL; chip selecionado com "×" e "Todos os campus" |
| US09 | Campo de busca no hub; resultados relacionados; aviso de sem resultados | `HeaderSearch` / busca mobile → `?q=`; busca sem acentos no mock; `EmptyState` (D04) |
| US10 | Alterar para Vendido/Inativo; some dos disponíveis; só o dono | Menu "Alterar status" (D09a) e "Reativar"; hub filtra `status = disponivel`; API mock checa o dono |
| US11 | Troca de mensagens; ≤ 500 ms; mensagens não se perdem; responsivo | Envio otimista; polling de 2 s simula tempo real; fila offline em `localStorage` reenviada ao reconectar (D07b) |
| US12 | Opção na tela de login; envia instruções; define nova senha e entra | "Esqueci minha senha" → D02 → D02b (contagem para reenviar) → D02c → login automático |
| US13 | Reportar na tela do anúncio e do perfil; confirma; fica registrado | `ReportModal` (listing/user) → `POST /reports` → toast (D06c) |
| US14 | Enviar avaliação; fica no perfil; confirma | `ReviewModal` no perfil e no chat → `POST /users/:id/reviews` → toast (D10c) e lista de avaliações atualizada |
| US15 | Chat e criação de anúncio em até 3 cliques | Header: "Vender" e ícone de chat (1 clique); mobile: abas "Vender" e "Chat" (1 toque) |

## 4. Requisitos não funcionais

| RNF | Situação no frontend |
| --- | --- |
| RNF01 — e-mail institucional | Validado no formulário e na API mock (mesmo schema Zod). |
| RNF02 — hub em até 2 s | Latência do mock de ~350 ms; imagens otimizadas pelo `next/image` (as da primeira linha com `loading="eager"`); skeleton imediato. A medição real depende do backend. |
| RNF03 — mensagens em até 500 ms | Envio otimista (aparece na hora) e endpoint de mensagens com 120 ms de latência. Entrega ao outro usuário é simulada por polling de 2 s; no backend real, usar WebSocket/SSE. |
| RNF04 — hub e chat 100% responsivos | Layouts mobile/desktop seguindo M01–M07b; verificado sem rolagem horizontal em 390 px. |
| RNF05 — chat/venda em 3 cliques | Ver US15. |
| RNF06 — disponibilidade 24/7 | Requisito de infraestrutura/backend; fora do escopo do frontend. |
| RNF07 — mensagens não se perdem | Fila local persistente (`pendingStore`) + reenvio automático com nova tentativa (`useChatOutbox`). |

## 5. Componentes da biblioteca do Figma → código

| Figma (página Components) | Nó | Código |
| --- | --- | --- |
| Ícones (20px) | `25:5` | `public/icons/*.svg` + `components/ui/icon.tsx` |
| Botão (Primário/Secundário/Fantasma) | `25:144` | `Button` do HeroUI + `styles/heroui-overrides.css`; `ButtonLink` |
| Logo/UTMarket | `93:10679` | `components/ui/logo.tsx` (+ animação de entrada) |
| Avatar | `83:288` | `components/ui/user-avatar.tsx` |
| Placeholder/Imagem | `25:153` | `components/ui/product-image.tsx` |
| Badge de status | `25:166` | `components/ui/status-badge.tsx` |
| Chip de filtro | `25:171` | `components/ui/filter-chip.tsx` |
| Campo de texto / Select / Área de texto | `26:60` / `26:61` / `26:68` | `components/form/*` |
| Campo de busca | `26:72` | `components/layout/header-search.tsx` |
| Opção (radio) | `83:325` | `RadioGroup` do HeroUI (no `ReportModal`) |
| Alerta (Erro/Sucesso/Info/Conexão) | `26:110` | `components/ui/alert-banner.tsx` |
| Toast | `26:111` | `components/ui/notify.tsx` + `Toast.Provider` |
| Estado vazio | `26:116` | `components/ui/empty-state.tsx` |
| Avaliação (estrelas) | `26:129` | `components/ui/rating-stars.tsx` |
| Botão ícone | `83:280` | `components/ui/icon-button.tsx`, `IconLink` |
| Header/Desktop | `27:76` | `components/layout/app-header.tsx` |
| Menu lateral/Item | `27:136` | `components/layout/side-menu.tsx` |
| Mobile/Barra superior | `27:163` | `components/layout/mobile-top-bar.tsx` |
| Mobile/Navegação inferior | `27:175` | `components/layout/mobile-bottom-nav.tsx` |
| Card de anúncio | `27:261` | `features/listings/components/listing-card.tsx` |
| Linha de anúncio (vendedor) | `27:380` | `features/listings/components/seller-listing-row.tsx` |
| Balão de mensagem / Item de conversa / Campo de mensagem | `27:390` / `27:425` / `27:426` | `features/chat/components/*` |
| Fotos geradas | `83:4268` | `public/mock/*.png` |

## 6. Diferenças conscientes em relação ao Figma

| Ponto | Decisão |
| --- | --- |
| Animação do logo | No Figma ela repete em loop (prévia do protótipo); no app roda uma vez ao abrir as telas de autenticação. |
| Rótulo "Campus:" do filtro | Sem recuo à esquerda, para a linha de chips caber em 1440 px mesmo com a barra de rolagem do navegador. |
| Tokens escuros ausentes | `bg/pressed` e `placeholder` não existem no modo escuro do Figma; foram derivados de `bg/muted` (marcados em `tokens.css`). |
| Dados dos exemplos | O seed segue o conteúdo das telas, mas os números (ex.: "6 anúncios ativos") são calculados a partir dos dados do mock. |
| Notificações (sino) | Não há tela no Figma; o botão abre um popover "Você não tem notificações novas". |
