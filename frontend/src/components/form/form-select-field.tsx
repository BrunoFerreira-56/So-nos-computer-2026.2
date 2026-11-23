"use client";

import { Label, ListBox, Select } from "@heroui/react";
import type { Key } from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/format";
import { FieldMessage } from "./form-text-field";

interface Option {
  id: string;
  name: string;
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: Option[];
  required?: boolean;
  className?: string;
}

/** Select do Figma (26:61) ligado ao React Hook Form. Valor vazio = `""`. */
export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  required,
  className,
}: FormSelectFieldProps<T>) {
  const {
    field: { ref, name: fieldName, value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });

  return (
    <Select
      className={cn("w-full", className)}
      name={fieldName}
      aria-label={label}
      placeholder={placeholder}
      value={(value as string | undefined) || null}
      onChange={(key: Key | Key[] | null) => onChange(key === null || Array.isArray(key) ? "" : String(key))}
      onBlur={onBlur}
      isInvalid={Boolean(fieldState.error)}
      validationBehavior="aria"
    >
      <Label>
        {label}
        {required ? " *" : null}
      </Label>
      <Select.Trigger ref={ref} className="w-full">
        <Select.Value />
        <Select.Indicator>
          <Icon name="chevron-down" />
        </Select.Indicator>
      </Select.Trigger>
      <FieldMessage error={fieldState.error?.message} />
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
              {option.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
