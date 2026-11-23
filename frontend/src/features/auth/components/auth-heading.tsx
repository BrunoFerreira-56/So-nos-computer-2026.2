import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

interface AuthHeadingProps {
  title: string;
  description?: ReactNode;
  /** Link "‹ Voltar para o login" acima do logo (D02, D02b). */
  backToLogin?: boolean;
}

/** Cabeçalho comum das telas de autenticação: logo animado, título e descrição. */
export function AuthHeading({ title, description, backToLogin }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-6">
      {backToLogin ? (
        <Link
          href="/login"
          className="-mb-2 inline-flex w-fit items-center gap-1 rounded-ut-sm type-body text-ut-text hover:underline"
        >
          <Icon name="chevron-left" size={16} />
          Voltar para o login
        </Link>
      ) : null}
      <Logo size="lg" animated />
      <div className="flex flex-col gap-1">
        <h1 className="type-title-1 text-ut-text">{title}</h1>
        {description ? <p className="type-body text-ut-text-secondary">{description}</p> : null}
      </div>
    </div>
  );
}

/** Link sublinhado das telas de autenticação ("Criar conta", "Esqueci minha senha"). */
export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="rounded-ut-sm type-body-strong text-ut-link underline underline-offset-2">
      {children}
    </Link>
  );
}
