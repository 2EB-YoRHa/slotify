import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { PlusCircle, Sparkles } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";

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
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Amenity Name
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
                    className="h-12 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                    placeholder="Projector, Wi-Fi, Whiteboard..."
                    disabled={processing}
                    required
                  />
                </div>

                <FormError error={errors.name || errors["amenity.name"]} />
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

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}
