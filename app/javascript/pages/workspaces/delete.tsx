import { Link, router } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  Layers3,
  MapPin,
  ShieldAlert,
  Sparkles,
  Trash2,
  UsersRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingButton from "../../components/ui/LoadingButton";
import type { Amenity } from "../../types/amenity";
import type { Workspace } from "../../types/workspace";

type WorkspaceForDelete = Workspace & {
  amenities?: Amenity[];
  reservations_count?: number | null;
};

type DeleteWorkspaceProps = {
  workspace: WorkspaceForDelete;
  reservation_count?: number;
  reservations_count?: number;
  can_delete?: boolean;
  delete_error?: string | null;
};

export default function DeleteWorkspace({
  workspace,
  reservation_count,
  reservations_count,
  can_delete = true,
  delete_error = null,
}: DeleteWorkspaceProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const totalReservations =
    reservation_count ?? reservations_count ?? workspace.reservations_count ?? 0;

  const amenities = workspace.amenities || [];
  const blocked = !can_delete || Boolean(delete_error);

  function confirmDeleteWorkspace() {
    setProcessing(true);

    router.delete(`/workspaces/${workspace.id}`, {
      onFinish: () => {
        setProcessing(false);
        setConfirmOpen(false);
      },
    });
  }

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href={`/workspaces/${workspace.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
            >
              <ArrowLeft size={16} />
              Back to Workspace
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mt-6 text-sm font-bold uppercase tracking-wide text-red-500"
          >
            Dangerous Action
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-2 text-3xl font-bold text-slate-950"
          >
            Delete Workspace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-1 text-slate-500"
          >
            Review this workspace before permanently removing it from the
            organization.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500"
        >
          <Trash2 size={24} strokeWidth={2.4} />
        </motion.div>
      </div>

      {delete_error && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600"
        >
          <ShieldAlert size={20} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-bold">Deletion blocked</p>
            <p className="mt-1 leading-6">{delete_error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 space-y-8"
        >
          <div className="rounded-xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Are you sure you want to delete this workspace?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This action removes the workspace from the organization. Make
                  sure this space is no longer needed before continuing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <InfoCard icon={Building2} label="Name" value={workspace.name} />

              <InfoCard
                icon={Layers3}
                label="Type"
                value={formatText(workspace.workspace_type)}
              />

              <InfoCard
                icon={UsersRound}
                label="Capacity"
                value={workspace.capacity}
              />

              <InfoCard
                icon={DollarSign}
                label="Hourly Rate"
                value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
              />

              <InfoCard
                icon={MapPin}
                label="Location"
                value={workspace.location || "-"}
              />

              <InfoCard
                icon={workspace.active ? CheckCircle2 : XCircle}
                label="Status"
                value={workspace.active ? "Active" : "Inactive"}
              />

              <InfoCard
                icon={CalendarClock}
                label="Reservations"
                value={totalReservations}
              />

              <InfoCard
                icon={Sparkles}
                label="Amenities"
                value={amenities.length}
              />
            </div>
          </div>

          <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={22}
                className="mt-0.5 shrink-0 text-yellow-600"
              />

              <div>
                <h3 className="font-bold text-yellow-800">
                  Important deletion notice
                </h3>

                <p className="mt-2 text-sm leading-6 text-yellow-700">
                  If this workspace has reservation history, the system may
                  prevent deletion to protect reports and audit records. In that
                  case, it is better to edit the workspace and mark it as
                  inactive.
                </p>
              </div>
            </div>
          </div>

          {amenities.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                  <Sparkles size={26} strokeWidth={2.4} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Assigned Amenities
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    These amenities are currently linked to this workspace.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <motion.div
                    key={amenity.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                      <Sparkles size={18} strokeWidth={2.4} />
                    </div>

                    <p className="font-bold text-slate-900">{amenity.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <ShieldAlert size={26} strokeWidth={2.4} />
              </div>

              <h2 className="text-2xl font-bold text-slate-950">
                Delete Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Confirm the workspace information before deleting.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <SummaryRow label="Workspace" value={workspace.name} />

              <SummaryRow
                label="Type"
                value={formatText(workspace.workspace_type)}
              />

              <SummaryRow label="Capacity" value={workspace.capacity} />

              <SummaryRow
                label="Reservations"
                value={totalReservations}
              />

              <SummaryRow
                label="Status"
                value={workspace.active ? "Active" : "Inactive"}
              />
            </div>

            {blocked ? (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                This workspace cannot be deleted right now.
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                This workspace is ready for deletion.
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <LoadingButton
                type="button"
                variant="danger"
                loading={processing}
                loadingText="Deleting..."
                disabled={blocked}
                onClick={() => setConfirmOpen(true)}
                className="w-full"
              >
                Delete Workspace
              </LoadingButton>

              <Link
                href={`/workspaces/${workspace.id}`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Keep Workspace
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete workspace?"
        description={`This will delete ${workspace.name}. This action cannot be undone.`}
        confirmText="Delete Workspace"
        cancelText="Keep Workspace"
        danger
        processing={processing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteWorkspace}
      />
    </AppLayout>
  );
}

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}