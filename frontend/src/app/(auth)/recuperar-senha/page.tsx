/**
 * Tela:   Recuperar senha / Instruções enviadas
 * Figma:  D02 (83:4359) · D02b (83:4377)
 * US:     US12
 * RF/RNF: RF12
 */
import type { Metadata } from "next";
import { ForgotPasswordFlow } from "@/features/auth/components/forgot-password-flow";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
