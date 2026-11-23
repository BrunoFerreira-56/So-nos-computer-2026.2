import { api } from "@/lib/axios";
import type { CampusId, User } from "@/types/domain";
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "./schemas";

export const authApi = {
  me: () => api.get<User>("/auth/me").then((r) => r.data),
  login: (input: LoginInput) => api.post<User>("/auth/login", input).then((r) => r.data),
  register: (input: RegisterInput) => api.post<User>("/auth/register", input).then((r) => r.data),
  logout: () => api.post("/auth/logout").then(() => undefined),
  forgotPassword: (input: ForgotPasswordInput) =>
    api.post<{ sentTo: string; expiresInMinutes: number }>("/auth/forgot-password", input).then((r) => r.data),
  resetPassword: (input: ResetPasswordInput) => api.post<User>("/auth/reset-password", input).then((r) => r.data),
  updateCampus: (campus: CampusId) => api.patch<User>("/auth/me", { campus }).then((r) => r.data),
};
