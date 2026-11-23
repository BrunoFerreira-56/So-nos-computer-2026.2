/**
 * Fila local de mensagens escritas sem conexão (RNF07 / D07b).
 *
 * As mensagens ficam no localStorage, então sobrevivem a recarregar a página ou
 * fechar o navegador, e são enviadas assim que a conexão volta (`useChatOutbox`).
 */

export interface PendingMessage {
  clientId: string;
  conversationId: string;
  text: string;
  createdAt: string;
}

const STORAGE_KEY = "utm:chat-outbox";
const listeners = new Set<() => void>();
let cache: PendingMessage[] | null = null;

function read(): PendingMessage[] {
  if (cache) return cache;
  if (typeof window === "undefined") return [];
  try {
    cache = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as PendingMessage[];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: PendingMessage[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

const EMPTY: PendingMessage[] = [];

export const pendingStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: read,
  getServerSnapshot: () => EMPTY,
  add(message: Omit<PendingMessage, "clientId" | "createdAt">) {
    write([...read(), { ...message, clientId: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  },
  remove(clientId: string) {
    write(read().filter((m) => m.clientId !== clientId));
  },
};
