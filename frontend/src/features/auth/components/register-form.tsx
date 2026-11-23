"use client";

import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormTextField } from "@/components/form/form-text-field";
import { AlertBanner } from "@/components/ui/alert-banner";
import { CAMPI, MIN_PASSWORD_LENGTH } from "@/lib/constants";
import { isApiError } from "@/lib/axios";
import { formResolver } from "@/lib/form";
import { useRegister } from "../hooks";
import { registerSchema, type RegisterInput } from "../schemas";
import { AuthHeading, AuthLink } from "./auth-heading";

type RegisterFormValues = Omit<RegisterInput, "campus"> & { campus: RegisterInput["campus"] | "" };

/** Cadastro (D01d): só e-mail institucional (RNF01). */
export function RegisterForm() {
  const register = useRegister();
  const { control, handleSubmit, setError } = useForm<RegisterFormValues, unknown, RegisterInput>({
    resolver: formResolver<RegisterFormValues, RegisterInput>(registerSchema),
    defaultValues: { name: "", email: "", campus: "", password: "" },
  });

  function onSubmit(values: RegisterInput) {
    register.mutate(values, {
      onError: (error) => {
        // Erros por campo vindos da API (ex.: e-mail já cadastrado) aparecem no próprio campo.
        if (isApiError(error) && error.fields) {
          for (const [field, message] of Object.entries(error.fields)) {
            setError(field as keyof RegisterFormValues, { message });
          }
        }
      },
    });
  }

  const generalError =
    register.error && !(isApiError(register.error) && register.error.fields) ? register.error.message : null;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <AuthHeading title="Criar conta" description="Cadastro exclusivo para alunos e servidores da UTFPR." />

      {generalError ? <AlertBanner type="error">{generalError}</AlertBanner> : null}

      <div className="flex flex-col gap-4">
        <FormTextField
          control={control}
          name="name"
          label="Nome completo"
          placeholder="Como você quer ser chamado"
          icon="user"
          autoComplete="name"
        />
        <FormTextField
          control={control}
          name="email"
          type="email"
          label="E-mail institucional"
          placeholder="seunome@alunos.utfpr.edu.br"
          icon="mail"
          autoComplete="email"
          description="Enviaremos um link de confirmação para este e-mail."
        />
        <FormSelectField
          control={control}
          name="campus"
          label="Campus"
          placeholder="Selecione seu campus"
          options={CAMPI}
        />
        <FormTextField
          control={control}
          name="password"
          type="password"
          label="Senha"
          placeholder="••••••••••"
          icon="lock"
          autoComplete="new-password"
          description={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        />
      </div>

      <Button type="submit" fullWidth isPending={register.isPending}>
        {register.isPending ? "Criando conta…" : "Criar conta"}
      </Button>

      <p className="text-center type-body text-ut-text-secondary">
        Já tem conta? <AuthLink href="/login">Entrar</AuthLink>
      </p>
    </form>
  );
}
