import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <EmptyState
        icon="search"
        title="Página não encontrada"
        description="O endereço pode estar errado ou a página foi removida."
        action={
          <ButtonLink href="/" variant="secondary">
            Voltar ao início
          </ButtonLink>
        }
      />
    </main>
  );
}
