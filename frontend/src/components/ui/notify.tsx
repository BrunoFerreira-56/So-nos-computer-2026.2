"use client";

import { toast } from "@heroui/react";
import { Icon } from "./icon";

/**
 * Toast do Figma (26:111): fundo invertido com ícone de check.
 * Use para confirmar ações curtas (denúncia, avaliação, rascunho salvo, link copiado).
 */
export function notify(message: string) {
  toast(message, { indicator: <Icon name="check" tone="inherit" /> });
}

/** Erro inesperado de uma ação (a API devolve a mensagem em português). */
export function notifyError(message: string) {
  toast(message, { indicator: <Icon name="alert" tone="inherit" /> });
}
