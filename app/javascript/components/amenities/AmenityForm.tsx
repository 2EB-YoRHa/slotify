import { useForm } from "@inertiajs/react";
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
  };

  const nameError = errors.name || errors["amenity.name"];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/amenities", {
      preserveScroll: true,
      preserveState: true,
      only: ["amenities", "errors", "flash"],
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-[1fr_2fr] items-end gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
              <PlusCircle size={20} strokeWidth={2.4} />
            </div>

            <h2 className="text-xl font-bold text-slate-950">Create Amenity</h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Add a reusable feature that can be assigned to workspaces.
          </p>
        </div>

        <div>
          <label className="block">
            <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
              Amenity Name
              <RequiredMark />
            </span>

            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div>
                <div className="relative">
                  <Sparkles
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={data.amenity.name}
                    onChange={(event) =>
                      setData("amenity", {
                        ...data.amenity,
                        name: event.target.value,
                      })
                    }
                    className={`h-12 ${formInputClassName(
                      hasFieldError(nameError),
                    )}`}
                    placeholder="Enter amenity name"
                    disabled={processing}
                  />
                </div>

                <FieldHint>
                  Use a short reusable name, such as Projector, Wi-Fi, or
                  Whiteboard.
                </FieldHint>

                <FieldError error={nameError} label="Amenity Name" />
              </div>

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Creating..."
                className="h-12 px-8"
              >
                Create Amenity
              </LoadingButton>
            </div>
          </label>
        </div>
      </div>
    </form>
  );
}