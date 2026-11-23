"use client";

import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormTextField } from "@/components/form/form-text-field";
import { AlertBanner } from "@/components/ui/alert-banner";
import { isApiError } from "@/lib/axios";
import { useLogin } from "../hooks";
import { loginSchema, type LoginInput } from "../schemas";
import { AuthHeading, AuthLink } from "./auth-heading";

/** Formulário de login: D01 (padrão), D01b (e-mail não institucional) e D01c (credenciais inválidas). */
export function LoginForm() {
  const params = useSearchParams();
  const login = useLogin(params.get("voltar") ?? undefined);
  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const invalidCredentials = isApiError(login.error) && login.error.code === "invalid_credentials";
  const otherError = login.error && !invalidCredentials ? login.error.message : null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => login.mutate(values))}
      // Ao editar depois de um erro, o alerta some e o usuário tenta de novo.
      onChange={() => login.isError && login.reset()}
      className="flex flex-col gap-6"
    >
      <AuthHeading title="Entrar" description="Use seu e-mail institucional da UTFPR para acessar sua conta." />

      {invalidCredentials ? (
        <AlertBanner type="error">E-mail ou senha incorretos. Verifique os dados e tente novamente.</AlertBanner>
      ) : null}
      {otherError ? <AlertBanner type="error">{otherError}</AlertBanner> : null}

      <div className="flex flex-col gap-4">
        <FormTextField
          control={control}
          name="email"
          type="email"
          label="E-mail institucional"
          placeholder="seunome@alunos.utfpr.edu.br"
          icon="mail"
          autoComplete="username"
          description="Aceitamos apenas e-mail institucional da UTFPR."
        />
        <FormTextField
          control={control}
          name="password"
          type="password"
          label="Senha"
          placeholder="••••••••••"
          icon="lock"
          autoComplete="current-password"
          forceInvalid={invalidCredentials}
        />
      </div>

      <div className="-mt-2 flex justify-end">
        <AuthLink href="/recuperar-senha">Esqueci minha senha</AuthLink>
      </div>

      <Button type="submit" fullWidth isPending={login.isPending}>
        {login.isPending ? "Entrando…" : "Entrar"}
      </Button>

      <p className="text-center type-body text-ut-text-secondary">
        Ainda não tem conta? <AuthLink href="/cadastro">Criar conta</AuthLink>
      </p>
    </form>
  );
}
