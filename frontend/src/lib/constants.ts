import type { CampusId, CategoryId, ConditionId, ListingStatus, ReportReason, ReviewTag } from "@/types/domain";

/** Os 13 campus da UTFPR (filtro de US08 / RF08). */
export const CAMPI: { id: CampusId; name: string }[] = [
  { id: "cornelio-procopio", name: "Cornélio Procópio" },
  { id: "londrina", name: "Londrina" },
  { id: "curitiba", name: "Curitiba" },
  { id: "apucarana", name: "Apucarana" },
  { id: "campo-mourao", name: "Campo Mourão" },
  { id: "ponta-grossa", name: "Ponta Grossa" },
  { id: "dois-vizinhos", name: "Dois Vizinhos" },
  { id: "francisco-beltrao", name: "Francisco Beltrão" },
  { id: "guarapuava", name: "Guarapuava" },
  { id: "medianeira", name: "Medianeira" },
  { id: "pato-branco", name: "Pato Branco" },
  { id: "santa-helena", name: "Santa Helena" },
  { id: "toledo", name: "Toledo" },
];

/** Quantos campus aparecem como chip antes do "Mais campus" (igual ao Figma D03). */
export const VISIBLE_CAMPUS_CHIPS = 6;

export const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: "livros", name: "Livros e apostilas" },
  { id: "eletronicos", name: "Calculadoras e eletrônicos" },
  { id: "vestuario", name: "Jalecos e vestuário" },
  { id: "laboratorio", name: "Material de laboratório" },
  { id: "moveis", name: "Móveis" },
  { id: "transporte", name: "Transporte" },
  { id: "outros", name: "Outros" },
];

export const CONDITIONS: { id: ConditionId; name: string }[] = [
  { id: "novo", name: "Novo" },
  { id: "como-novo", name: "Usado — como novo" },
  { id: "bom-estado", name: "Usado — bom estado" },
  { id: "marcas-de-uso", name: "Usado — com marcas de uso" },
];

export const STATUS_LABEL: Record<ListingStatus, string> = {
  disponivel: "Disponível",
  vendido: "Vendido",
  inativo: "Inativo",
};

export const REPORT_REASONS: { id: ReportReason; label: string }[] = [
  { id: "golpe", label: "Produto falso ou golpe" },
  { id: "proibido", label: "Item proibido ou ilegal" },
  { id: "enganoso", label: "Preço ou informações enganosas" },
  { id: "spam", label: "Anúncio duplicado ou spam" },
  { id: "outro", label: "Outro motivo" },
];

export const REVIEW_TAGS: { id: ReviewTag; label: string }[] = [
  { id: "como-anunciado", label: "Produto como anunciado" },
  { id: "boa-comunicacao", label: "Boa comunicação" },
  { id: "pontual", label: "Pontual" },
  { id: "preco-justo", label: "Preço justo" },
];

export const RATING_LABEL = ["", "Ruim", "Regular", "Boa", "Muito boa", "Excelente"] as const;

/** Domínios aceitos no cadastro/login (RNF01). */
export const INSTITUTIONAL_DOMAINS = ["alunos.utfpr.edu.br", "utfpr.edu.br"] as const;

export const MAX_LISTING_PHOTOS = 10;
export const MIN_PASSWORD_LENGTH = 8;

export function campusName(id: CampusId | null | undefined): string {
  return CAMPI.find((c) => c.id === id)?.name ?? "";
}

export function categoryName(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? "";
}

export function conditionName(id: ConditionId): string {
  return CONDITIONS.find((c) => c.id === id)?.name ?? "";
}
