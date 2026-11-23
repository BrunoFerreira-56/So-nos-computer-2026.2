"use client";

import { Description, FieldError, InputGroup, Label, TextField } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/format";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  /** Ícone à esquerda do campo (ex.: mail, lock, user). */
  icon?: IconName;
  type?: "text" | "email" | "password" | "search";
  autoComplete?: string;
  inputMode?: ComponentProps<"input">["inputMode"];
  /** Texto de ajuda com ícone de cadeado, como no Figma ("Aceitamos apenas e-mail institucional"). */
  description?: ReactNode;
  /** Adiciona " *" ao rótulo (campos obrigatórios do formulário de anúncio). */
  required?: boolean;
  /**
   * Força o estado de erro sem mensagem própria — ex.: senha com borda vermelha
   * quando o alerta de credenciais inválidas aparece (D01c).
   */
  forceInvalid?: boolean;
  /** Converte o texto digitado antes de guardar no formulário (ex.: máscara de preço). */
  format?: (raw: string) => string;
  className?: string;
}

/**
 * Campo de texto do Figma (26:60) ligado ao React Hook Form.
 * Estados: Default, Foco (borda azul) e Erro (borda vermelha + mensagem com ícone).
 */
export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon,
  type = "text",
  autoComplete,
  inputMode,
  description,
  required,
  forceInvalid,
  format,
  className,
}: FormTextFieldProps<T>) {
  // `ref` separado do resto: o lint do React Compiler trata o objeto inteiro como ref se lido junto.
  const {
    field: { ref, name: fieldName, value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });
  const error = fieldState.error?.message;
  const invalid = Boolean(error) || forceInvalid;

  return (
    <TextField
      className={cn("w-full", className)}
      name={fieldName}
      aria-label={label}
      type={type}
      value={(value as string | undefined) ?? ""}
      onChange={(next) => onChange(format ? format(next) : next)}
      onBlur={onBlur}
      isInvalid={invalid}
      validationBehavior="aria"
    >
      <Label>
        {label}
        {required ? " *" : null}
      </Label>
      <InputGroup className="w-full">
        {icon ? (
          <InputGroup.Prefix>
            <Icon name={icon} />
          </InputGroup.Prefix>
        ) : null}
        <InputGroup.Input ref={ref} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} />
      </InputGroup>
      <FieldMessage error={error} description={description} />
    </TextField>
  );
}

/** Mensagem abaixo do campo: erro (vermelho, ícone de alerta) ou ajuda (cinza, cadeado). */
export function FieldMessage({ error, description }: { error?: string; description?: ReactNode }) {
  if (error) {
    return (
      <FieldError className="flex items-start gap-1">
        <Icon name="alert" size={16} tone="inherit" className="mt-px" />
        <span>{error}</span>
      </FieldError>
    );
  }
  if (description) {
    return (
      <Description className="flex items-start gap-1">
        <Icon name="lock" size={16} className="mt-px" />
        <span>{description}</span>
      </Description>
    );
  }
  return null;
}
