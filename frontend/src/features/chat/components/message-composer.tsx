"use client";

import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Icon } from "@/components/ui/icon";
import { messageSchema, type MessageInput } from "../schemas";

/** Campo de mensagem (27:426). Enter envia; Shift+Enter quebra a linha. */
export function MessageComposer({ onSend }: { onSend: (text: string) => void }) {
  const { register, handleSubmit, reset } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "" },
  });

  const submit = handleSubmit(({ text }) => {
    onSend(text);
    reset();
  });

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-2 border-t border-ut-border bg-ut-canvas px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      <label className="flex min-w-0 flex-1 rounded-[22px] border border-ut-border bg-ut-subtle px-4 py-3 focus-within:border-ut-focus">
        <span className="sr-only">Mensagem</span>
        <textarea
          {...register("text")}
          rows={1}
          placeholder="Escreva uma mensagem…"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
          className="field-sizing-content max-h-32 min-w-0 flex-1 resize-none bg-transparent type-body text-ut-text outline-none placeholder:text-ut-text-muted"
        />
      </label>
      <Button type="submit" isIconOnly aria-label="Enviar mensagem" className="size-11 min-w-11 rounded-full p-0">
        <Icon name="send" tone="inherit" />
      </Button>
    </form>
  );
}
