import { api } from "@/lib/axios";
import type { ConversationDetail, ConversationSummary, Message } from "@/types/domain";
import type { StartConversationInput } from "./schemas";

export const chatApi = {
  list: () => api.get<ConversationSummary[]>("/conversations").then((r) => r.data),
  get: (id: string) => api.get<ConversationDetail>(`/conversations/${id}`).then((r) => r.data),
  start: (input: StartConversationInput) => api.post<{ id: string }>("/conversations", input).then((r) => r.data),
  send: (conversationId: string, text: string) =>
    api.post<Message>(`/conversations/${conversationId}/messages`, { text }).then((r) => r.data),
};
