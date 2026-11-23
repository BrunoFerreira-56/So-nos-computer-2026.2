import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

/**
 * `zodResolver` para formulários cujos valores iniciais não cabem no tipo de entrada do schema —
 * tipicamente selects que começam vazios (`""`) e só aceitam um valor da lista.
 *
 * Em tempo de execução nada muda: o schema continua rejeitando `""` com a mensagem certa
 * (ex.: "Escolha uma categoria."). Só o tipo de entrada do formulário é alargado.
 */
export function formResolver<TFieldValues extends FieldValues, TOutput>(
  schema: ZodType<TOutput>,
): Resolver<TFieldValues, unknown, TOutput> {
  return zodResolver(schema as never) as unknown as Resolver<TFieldValues, unknown, TOutput>;
}
