import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { RatingStars } from "@/components/ui/rating-stars";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatRating, genderWord, pluralize } from "@/lib/format";
import type { UserProfile } from "@/types/domain";

/** "Informações do vendedor" (D06) — com link para o perfil (D10). */
export function SellerSummary({ seller }: { seller: UserProfile }) {
  const since = genderWord(seller.gender, { a: "Aluna", o: "Aluno", neutral: "Membro" });
  return (
    <section className="flex flex-col gap-3" aria-labelledby="seller-heading">
      <div className="flex items-center justify-between">
        <h2 id="seller-heading" className="type-title-3 text-ut-text">
          Informações do vendedor
        </h2>
        <Link href={`/perfil/${seller.id}`} className="type-body-strong text-ut-link underline underline-offset-2">
          Ver perfil
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <UserAvatar name={seller.name} />
        <div className="flex flex-col gap-0.5">
          <p className="type-body text-ut-text">{seller.name}</p>
          <RatingStars
            value={seller.rating}
            caption={`${formatRating(seller.rating)} (${pluralize(seller.ratingCount, "avaliação", "avaliações")})`}
          />
          <p className="type-caption text-ut-text-secondary">
            {since} desde {seller.memberSince} · {pluralize(seller.activeListings, "anúncio ativo", "anúncios ativos")}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Cartão compacto do vendedor no mobile (M03): toque abre o perfil. */
export function SellerCardLink({ seller }: { seller: UserProfile }) {
  return (
    <Link
      href={`/perfil/${seller.id}`}
      className="flex items-center gap-3 rounded-ut-md border border-ut-border p-3 transition-colors hover:bg-ut-subtle"
    >
      <UserAvatar name={seller.name} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="type-body text-ut-text">{seller.name}</p>
        <RatingStars value={seller.rating} caption={formatRating(seller.rating)} />
      </div>
      <Icon name="chevron-right" />
    </Link>
  );
}
