"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { PublicProfile, Review } from "@/types/domain";
import type { ReviewInput } from "@/features/reviews/schemas";
import type { ReportInput } from "@/features/reports/schemas";

export const profileApi = {
  get: (id: string) => api.get<PublicProfile>(`/users/${id}`).then((r) => r.data),
  review: (userId: string, input: ReviewInput) =>
    api.post<Review>(`/users/${userId}/reviews`, input).then((r) => r.data),
  report: (input: ReportInput) => api.post<{ id: string }>("/reports", input).then((r) => r.data),
};

/** Perfil público (D10). `id` pode ser "me". */
export function useProfile(id: string) {
  return useQuery({ queryKey: queryKeys.profiles.detail(id), queryFn: () => profileApi.get(id) });
}

/** Avaliar outro usuário (US14). */
export function useCreateReview(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReviewInput) => profileApi.review(userId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
}

/** Denunciar anúncio ou perfil (US13). */
export function useCreateReport() {
  return useMutation({ mutationFn: profileApi.report });
}
