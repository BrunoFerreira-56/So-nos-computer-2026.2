"use client";

import { Toast } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { getQueryClient } from "@/lib/query-client";

/**
 * Provedores globais: TanStack Query (dados), next-themes (claro/escuro) e a região de toasts do HeroUI.
 * O HeroUI v3 não precisa de Provider próprio.
 */
export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        {children}
        {/* Largura automática: o toast do Figma (26:111) se ajusta ao texto. */}
        <Toast.Provider placement="bottom" width="auto" className="pb-20 md:pb-6" />
      </ThemeProvider>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
