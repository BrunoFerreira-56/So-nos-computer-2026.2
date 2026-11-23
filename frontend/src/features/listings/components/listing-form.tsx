"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { FormPriceField } from "@/components/form/form-price-field";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormTextAreaField } from "@/components/form/form-textarea-field";
import { FormTextField } from "@/components/form/form-text-field";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Icon } from "@/components/ui/icon";
import { notify } from "@/components/ui/notify";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useSession } from "@/features/auth/hooks";
import { CAMPI, CATEGORIES, CONDITIONS } from "@/lib/constants";
import { formResolver } from "@/lib/form";
import type { CampusId, CategoryId, ConditionId, Listing } from "@/types/domain";
import { useCreateListing, useUpdateListing } from "../hooks";
import { REQUIRED_FIELD_LABELS, listingSchema, type ListingInput } from "../schemas";
import { DeleteListingModal } from "./delete-listing-modal";
import { ListingPreview } from "./listing-preview";
import { PhotoPicker } from "./photo-picker";

/** Valores do formulário: selects começam vazios até o usuário escolher. */
interface ListingFormValues {
  title: string;
  priceCents: number;
  category: CategoryId | "";
  condition: ConditionId | "";
  campus: CampusId | "";
  description: string;
  images: string[];
}

const DRAFT_KEY = "utm:listing-draft";
const REQUIRED = Object.keys(REQUIRED_FIELD_LABELS) as (keyof typeof REQUIRED_FIELD_LABELS)[];

/** "Título e Campus" / "Título, Preço e Campus". */
function joinLabels(labels: string[]): string {
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} e ${labels.at(-1)}`;
}

interface ListingFormProps {
  /** Sem `listing`: criar (D08). Com `listing`: editar (D08c). */
  listing?: Listing;
}

/** Formulário de anúncio — criar (D08, D08b, M06) e editar (D08c). US06, US07 · RF06, RF07. */
export function ListingForm({ listing }: ListingFormProps) {
  const isEdit = Boolean(listing);
  const router = useRouter();
  const { data: user } = useSession();
  const create = useCreateListing();
  const update = useUpdateListing(listing?.id ?? "");
  const mutation = isEdit ? update : create;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { control, handleSubmit, reset, getValues, formState } = useForm<ListingFormValues, unknown, ListingInput>({
    resolver: formResolver<ListingFormValues, ListingInput>(listingSchema),
    defaultValues: listing
      ? {
          title: listing.title,
          priceCents: listing.priceCents,
          category: listing.category,
          condition: listing.condition,
          campus: listing.campus,
          description: listing.description,
          images: listing.images,
        }
      : { title: "", priceCents: 0, category: "", condition: "", campus: "", description: "", images: [] },
  });

  // Restaura o rascunho salvo neste navegador (só ao criar).
  useEffect(() => {
    if (isEdit) return;
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        reset(JSON.parse(saved) as ListingFormValues);
      } catch {
        window.localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [isEdit, reset]);

  const values = useWatch({ control });
  const filled = REQUIRED.filter((field) => {
    const value = values[field];
    return typeof value === "number"
      ? value > 0
      : Boolean(value && String(value).trim().length >= (field === "title" ? 3 : 1));
  }).length;
  const progress = Math.round((filled / REQUIRED.length) * 100);

  // Resumo "Faltam N campos obrigatórios" (D08b): só depois da primeira tentativa de publicar.
  const missing = REQUIRED.filter((field) => formState.errors[field]).map((field) => REQUIRED_FIELD_LABELS[field]);

  function onValid(input: ListingInput) {
    if (isEdit && listing) {
      update.mutate(input, {
        onSuccess: () => {
          notify("Alterações salvas.");
          router.push(`/anuncios/${listing.id}`);
        },
      });
    } else {
      create.mutate(input, {
        onSuccess: (created) => {
          window.localStorage.removeItem(DRAFT_KEY);
          notify("Anúncio publicado! Ele já aparece no hub.");
          router.push(`/anuncios/${created.id}`);
        },
      });
    }
  }

  function onInvalid(errors: FieldErrors<ListingFormValues>) {
    // Leva o usuário ao topo, onde está o resumo dos campos faltando.
    if (Object.keys(errors).length) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveDraft() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(getValues()));
    notify("Rascunho salvo neste navegador.");
  }

  const title = isEdit ? "Editar anúncio" : "Novo anúncio";

  return (
    <>
      <MobileTopBar title={title} backHref={isEdit && listing ? `/anuncios/${listing.id}` : "/"} />

      <div className="flex flex-1 flex-col lg:flex-row">
        <form
          noValidate
          onSubmit={handleSubmit(onValid, onInvalid)}
          className="flex w-full flex-col lg:w-[480px] lg:shrink-0 lg:border-r lg:border-ut-border"
          aria-labelledby="listing-form-title"
        >
          <div className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-6 md:px-6 md:pt-6">
            <div className="hidden items-end justify-between gap-4 md:flex">
              <div className="flex flex-col">
                <p className="type-caption text-ut-text-secondary">UTMarket › Vender</p>
                <h1 id="listing-form-title" className="type-title-1 text-ut-text">
                  {title}
                </h1>
              </div>
              {isEdit && listing ? (
                <Link
                  href={`/anuncios/${listing.id}`}
                  className="type-body-strong text-ut-link underline underline-offset-2"
                >
                  Ver anúncio
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={saveDraft}
                  className="cursor-pointer type-body-strong text-ut-link underline underline-offset-2"
                >
                  Salvar rascunho
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <UserAvatar name={user?.name} />
              <div className="flex flex-col">
                <span className="type-body text-ut-text">{user?.name}</span>
                <span className="type-caption text-ut-text-secondary">Anúncio visível para alunos da UTFPR</span>
              </div>
            </div>

            {missing.length > 0 ? (
              <AlertBanner type="error">
                {missing.length === 1 ? "Falta 1 campo obrigatório" : `Faltam ${missing.length} campos obrigatórios`}:{" "}
                {joinLabels(missing)}. Preencha para {isEdit ? "salvar" : "publicar"}.
              </AlertBanner>
            ) : null}
            {mutation.error ? <AlertBanner type="error">{mutation.error.message}</AlertBanner> : null}

            <Controller
              control={control}
              name="images"
              render={({ field }) => <PhotoPicker value={field.value} onChange={field.onChange} />}
            />

            <div className="flex flex-col gap-1">
              <h2 className="type-title-3 text-ut-text">Obrigatório</h2>
              <p className="type-caption text-ut-text-secondary">
                Seja o mais descritivo possível. * campos obrigatórios
              </p>
            </div>

            <FormTextField
              control={control}
              name="title"
              label="Título"
              placeholder="Ex.: Calculadora HP 50g"
              required
            />
            <FormPriceField control={control} name="priceCents" label="Preço" required />
            <FormSelectField
              control={control}
              name="category"
              label="Categoria"
              placeholder="Selecione uma categoria"
              options={CATEGORIES}
              required
            />
            <FormSelectField
              control={control}
              name="condition"
              label="Condição"
              placeholder="Novo ou usado?"
              options={CONDITIONS}
              required
            />
            <FormSelectField
              control={control}
              name="campus"
              label="Campus"
              placeholder="Selecione o campus"
              options={CAMPI}
              required
            />
            <FormTextAreaField
              control={control}
              name="description"
              label="Descrição"
              placeholder="Conte o estado do produto, tempo de uso, se acompanha acessórios…"
            />
          </div>

          {/* Rodapé fixo: progresso dos campos obrigatórios + ação principal */}
          <div className="sticky bottom-0 flex flex-col gap-3 border-t border-ut-border bg-ut-canvas px-4 py-4 md:px-6">
            <div
              role="progressbar"
              aria-label="Campos obrigatórios preenchidos"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1 w-full overflow-hidden rounded-full bg-ut-muted"
            >
              <div
                className="h-full rounded-full bg-selected transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Button type="submit" fullWidth isPending={mutation.isPending}>
              {isEdit ? "Salvar alterações" : "Publicar anúncio"}
            </Button>
            {isEdit ? (
              <Button variant="ghost" fullWidth onPress={() => setDeleteOpen(true)}>
                <Icon name="trash" tone="inherit" />
                Excluir anúncio
              </Button>
            ) : (
              <Button variant="ghost" fullWidth className="md:hidden" onPress={saveDraft}>
                Salvar rascunho
              </Button>
            )}
          </div>
        </form>

        {/* Prévia (desktop largo) */}
        <aside className="hidden flex-1 flex-col gap-4 bg-ut-subtle p-8 lg:flex" aria-label="Prévia do anúncio">
          <p className="type-body-strong text-ut-text">Prévia</p>
          <ListingPreview
            title={values.title ?? ""}
            priceCents={values.priceCents ?? 0}
            campus={values.campus ?? ""}
            description={values.description ?? ""}
            image={values.images?.[0]}
            sellerName={user?.name}
          />
        </aside>
      </div>

      {listing ? (
        <DeleteListingModal
          listing={deleteOpen ? listing : null}
          onOpenChange={setDeleteOpen}
          onDeleted={() => router.push("/meus-anuncios")}
        />
      ) : null}
    </>
  );
}
