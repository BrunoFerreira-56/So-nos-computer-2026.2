"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { IconButton } from "@/components/ui/icon-button";

const noop = () => () => {};

/** Botão "Alternar tema" do header (83:377): lua no modo claro, sol no escuro. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // O tema só é conhecido no navegador; no servidor mostramos a lua.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      icon={isDark ? "sun" : "moon"}
      label={isDark ? "Usar modo claro" : "Usar modo escuro"}
      onPress={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
