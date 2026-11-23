"use client";

import { Button, Label, Modal, TextArea, TextField } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { FieldMessage } from "@/components/form/form-text-field";
import { AlertBanner } from "@/components/ui/alert-banner";
import { filterChipClass } from "@/components/ui/filter-chip";
import { Icon } from "@/components/ui/icon";
import { notify } from "@/components/ui/notify";
import { RatingInput } from "@/components/ui/rating-stars";
import { useCreateReview } from "@/features/profile/hooks";
import { RATING_LABEL, REVIEW_TAGS } from "@/lib/constants";
import { formResolver } from "@/lib/form";
import { firstName } from "@/lib/format";
import type { GrammaticalGender } from "@/types/domain";
import { reviewSchema, type ReviewFormValues, type ReviewInput } from "../schemas";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; name: string; gender?: GrammaticalGender };
  /** Anúncio negociado, quando a avaliação parte do chat (ex.: "Calculadora HP 50g"). */
  listing?: { id: string; title: string };
}

/** Modal "Avaliar usuário" (D10b) + toast "Avaliação registrada" (D10c) — US14 · RF14. */
export function ReviewModal({ isOpen, onOpenChange, user, listing }: ReviewModalProps) {
  const review = useCreateReview(user.id);
  const { control, handleSubmit, reset } = useForm<ReviewFormValues, unknown, ReviewInput>({
    resolver: formResolver<ReviewFormValues, ReviewInput>(reviewSchema),
    defaultValues: { rating: 0, tags: [], comment: "", listingId: listing?.id },
  });

  function close() {
    onOpenChange(false);
    reset();
    review.reset();
  }

  function onSubmit(values: ReviewInput) {
    review.mutate(values, {
      onSuccess: () => {
        close();
        notify(`Avaliação registrada! Ela aparecerá no perfil de ${firstName(user.name)}.`);
      },
    });
  }

  const pronoun = user.gender === "a" ? "dela" : user.gender === "o" ? "dele" : `de ${firstName(user.name)}`;
  const intro = listing
    ? `Como foi sua negociação de "${listing.title}"?`
    : `Como foi sua negociação com ${firstName(user.name)}?`;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => (open ? onOpenChange(true) : close())}>
      <Modal.Container placement="center">
        <Modal.Dialog className="sm:max-w-[520px]">
          <Modal.CloseTrigger>
            <Icon name="x" />
          </Modal.CloseTrigger>
          <Modal.Header>
            <Modal.Heading>Avaliar {user.name}</Modal.Heading>
          </Modal.Header>

          <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col">
            <Modal.Body className="flex flex-col gap-5 overflow-visible">
              <p>
                {intro} Sua avaliação ficará visível no perfil {pronoun}.
              </p>

              <Controller
                control={control}
                name="rating"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col items-center gap-2 rounded-ut-md bg-ut-subtle px-4 py-5">
                    <RatingInput value={field.value} onChange={field.onChange} />
                    <p className="type-body text-ut-text" aria-live="polite">
                      {field.value
                        ? `${field.value} de 5 · ${RATING_LABEL[field.value]}`
                        : "Toque nas estrelas para dar uma nota"}
                    </p>
                    <FieldMessage error={fieldState.error?.message} />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <div role="group" aria-label="O que foi bom?" className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.map((tag) => {
                      const selected = field.value.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          aria-pressed={selected}
                          className={filterChipClass(selected)}
                          onClick={() =>
                            field.onChange(
                              selected ? field.value.filter((t) => t !== tag.id) : [...field.value, tag.id],
                            )
                          }
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="comment"
                render={({ field, fieldState }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={Boolean(fieldState.error)}
                    validationBehavior="aria"
                    className="w-full"
                  >
                    <Label>Comentário (opcional)</Label>
                    <TextArea
                      ref={field.ref}
                      rows={4}
                      placeholder="Conte como foi a negociação para ajudar outros alunos…"
                      className="w-full"
                    />
                    <FieldMessage error={fieldState.error?.message} />
                  </TextField>
                )}
              />

              {review.error ? <AlertBanner type="error">{review.error.message}</AlertBanner> : null}
            </Modal.Body>

            <Modal.Footer className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onPress={close}>
                Cancelar
              </Button>
              <Button type="submit" isPending={review.isPending}>
                <Icon name="star" tone="inherit" />
                Enviar avaliação
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
