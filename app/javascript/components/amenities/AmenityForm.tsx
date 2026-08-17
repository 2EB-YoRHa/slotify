import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { PlusCircle, Sparkles } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import {
  hasValidationErrors,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";

type AmenityFormProps = {
  errors?: Partial<Record<string, string | string[]>>;
};

type AmenityFormData = {
  amenity: {
    name: string;
  };
};

export default function AmenityForm({
  errors: initialErrors = {},
}: AmenityFormProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    reset,
    errors: formErrors,
  } = useForm<AmenityFormData>({
    amenity: {
      name: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const nameError = errors.name || errors["amenity.name"];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateAmenityForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/amenities", {
      preserveScroll: true,
      preserveState: true,
      only: ["amenities", "errors", "flash"],
      onSuccess: () => {
        reset();
        setClientErrors({});
      },
    });
  }

  function updateName(name: string) {
    clearClientError("name");

    setData("amenity", {
      ...data.amenity,
      name,
    });
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`amenity.${field}`];

      return nextErrors;
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
            <PlusCircle size={22} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-950 dark:text-slate-100">
              Create Amenity
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Add a reusable feature that can be assigned to workspaces.
            </p>
          </div>
        </div>

        <label className="block min-w-0">
          <span className="mb-2 flex min-w-0 items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
            <span className="truncate">Amenity Name</span>
            <RequiredMark />
          </span>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="min-w-0">
              <div className="relative">
                <Sparkles
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="text"
                  value={data.amenity.name}
                  onChange={(event) => updateName(event.target.value)}
                  className={`h-12 ${formInputClassName(
                    hasFieldError(nameError),
                  )} dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20`}
                  placeholder="Enter amenity name"
                  disabled={processing}
                />
              </div>

              <FieldError error={nameError} label="Amenity Name" />

              <FieldHint>
                Use a short reusable name, such as Projector, Wi-Fi, or
                Whiteboard.
              </FieldHint>
            </div>

            <LoadingButton
              type="submit"
              loading={processing}
              loadingText="Creating..."
              className="h-12 w-full px-8 sm:w-auto"
            >
              Create Amenity
            </LoadingButton>
          </div>
        </label>
      </div>
    </form>
  );
}

function validateAmenityForm(data: AmenityFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateTextLength(data.amenity.name, "Amenity Name", {
    min: 2,
    max: 60,
  });

  if (nameError) {
    errors.name = nameError;
  }

  return errors;
}