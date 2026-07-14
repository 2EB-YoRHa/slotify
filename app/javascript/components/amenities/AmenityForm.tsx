import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

type AmenityFormData = {
  name: string;
};

type AmenityFormProps = {
  errors?: {
    name?: string | string[];
  };
};

export default function AmenityForm({ errors = {} }: AmenityFormProps) {
  const { data, setData, post, processing, reset } = useForm<AmenityFormData>({
    name: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/amenities", {
      onSuccess: () => reset("name"),
    });
  }

  const nameError = Array.isArray(errors.name) ? errors.name[0] : errors.name;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Add Amenity</h2>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        Create amenities that managers can assign to each workspace.
      </p>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Amenity Name
        </span>

        <input
          type="text"
          value={data.name}
          onChange={(event) => setData("name", event.target.value)}
          className="input"
          placeholder="Example: Projector"
        />

        {nameError && <p className="mt-2 text-sm text-red-500">{nameError}</p>}
      </label>

      <button
        type="submit"
        disabled={processing}
        className="mt-5 w-full rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
      >
        {processing ? "Saving..." : "Create Amenity"}
      </button>
    </form>
  );
}