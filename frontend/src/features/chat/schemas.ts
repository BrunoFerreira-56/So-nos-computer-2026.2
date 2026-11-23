/** Schemas do chat interno (US05, US11 · RF05, RF11). */
import { z } from "zod";

export const messageSchema = z.object({
  text: z.string().trim().min(1, "Escreva uma mensagem.").max(1000, "Mensagem muito longa."),
});
export type MessageInput = z.infer<typeof messageSchema>;

export const startConversationSchema = z.object({
  listingId: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
});
export type StartConversationInput = z.infer<typeof startConversationSchema>;
