/**
 * Tipos de domínio do UTMarket, compartilhados entre a API mock e o frontend.
 * Quando o backend real existir, estes tipos devem refletir o contrato da API.
 */

export type CampusId =
  | "apucarana"
  | "campo-mourao"
  | "cornelio-procopio"
  | "curitiba"
  | "dois-vizinhos"
  | "francisco-beltrao"
  | "guarapuava"
  | "londrina"
  | "medianeira"
  | "pato-branco"
  | "ponta-grossa"
  | "santa-helena"
  | "toledo";

/** Status de um anúncio (US10 / RF10). Só "disponivel" aparece no hub. */
export type ListingStatus = "disponivel" | "vendido" | "inativo";

export type CategoryId = "livros" | "eletronicos" | "vestuario" | "laboratorio" | "moveis" | "transporte" | "outros";

export type ConditionId = "novo" | "como-novo" | "bom-estado" | "marcas-de-uso";

/**
 * Concordância de gênero usada só na cópia da interface ("vendedora"/"vendedor").
 * Vem do cadastro; quando ausente, a interface usa a forma neutra "vendedor(a)".
 */
export type GrammaticalGender = "a" | "o";

export interface User {
  id: string;
  name: string;
  email: string;
  campus: CampusId;
  course?: string;
  memberSince: number;
  gender?: GrammaticalGender;
}

/** Perfil público de um usuário, com dados agregados (D10). */
export interface UserProfile extends Omit<User, "email"> {
  rating: number;
  ratingCount: number;
  activeListings: number;
}

export interface Listing {
  id: string;
  title: string;
  /** Preço em centavos, para evitar erros de ponto flutuante. */
  priceCents: number;
  description: string;
  category: CategoryId;
  condition: ConditionId;
  campus: CampusId;
  status: ListingStatus;
  images: string[];
  pickup?: string;
  sellerId: string;
  createdAt: string;
  conversationsCount: number;
}

export interface ListingWithSeller extends Listing {
  seller: UserProfile;
  isFavorite: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  text: string;
  createdAt: string;
  readAt: string | null;
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  updatedAt: string;
}

export interface ConversationSummary extends Conversation {
  listing: Pick<Listing, "id" | "title" | "priceCents" | "status" | "images">;
  /** O outro participante, do ponto de vista do usuário logado. */
  counterpart: UserProfile;
  lastMessage: Message | null;
  unread: boolean;
  role: "comprando" | "vendendo";
}

export interface ConversationDetail extends ConversationSummary {
  messages: Message[];
}

export type ReviewTag = "como-anunciado" | "boa-comunicacao" | "pontual" | "preco-justo";

export interface Review {
  id: string;
  targetUserId: string;
  author: Pick<UserProfile, "id" | "name">;
  rating: number;
  tags: ReviewTag[];
  comment: string;
  createdAt: string;
}

export type ReportReason = "golpe" | "proibido" | "enganoso" | "spam" | "outro";

export interface Report {
  id: string;
  targetType: "listing" | "user";
  targetId: string;
  reason: ReportReason;
  details: string;
  createdAt: string;
}

export interface PublicProfile {
  user: UserProfile;
  listings: ListingWithSeller[];
  reviews: Review[];
}

export interface MyListingsSummary {
  listings: Listing[];
  counts: Record<ListingStatus, number> & { conversasAbertas: number };
}
