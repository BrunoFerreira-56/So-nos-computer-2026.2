"use client";

import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormTextField } from "@/components/form/form-text-field";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Icon } from "@/components/ui/icon";
import { notify } from "@/components/ui/notify";
import { useForgotPassword } from "../hooks";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas";
import { AuthHeading } from "./auth-heading";

const RESEND_COOLDOWN_S = 60;

/** Recuperar senha (D02) e confirmação de envio (D02b) — US12 · RF12. */
export function ForgotPasswordFlow() {
  const forgot = useForgotPassword();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function send(values: ForgotPasswordInput) {
    forgot.mutate(values, { onSuccess: (data) => setSentTo(data.sentTo) });
  }

  if (sentTo) {
    return (
      <InstructionsSent
        email={sentTo}
        isResending={forgot.isPending}
        onResend={() =>
          forgot.mutate({ email: sentTo }, { onSuccess: () => notify("Enviamos um novo e-mail de recuperação.") })
        }
      />
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(send)} className="flex flex-col gap-6">
      <AuthHeading
        backToLogin
        title="Recuperar senha"
        description="Informe seu e-mail institucional. Enviaremos um link para você criar uma nova senha."
      />
      {forgot.error ? <AlertBanner type="error">{forgot.error.message}</AlertBanner> : null}
      <FormTextField
        control={control}
        name="email"
        type="email"
        label="E-mail institucional"
        placeholder="seunome@alunos.utfpr.edu.br"
        icon="mail"
        autoComplete="email"
        description="Use o mesmo e-mail do cadastro."
      />
      <Button type="submit" fullWidth isPending={forgot.isPending}>
        <Icon name="mail" tone="inherit" />
        Enviar instruções
      </Button>
    </form>
  );
}

function InstructionsSent({
  email,
  isResending,
  onResend,
}: {
  email: string;
  isResending: boolean;
  onResend: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_S);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div className="flex flex-col gap-6">
      <AuthHeading backToLogin title="Verifique seu e-mail" />
      <AlertBanner type="info">
        Enviamos as instruções para <strong className="font-medium break-all">{email}</strong>. O link expira em 30
        minutos.
      </AlertBanner>
      <p className="type-body text-ut-text-secondary" aria-live="polite">
        {secondsLeft > 0
          ? `Não recebeu? Confira a caixa de spam ou reenvie em ${secondsLeft} s.`
          : "Não recebeu? Confira a caixa de spam ou reenvie agora."}
      </p>
      <Button
        variant="secondary"
        fullWidth
        isDisabled={secondsLeft > 0}
        isPending={isResending}
        onPress={() => {
          onResend();
          setSecondsLeft(RESEND_COOLDOWN_S);
        }}
      >
        Reenviar e-mail
      </Button>
      {/* Sem servidor de e-mail no mock: atalho para o link que chegaria na caixa de entrada. */}
      <p className="text-center type-caption text-ut-text-muted">
        Ambiente de demonstração:{" "}
        <Link href={`/nova-senha?email=${encodeURIComponent(email)}`} className="text-ut-link underline">
          abrir o link do e-mail
        </Link>
      </p>
    </div>
  );
}
