import type { CampusId } from "@/types/domain";

/**
 * Chaves do TanStack Query, centralizadas para que invalidações não dependam
 * de strings soltas. Sempre use estas fábricas em useQuery/invalidateQueries.
 */
export const queryKeys = {
  session: ["session"] as const,

  listings: {
    all: ["listings"] as const,
    list: (filters: { q?: string; campus?: CampusId | null }) => ["listings", "list", filters] as const,
    detail: (id: string) => ["listings", "detail", id] as const,
    mine: ["listings", "mine"] as const,
  },

  favorites: ["favorites"] as const,

  conversations: {
    all: ["conversations"] as const,
    detail: (id: string) => ["conversations", id] as const,
  },

  profiles: {
    detail: (id: string) => ["profiles", id] as const,
  },
};
