/**
 * Tela:   Cadastro
 * Figma:  D01d (83:4337)
 * US:     US01
 * RF/RNF: RF01, RNF01
 */
import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return <RegisterForm />;
}
