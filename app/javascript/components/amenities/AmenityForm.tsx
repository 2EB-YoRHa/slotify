import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import LoadingButton from "../ui/LoadingButton";

type AmenityFormProps = {
  errors?: Partial<Record<string, string | string[]>>;
};

type AmenityFormData = {
  amenity: {
    name: string;
  };
};

export default function AmenityForm({ errors: initialErrors = {} }: AmenityFormProps) {
  const { data, setData, post, processing, reset, errors: formErrors } =
    useForm<AmenityFormData>({
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
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-950">Create Amenity</h2>

        <p className="mt-1 text-sm text-slate-500">
          Add amenities that can be assigned to workspaces.
        </p>
      </div>

      <div className="flex items-start gap-4">
        <label className="flex-1">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Amenity Name
          </span>

          <input
            type="text"
            value={data.amenity.name}
            onChange={(event) =>
              setData("amenity", {
                ...data.amenity,
                name: event.target.value,
              })
            }
            className="input"
            placeholder="Projector, Wi-Fi, Whiteboard..."
            disabled={processing}
            required
          />

          <FormError error={errors.name || errors["amenity.name"]} />
        </label>

        <div className="pt-7">
          <LoadingButton
            type="submit"
            loading={processing}
            loadingText="Creating..."
          >
            Create Amenity
          </LoadingButton>
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