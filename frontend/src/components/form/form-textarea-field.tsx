"use client";

import { Label, TextArea, TextField } from "@heroui/react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/format";
import { FieldMessage } from "./form-text-field";

interface FormTextAreaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

/** Área de texto do Figma (26:68) ligada ao React Hook Form. */
export function FormTextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
  className,
}: FormTextAreaFieldProps<T>) {
  const {
    field: { ref, name: fieldName, value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });
  return (
    <TextField
      className={cn("w-full", className)}
      name={fieldName}
      aria-label={label}
      value={(value as string | undefined) ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={Boolean(fieldState.error)}
      validationBehavior="aria"
    >
      <Label>{label}</Label>
      <TextArea ref={ref} placeholder={placeholder} rows={rows} className="w-full resize-y" />
      <FieldMessage error={fieldState.error?.message} />
    </TextField>
  );
}
