import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import type { Role } from "../../types/organization";

type InviteMemberModalProps = {
  open: boolean;
  roles: Role[];
  onClose: () => void;
};

type InvitationFormData = {
  email: string;
  role_id: number | string;
};

export default function InviteMemberModal({
  open,
  roles,
  onClose,
}: InviteMemberModalProps) {
  const defaultRole = roles.find((role) => role.name === "member") || roles[0];

  const { data, setData, post, processing, reset } =
    useForm<InvitationFormData>({
      email: "",
      role_id: defaultRole?.id || "",
    });

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/organization_invitations", {
      data: {
        organization_invitation: {
          email: data.email,
          role_id: data.role_id,
        },
      },
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="grid grid-cols-2">
          <div className="border-r border-slate-200 bg-slate-50 p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-2xl text-cyan-500">
              +
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Invite New Member
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Send an invitation to a teammate so they can join this
              organization and access Slotify.
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <InfoItem
                title="Role Based Access"
                description="Assign member or manager permissions."
              />

              <InfoItem
                title="Workspace Access"
                description="Members can reserve active workspaces."
              />

              <InfoItem
                title="Secure Invitation"
                description="A unique token is generated for each invite."
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Invitation Details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Complete the email and initial role.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </span>

              <input
                type="email"
                value={data.email}
                onChange={(event) => setData("email", event.target.value)}
                className="input"
                placeholder="name@company.com"
                required
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Initial Role
              </span>

              <select
                value={data.role_id}
                onChange={(event) => setData("role_id", event.target.value)}
                className="input"
                required
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {formatRole(role.name)}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={processing}
                className="flex-1 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
              >
                {processing ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type InfoItemProps = {
  title: string;
  description: string;
};

function InfoItem({ title, description }: InfoItemProps) {
  return (
    <div>
      <p className="font-bold text-slate-800">{title}</p>
      <p className="mt-1 leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function formatRole(role: string): string {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}