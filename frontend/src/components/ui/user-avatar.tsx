import { Avatar } from "@heroui/react";
import { cn, initials } from "@/lib/format";
import { Icon } from "./icon";

const SIZES = {
  sm: { box: "size-8", text: "text-xs font-medium" },
  md: { box: "size-10", text: "text-sm font-medium" },
  lg: { box: "size-24", text: "font-heading text-[32px] font-bold" },
} as const;

interface UserAvatarProps {
  /** Sem nome, mostra o ícone de usuário (variante "Tipo=Ícone"). */
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Avatar do Figma (83:288): iniciais em azul sobre amarelo-claro, ou ícone sobre cinza. */
export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const { box, text } = SIZES[size];
  return (
    <Avatar className={cn("shrink-0 rounded-full", box, className)}>
      <Avatar.Fallback
        className={cn(
          "flex size-full items-center justify-center rounded-full",
          text,
          name ? "bg-brand-subtle text-brand-text" : "bg-ut-placeholder",
        )}
      >
        {name ? initials(name) : <Icon name="user" />}
      </Avatar.Fallback>
    </Avatar>
  );
}
