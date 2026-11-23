"use client";

import { Button, Skeleton } from "@heroui/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { notifyError } from "@/components/ui/notify";
import { RatingStars } from "@/components/ui/rating-stars";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useLogout, useSession } from "@/features/auth/hooks";
import { useStartConversation } from "@/features/chat/hooks";
import { ListingCard } from "@/features/listings/components/listing-card";
import { ReportModal } from "@/features/reports/components/report-modal";
import { ReviewModal } from "@/features/reviews/components/review-modal";
import { campusName } from "@/lib/constants";
import { firstName, formatRating, formatRelative, pluralize } from "@/lib/format";
import type { PublicProfile, Review } from "@/types/domain";
import campusPhoto from "../../../../public/mock/campus.png";
import { useProfile } from "../hooks";

const REVIEWS_PREVIEW = 3;

/** Perfil do vendedor (D10) com "Avaliar" (D10b → D10c) e "Reportar perfil" (US13). */
export function ProfileView() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, error } = useProfile(id);

  if (isPending) return <ProfileSkeleton />;
  if (error || !data) {
    return (
      <>
        <MobileTopBar title="Perfil" />
        <EmptyState
          className="mt-16"
          icon="user"
          title="Perfil não encontrado"
          description="Este usuário não existe ou removeu a conta."
          action={
            <ButtonLink href="/" variant="secondary">
              Voltar ao início
            </ButtonLink>
          }
        />
      </>
    );
  }
  return <Profile profile={data} />;
}

function Profile({ profile }: { profile: PublicProfile }) {
  const router = useRouter();
  const { data: me } = useSession();
  const logout = useLogout();
  const startConversation = useStartConversation();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { user, listings, reviews } = profile;
  const isMe = me?.id === user.id;
  const name = firstName(user.name);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, REVIEWS_PREVIEW);

  function sendMessage() {
    const listing = listings[0];
    if (!listing) {
      notifyError(`${name} não tem anúncios ativos para conversar agora.`);
      return;
    }
    startConversation.mutate({ listingId: listing.id }, { onError: (e) => notifyError(e.message) });
  }

  return (
    <>
      <MobileTopBar title={isMe ? "Meu perfil" : user.name} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-12 lg:px-[120px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="hidden w-fit cursor-pointer items-center gap-1 rounded-ut-sm type-body-strong text-ut-text hover:underline md:inline-flex"
        >
          <Icon name="chevron-left" size={16} />
          Voltar
        </button>

        <div className="relative h-28 w-full overflow-hidden rounded-ut-md md:h-40">
          <Image
            src={campusPhoto}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Cabeçalho do perfil */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center">
          <UserAvatar name={user.name} size="lg" className="-mt-12 border-4 border-ut-canvas md:mt-0 md:border-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="type-title-1 text-ut-text">{user.name}</h1>
            <p className="type-body text-ut-text-secondary">
              {[user.course, `Campus ${campusName(user.campus)}`].filter(Boolean).join(" · ")}
            </p>
            <div className="flex flex-wrap items-center gap-x-1">
              <RatingStars
                value={user.rating}
                caption={`${formatRating(user.rating)} (${pluralize(user.ratingCount, "avaliação", "avaliações")})`}
              />
              <span className="type-caption text-ut-text-secondary">
                · No UTMarket desde {user.memberSince} ·{" "}
                {pluralize(user.activeListings, "anúncio ativo", "anúncios ativos")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isMe ? (
              <>
                <ButtonLink href="/meus-anuncios">
                  <Icon name="tag" tone="inherit" />
                  Meus anúncios
                </ButtonLink>
                <Button variant="secondary" isPending={logout.isPending} onPress={() => logout.mutate()}>
                  <Icon name="logout" tone="inherit" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button isPending={startConversation.isPending} onPress={sendMessage}>
                  <Icon name="chat" tone="inherit" />
                  Enviar mensagem
                </Button>
                <Button variant="secondary" onPress={() => setReviewOpen(true)}>
                  <Icon name="star" tone="inherit" />
                  Avaliar
                </Button>
                <IconButton icon="flag" label="Reportar perfil" onPress={() => setReportOpen(true)} />
              </>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Anúncios */}
          <section className="flex flex-col gap-4" aria-labelledby="profile-listings">
            <h2 id="profile-listings" className="type-title-2 text-ut-text">
              {isMe ? "Meus anúncios ativos" : `Anúncios de ${name}`} ({listings.length})
            </h2>
            {listings.length === 0 ? (
              <p className="type-body text-ut-text-secondary">Nenhum anúncio ativo no momento.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {listings.map((listing, index) => (
                  <li key={listing.id}>
                    <ListingCard listing={listing} eager={index < 3} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Avaliações */}
          <section className="flex flex-col gap-4" aria-labelledby="profile-reviews">
            <div className="flex items-center justify-between">
              <h2 id="profile-reviews" className="type-title-2 text-ut-text">
                Avaliações ({user.ratingCount})
              </h2>
              {reviews.length > REVIEWS_PREVIEW ? (
                <button
                  type="button"
                  onClick={() => setShowAllReviews((v) => !v)}
                  className="cursor-pointer type-body-strong text-ut-link underline underline-offset-2"
                >
                  {showAllReviews ? "Ver menos" : "Ver todas"}
                </button>
              ) : null}
            </div>
            {reviews.length === 0 ? (
              <p className="type-body text-ut-text-secondary">Ainda não há avaliações com comentário.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {visibleReviews.map((review) => (
                  <li key={review.id}>
                    <ReviewCard review={review} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {!isMe ? (
        <>
          <ReviewModal isOpen={reviewOpen} onOpenChange={setReviewOpen} user={user} />
          <ReportModal
            isOpen={reportOpen}
            onOpenChange={setReportOpen}
            target={{ type: "user", id: user.id, name: user.name }}
          />
        </>
      ) : null}
    </>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-3 rounded-ut-md border border-ut-border p-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={review.author.name} size="sm" />
        <span className="flex-1 type-body text-ut-text">{review.author.name}</span>
        <span className="type-caption text-ut-text-secondary">{formatRelative(review.createdAt)}</span>
      </div>
      <RatingStars value={review.rating} />
      {review.comment ? <p className="type-body text-ut-text">{review.comment}</p> : null}
    </article>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-8 md:px-8 lg:px-[120px]" aria-busy="true">
      <Skeleton className="h-40 w-full rounded-ut-md" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-ut-md" />
    </div>
  );
}
