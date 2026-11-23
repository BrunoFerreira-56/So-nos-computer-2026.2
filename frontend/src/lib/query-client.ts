import { QueryClient, isServer } from "@tanstack/react-query";
import { isApiError } from "./axios";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Erros 4xx não melhoram com nova tentativa.
          if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        // Mutations offline ficam pausadas e são reenviadas quando a conexão volta (RNF07).
        networkMode: "online",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Um QueryClient por requisição no servidor e um único no navegador. */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
