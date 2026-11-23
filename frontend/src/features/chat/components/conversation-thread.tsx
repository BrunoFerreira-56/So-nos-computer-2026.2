"use client";

import { Button, Dropdown, Label, Skeleton } from "@heroui/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { ProductImage } from "@/components/ui/product-image";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useSession } from "@/features/auth/hooks";
import { ReportModal } from "@/features/reports/components/report-modal";
import { ReviewModal } from "@/features/reviews/components/review-modal";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { STATUS_LABEL } from "@/lib/constants";
import { formatPrice, genderWord, sellerWord } from "@/lib/format";
import type { ConversationDetail, Message } from "@/types/domain";
import { useConversation, usePendingMessages, useSendMessage } from "../hooks";
import { MessageBubble } from "./message-bubble";
import { MessageComposer } from "./message-composer";

/** Conversa aberta (D07, D07b, M05) — US11 · RF11, RNF03, RNF04, RNF07. */
export function ConversationThread() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, error } = useConversation(id);

  if (isPending) return <ThreadSkeleton />;
  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col">
        <MobileTopBar title="Conversa" backHref="/conversas" />
        <EmptyState
          className="mt-16"
          icon="chat"
          title="Conversa não encontrada"
          description={error?.message ?? "Ela pode ter sido removida."}
          action={
            <ButtonLink href="/conversas" variant="secondary">
              Ver conversas
            </ButtonLink>
          }
        />
      </div>
    );
  }
  return <Thread conversation={data} />;
}

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

function Thread({ conversation }: { conversation: ConversationDetail }) {
  const router = useRouter();
  const online = useOnlineStatus();
  const { data: user } = useSession();
  const pending = usePendingMessages(conversation.id);
  const sendMessage = useSendMessage(conversation.id);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { counterpart, listing } = conversation;
  const counterpartRole =
    conversation.role === "comprando"
      ? sellerWord(counterpart.gender)
      : genderWord(counterpart.gender, { a: "compradora", o: "comprador", neutral: "comprador(a)" });

  // Mantém a conversa rolada até a última mensagem.
  const lastId = conversation.messages.at(-1)?.id;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lastId, pending.length]);

  const moreMenu = (
    <Dropdown>
      <IconButton icon="more" label="Mais opções" />
      <Dropdown.Popover placement="bottom end" className="min-w-52">
        <Dropdown.Menu
          aria-label="Opções da conversa"
          onAction={(key) => {
            if (key === "profile") router.push(`/perfil/${counterpart.id}`);
            if (key === "review") setReviewOpen(true);
            if (key === "report") setReportOpen(true);
          }}
        >
          <Dropdown.Item id="profile" textValue="Ver perfil">
            <Icon name="user" />
            <Label>Ver perfil</Label>
          </Dropdown.Item>
          <Dropdown.Item id="review" textValue="Avaliar">
            <Icon name="star" />
            <Label>Avaliar {counterpartRole}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="report" textValue="Reportar usuário">
            <Icon name="flag" />
            <Label>Reportar usuário</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileTopBar title={counterpart.name} backHref="/conversas" action={moreMenu} />

      {/* Cabeçalho da conversa (desktop) */}
      <header className="hidden items-center gap-3 border-b border-ut-border px-6 py-3 md:flex">
        <UserAvatar name={counterpart.name} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={`/perfil/${counterpart.id}`} className="truncate type-body-strong text-ut-text hover:underline">
            {counterpart.name}
          </Link>
          <span className="type-caption text-ut-text-secondary">{online ? "Online agora" : "Você está offline"}</span>
        </div>
        <Button variant="secondary" onPress={() => setReviewOpen(true)}>
          <Icon name="star" tone="inherit" />
          Avaliar {counterpartRole}
        </Button>
        {moreMenu}
      </header>

      {/* Anúncio da negociação */}
      <Link
        href={`/anuncios/${listing.id}`}
        className="flex items-center gap-3 border-b border-ut-border bg-ut-subtle px-4 py-3 transition-colors hover:bg-ut-muted/40 md:px-6"
      >
        <span className="relative size-12 shrink-0 overflow-hidden rounded-ut-sm bg-ut-placeholder">
          <ProductImage src={listing.images[0]} alt="" sizes="48px" placeholder="" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate type-body text-ut-text">{listing.title}</span>
          <span className="type-caption text-ut-text-secondary">
            {formatPrice(listing.priceCents)} · {STATUS_LABEL[listing.status]}
          </span>
        </span>
        <span className="flex items-center gap-1 type-body-strong text-ut-text">
          <Icon name="chevron-right" />
          <span className="hidden md:inline">Ver anúncio</span>
        </span>
      </Link>

      {/* Mensagens */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6" aria-live="polite">
        <div className="mt-auto flex flex-col gap-3">
          {!online ? (
            <AlertBanner type="connection">
              Sem conexão. Suas mensagens ficam salvas e serão enviadas assim que a conexão voltar.
            </AlertBanner>
          ) : null}

          {conversation.messages.length === 0 && pending.length === 0 ? (
            <p className="py-10 text-center type-body text-ut-text-secondary">
              Diga olá e combine os detalhes da compra por aqui.
            </p>
          ) : null}

          {conversation.messages.map((message: Message, index) => {
            const day = dayLabel(message.createdAt);
            const previous = conversation.messages[index - 1];
            const showDay = !previous || dayLabel(previous.createdAt) !== day;
            const mine = message.authorId === user?.id;
            return (
              <Fragment key={message.id}>
                {showDay ? <p className="py-2 text-center type-caption text-ut-text-secondary">{day}</p> : null}
                <MessageBubble
                  text={message.text}
                  createdAt={message.createdAt}
                  mine={mine}
                  state={mine && message.readAt ? "lida" : "enviada"}
                />
              </Fragment>
            );
          })}

          {pending.map((message) => (
            <MessageBubble
              key={message.clientId}
              text={message.text}
              createdAt={message.createdAt}
              mine
              state="pendente"
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <MessageComposer onSend={sendMessage.send} />

      <ReviewModal
        isOpen={reviewOpen}
        onOpenChange={setReviewOpen}
        user={counterpart}
        listing={{ id: listing.id, title: listing.title.split(" — ")[0] ?? listing.title }}
      />
      <ReportModal
        isOpen={reportOpen}
        onOpenChange={setReportOpen}
        target={{ type: "user", id: counterpart.id, name: counterpart.name }}
      />
    </div>
  );
}

export function ThreadSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6" aria-busy="true" aria-label="Carregando conversa">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-14 w-full" />
      <div className="mt-auto flex flex-col gap-3">
        <Skeleton className="h-14 w-1/2 self-end rounded-ut-lg" />
        <Skeleton className="h-14 w-1/2 rounded-ut-lg" />
      </div>
    </div>
  );
}
