/**
 * Layout das telas de autenticação (D01–D02c, M01).
 * Desktop: painel institucional à esquerda + formulário de 400 px à direita.
 * Abaixo de 1024 px o painel some e o formulário ocupa a tela.
 */
import Image from "next/image";
import type { ReactNode } from "react";
import campusPhoto from "../../../public/mock/campus.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-ut-canvas">
      <section
        aria-hidden
        className="hidden flex-1 flex-col justify-center gap-6 overflow-hidden bg-brand-subtle p-16 lg:flex"
      >
        <div className="relative h-80 w-full overflow-hidden rounded-ut-md">
          <Image
            src={campusPhoto}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover"
          />
        </div>
        <p className="type-display text-ut-text">Compre e venda entre alunos da UTFPR</p>
        <p className="type-body text-ut-text-secondary">
          Livros, calculadoras, jalecos, eletrônicos e muito mais — negocie com quem estuda no seu campus, sem sair da
          plataforma.
        </p>
      </section>

      <main className="flex w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-[640px] lg:shrink-0">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
