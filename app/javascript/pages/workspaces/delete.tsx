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
    reservation_count ??
    reservations_count ??
    workspace.reservations_count ??
    0;

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
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href={`/workspaces/${workspace.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            <span className="truncate">Back to Workspace</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 sm:mt-6 sm:text-3xl"
        >
          Delete Workspace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base"
        >
          Review workspace details and confirm whether it can be safely removed.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border border-yellow-100 bg-yellow-50 p-4 sm:mb-8 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={22}
            className="mt-0.5 shrink-0 text-yellow-600"
          />

          <div className="min-w-0">
            <h3 className="font-bold text-yellow-800">
              Important deletion notice
            </h3>

            <p className="mt-2 text-sm leading-6 text-yellow-700">
              If this workspace has reservation history, the system may prevent
              deletion to protect reports and audit records. In that case, it is
              better to edit the workspace and mark it as inactive.
            </p>
          </div>
        </div>
      </motion.div>

      {delete_error && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 sm:mb-8 sm:p-5"
        >
          <ShieldAlert size={20} className="mt-0.5 shrink-0" />

          <div className="min-w-0">
            <p className="font-bold">Deletion blocked</p>
            <p className="mt-1 wrap-break-word leading-6">{delete_error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-6 xl:col-span-2 xl:space-y-8"
        >
          <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 sm:h-14 sm:w-14">
                <Trash2 size={24} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  Are you sure you want to delete this workspace?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This action removes the workspace from the organization. Make
                  sure this space is no longer needed before continuing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
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

          {amenities.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
              <div className="mb-6 flex items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 sm:h-14 sm:w-14">
                  <Sparkles size={24} strokeWidth={2.4} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                    Assigned Amenities
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    These amenities are currently linked to this workspace.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {amenities.map((amenity, index) => (
                  <motion.div
                    key={amenity.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                      <Sparkles size={18} strokeWidth={2.4} />
                    </div>

                    <p className="truncate font-bold text-slate-900">
                      {amenity.name}
                    </p>
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
          className="space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                Delete Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Confirm the workspace information before deleting.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
              <SummaryRow label="Workspace" value={workspace.name} />

              <SummaryRow
                label="Type"
                value={formatText(workspace.workspace_type)}
              />

              <SummaryRow label="Capacity" value={workspace.capacity} />

              <SummaryRow label="Reservations" value={totalReservations} />

              <SummaryRow
                label="Status"
                value={workspace.active ? "Active" : "Inactive"}
              />
            </div>

            {blocked ? (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600">
                This workspace cannot be deleted right now.
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-700">
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
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} className="shrink-0" />
        <p className="truncate text-xs font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="wrap-break-word text-sm font-bold text-slate-950 sm:text-right">
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