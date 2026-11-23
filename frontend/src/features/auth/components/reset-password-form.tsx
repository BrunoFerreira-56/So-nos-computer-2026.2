"use client";

import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormTextField } from "@/components/form/form-text-field";
import { AlertBanner } from "@/components/ui/alert-banner";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";
import { useResetPassword } from "../hooks";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas";
import { AuthHeading, AuthLink } from "./auth-heading";

/** Criar nova senha (D02c) — US12 · RF12. Ao salvar, já entra no sistema. */
export function ResetPasswordForm() {
  const email = useSearchParams().get("email") ?? "";
  const reset = useResetPassword();
  const { control, handleSubmit } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, password: "", confirmPassword: "" },
  });

  if (!email) {
    return (
      <div className="flex flex-col gap-6">
        <AuthHeading title="Link inválido" />
        <AlertBanner type="error">Este link de recuperação está incompleto ou expirou.</AlertBanner>
        <p className="type-body text-ut-text-secondary">
          <AuthLink href="/recuperar-senha">Pedir um novo link</AuthLink>
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit((values) => reset.mutate(values))} className="flex flex-col gap-6">
      <AuthHeading title="Criar nova senha" description="Escolha uma senha que você ainda não usou nesta conta." />
      {reset.error ? <AlertBanner type="error">{reset.error.message}</AlertBanner> : null}
      <div className="flex flex-col gap-4">
        <FormTextField
          control={control}
          name="password"
          type="password"
          label="Nova senha"
          placeholder="••••••••••"
          icon="lock"
          autoComplete="new-password"
          description={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        />
        <FormTextField
          control={control}
          name="confirmPassword"
          type="password"
          label="Confirmar nova senha"
          placeholder="••••••••••"
          icon="lock"
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" fullWidth isPending={reset.isPending}>
        Salvar e entrar
      </Button>
    </form>
  );
}
