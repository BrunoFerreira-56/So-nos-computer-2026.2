import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "./icon";

type AlertType = "error" | "success" | "info" | "connection";

const STYLES: Record<AlertType, { box: string; icon: IconName; iconClass: string }> = {
  error: { box: "border-ut-error bg-ut-error-subtle", icon: "alert", iconClass: "text-ut-error" },
  success: { box: "border-ut-success bg-ut-success-subtle", icon: "check", iconClass: "text-ut-success" },
  info: { box: "border-ut-info bg-ut-info-subtle", icon: "alert", iconClass: "text-ut-info" },
  connection: { box: "border-ut-border bg-ut-subtle", icon: "wifi-off", iconClass: "text-ut-icon" },
};

interface AlertBannerProps {
  type: AlertType;
  children: ReactNode;
  className?: string;
}

/**
 * Alerta do Figma (26:110): Erro, Sucesso, Info e Conexão.
 * Erros usam role="alert" para serem anunciados por leitores de tela.
 */
export function AlertBanner({ type, children, className }: AlertBannerProps) {
  const style = STYLES[type];
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-ut-md border px-4 py-3", style.box, className)}
    >
      <Icon name={style.icon} tone="inherit" className={cn("mt-0.5", style.iconClass)} />
      <div className="type-body text-ut-text">{children}</div>
    </div>
  );
}
