import { Icon } from "@/components/ui/icon";
import { cn, formatTime } from "@/lib/format";

interface MessageBubbleProps {
  text: string;
  createdAt: string;
  mine: boolean;
  /** "lida" mostra "Lida ✓✓"; "pendente" é a mensagem esperando conexão (D07b). */
  state?: "enviada" | "lida" | "pendente";
}

/** Balão de mensagem (27:390): amarelo para "Eu", cinza para o outro participante. */
export function MessageBubble({ text, createdAt, mine, state = "enviada" }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[min(304px,80%)] flex-col gap-1 rounded-ut-lg px-3 py-2 md:max-w-[304px]",
          mine ? "bg-brand text-on-brand" : "bg-ut-muted text-ut-text",
          state === "pendente" && "opacity-60",
        )}
      >
        <p className="type-body break-words whitespace-pre-line">{text}</p>
        <p
          className={cn(
            "flex items-center gap-1 text-[11px] leading-4",
            mine ? "justify-end text-on-brand/80" : "text-ut-text-secondary",
          )}
        >
          {formatTime(createdAt)}
          {mine && state === "lida" ? (
            <>
              <span aria-hidden>·</span> Lida
              <span className="inline-flex" aria-hidden>
                <Icon name="check" size={12} tone="inherit" />
                <Icon name="check" size={12} tone="inherit" className="-ml-2" />
              </span>
            </>
          ) : null}
          {mine && state === "pendente" ? (
            <>
              <span aria-hidden>·</span> Aguardando conexão…
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
