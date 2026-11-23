import axios, { AxiosError } from "axios";

/**
 * Cliente HTTP único do app. Toda chamada à API passa por aqui (features/*\/api.ts).
 *
 * `NEXT_PUBLIC_API_URL` aponta para o backend real; sem ela, usamos os
 * Route Handlers mock em `src/app/api`.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/** Formato de erro devolvido pela API: `{ message, code?, fields? }`. */
export interface ApiErrorBody {
  message: string;
  code?: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (!error.response) {
      return Promise.reject(new ApiError("Sem conexão com o servidor. Verifique sua internet.", 0, "network"));
    }
    const body = error.response.data;
    return Promise.reject(
      new ApiError(
        body?.message ?? "Algo deu errado. Tente novamente.",
        error.response.status,
        body?.code,
        body?.fields,
      ),
    );
  },
);

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
