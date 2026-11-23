"use client";

import { InputGroup, Label, TextField } from "@heroui/react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { formatPrice, parsePriceInput } from "@/lib/format";
import { FieldMessage } from "./form-text-field";

interface FormPriceFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
}

/**
 * Campo de preço com máscara "R$ 0,00". O formulário guarda o valor em centavos (número);
 * cada dígito digitado entra pela direita.
 */
export function FormPriceField<T extends FieldValues>({ control, name, label, required }: FormPriceFieldProps<T>) {
  const {
    field: { ref, name: fieldName, value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });
  const cents = (value as number | undefined) ?? 0;

  return (
    <TextField
      className="w-full"
      name={fieldName}
      aria-label={label}
      value={cents ? formatPrice(cents) : ""}
      onChange={(raw) => onChange(parsePriceInput(raw))}
      onBlur={onBlur}
      isInvalid={Boolean(fieldState.error)}
      validationBehavior="aria"
    >
      <Label>
        {label}
        {required ? " *" : null}
      </Label>
      <InputGroup className="w-full">
        <InputGroup.Input ref={ref} placeholder="R$ 0,00" inputMode="numeric" autoComplete="off" />
      </InputGroup>
      <FieldMessage error={fieldState.error?.message} />
    </TextField>
  );
}
