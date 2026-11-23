/**
 * Tela:   Login
 * Figma:  D01 (83:4270) · D01b (83:4292) · D01c (83:4314) · M01 (83:5372)
 * US:     US01
 * RF/RNF: RF01, RNF01
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
