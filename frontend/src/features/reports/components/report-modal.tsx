"use client";

import { Button, Label, Modal, Radio, RadioGroup, TextArea, TextField } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { FieldMessage } from "@/components/form/form-text-field";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Icon } from "@/components/ui/icon";
import { notify } from "@/components/ui/notify";
import { useCreateReport } from "@/features/profile/hooks";
import { REPORT_REASONS } from "@/lib/constants";
import { formResolver } from "@/lib/form";
import { reportSchema, type ReportFormValues, type ReportInput } from "../schemas";

interface ReportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  target: { type: "listing" | "user"; id: string; name: string };
}

/**
 * Modal "Reportar anúncio" (D06b) e "Reportar perfil" — US13 · RF13.
 * Ao enviar, fecha e mostra o toast de confirmação (D06c).
 */
export function ReportModal({ isOpen, onOpenChange, target }: ReportModalProps) {
  const report = useCreateReport();
  const { control, handleSubmit, reset } = useForm<ReportFormValues, unknown, ReportInput>({
    resolver: formResolver<ReportFormValues, ReportInput>(reportSchema),
    defaultValues: { targetType: target.type, targetId: target.id, reason: "golpe", details: "" },
  });

  function close() {
    onOpenChange(false);
    reset();
    report.reset();
  }

  function onSubmit(values: ReportInput) {
    report.mutate(values, {
      onSuccess: () => {
        close();
        notify("Denúncia registrada. Obrigado por ajudar a manter o UTMarket seguro!");
      },
    });
  }

  const isListing = target.type === "listing";

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => (open ? onOpenChange(true) : close())}>
      <Modal.Container placement="center">
        <Modal.Dialog className="sm:max-w-[520px]">
          <Modal.CloseTrigger>
            <Icon name="x" />
          </Modal.CloseTrigger>
          <Modal.Header>
            <Modal.Heading>{isListing ? "Reportar anúncio" : "Reportar perfil"}</Modal.Heading>
          </Modal.Header>

          <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col">
            <Modal.Body className="flex flex-col gap-5 overflow-visible">
              <p>
                Por que você está reportando &quot;{target.name}&quot;? Sua denúncia é anônima para{" "}
                {isListing ? "o anunciante" : "o usuário"}.
              </p>

              <Controller
                control={control}
                name="reason"
                render={({ field, fieldState }) => (
                  <RadioGroup
                    aria-label="Motivo da denúncia"
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={Boolean(fieldState.error)}
                    className="flex flex-col"
                  >
                    {REPORT_REASONS.map((reason) => (
                      <Radio key={reason.id} value={reason.id}>
                        <Radio.Content>
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          {reason.label}
                        </Radio.Content>
                      </Radio>
                    ))}
                    <FieldMessage error={fieldState.error?.message} />
                  </RadioGroup>
                )}
              />

              <Controller
                control={control}
                name="details"
                render={({ field, fieldState }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={Boolean(fieldState.error)}
                    validationBehavior="aria"
                    className="w-full"
                  >
                    <Label>Detalhes (opcional)</Label>
                    <TextArea
                      ref={field.ref}
                      rows={4}
                      placeholder="Conte o que você percebeu de suspeito…"
                      className="w-full"
                    />
                    <FieldMessage error={fieldState.error?.message} />
                  </TextField>
                )}
              />

              {report.error ? <AlertBanner type="error">{report.error.message}</AlertBanner> : null}
            </Modal.Body>

            <Modal.Footer className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onPress={close}>
                Cancelar
              </Button>
              <Button type="submit" isPending={report.isPending}>
                <Icon name="flag" tone="inherit" />
                Enviar denúncia
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
