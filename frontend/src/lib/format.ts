/** Formatação de valores para exibição (pt-BR). */

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 44990 → "R$ 449,90" (o Intl usa espaço não separável; trocamos por espaço comum). */
export function formatPrice(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, " ");
}

/** Converte o texto digitado num campo de preço em centavos: "R$ 79,90" → 7990. */
export function parsePriceInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

/** Máscara de preço: cada dígito entra pela direita, como em apps de banco. */
export function maskPriceInput(value: string): string {
  const cents = parsePriceInput(value);
  return cents ? formatPrice(cents) : "";
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/** "há 3 dias", "há 2 semanas", "há 1 mês" (cópia do Figma D09/D10). */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  if (hours < 24) return `há ${hours} h`;
  if (days === 1) return "há 1 dia";
  if (days < 7) return `há ${days} dias`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return weeks === 1 ? "há 1 semana" : `há ${weeks} semanas`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "há 1 mês" : `há ${months} meses`;
  const years = Math.floor(days / 365);
  return years === 1 ? "há 1 ano" : `há ${years} anos`;
}

/** "4,0" — nota média com uma casa decimal. */
export function formatRating(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * Concordância de gênero para a cópia da interface, como no Figma ("vendedora", "Aluna desde").
 * Sem informação no cadastro, usa a forma neutra.
 */
export function genderWord(gender: "a" | "o" | undefined, forms: { a: string; o: string; neutral: string }): string {
  return gender ? forms[gender] : forms.neutral;
}

export const sellerWord = (gender?: "a" | "o") =>
  genderWord(gender, { a: "vendedora", o: "vendedor", neutral: "vendedor(a)" });

/** Junta classes condicionais, ignorando valores falsos. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
