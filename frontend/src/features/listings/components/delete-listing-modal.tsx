"use client";

import { Button, Modal } from "@heroui/react";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Icon } from "@/components/ui/icon";
import { notify } from "@/components/ui/notify";
import { useDeleteListing } from "../hooks";

interface DeleteListingModalProps {
  listing: { id: string; title: string } | null;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

/** Confirmar exclusão (D09c) — US07 · RF07. Aberto quando `listing` não é nulo. */
export function DeleteListingModal({ listing, onOpenChange, onDeleted }: DeleteListingModalProps) {
  const remove = useDeleteListing();

  function close() {
    onOpenChange(false);
    remove.reset();
  }

  return (
    <Modal.Backdrop isOpen={listing !== null} onOpenChange={(open) => (open ? undefined : close())}>
      <Modal.Container placement="center">
        <Modal.Dialog className="sm:max-w-[480px]" role="alertdialog">
          <Modal.CloseTrigger>
            <Icon name="x" />
          </Modal.CloseTrigger>
          <Modal.Header>
            <Modal.Heading>Excluir anúncio?</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-3">
            <p>
              &quot;{listing?.title}&quot; deixará de aparecer no hub e na busca. Esta ação não pode ser desfeita. Se
              você só vendeu o item, prefira &quot;Marcar como vendido&quot;.
            </p>
            {remove.error ? <AlertBanner type="error">{remove.error.message}</AlertBanner> : null}
          </Modal.Body>
          <Modal.Footer className="flex justify-end gap-2">
            <Button variant="secondary" onPress={close}>
              Cancelar
            </Button>
            <Button
              isPending={remove.isPending}
              onPress={() => {
                if (!listing) return;
                remove.mutate(listing.id, {
                  onSuccess: () => {
                    close();
                    notify("Anúncio excluído.");
                    onDeleted?.();
                  },
                });
              }}
            >
              <Icon name="trash" tone="inherit" />
              Excluir anúncio
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
