/**
 * Tela:   Nova senha
 * Figma:  D02c (83:4395)
 * US:     US12
 * RF/RNF: RF12
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = { title: "Criar nova senha" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
