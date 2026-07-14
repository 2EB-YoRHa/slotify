import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import SubscriptionPlanCard from "../../components/subscriptions/SubscriptionPlanCard";
import type {
  OrganizationSummary,
  Subscription,
} from "../../types/subscription";

type SubscriptionShowProps = {
  organization: OrganizationSummary;
  subscription?: Subscription | null;
};

export default function SubscriptionShow({
  organization,
  subscription = null,
}: SubscriptionShowProps) {
  const hasSubscription = Boolean(subscription);

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscription</h1>

          <p className="mt-1 text-slate-500">
            Manage the current plan for{" "}
            {organization?.name || "this organization"}.
          </p>
        </div>

        <Link
          href="/organization"
          className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Back to Organization
        </Link>
      </div>

      {!hasSubscription || !subscription ? (
        <NoSubscription organization={organization} />
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <section className="col-span-2 space-y-6">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-cyan-500">
                      Current Plan
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-slate-900">
                      {capitalize(subscription.plan_name)}
                    </h2>

                    <p className="mt-2 text-slate-500">
                      This plan controls the organization's access to Slotify.
                    </p>
                  </div>

                  <StatusBadge status={subscription.status} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5 p-6">
                <InfoCard
                  label="Status"
                  value={capitalize(subscription.status)}
                />

                <InfoCard
                  label="Starts At"
                  value={formatDate(subscription.starts_at)}
                />

                <InfoCard
                  label="Ends At"
                  value={formatDate(subscription.ends_at)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
              <h2 className="font-bold text-slate-800">
                How subscription works
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                In this version, the subscription is managed internally. A future
                version could connect this module with Stripe or another payment
                provider, but for the current project it is enough to represent
                the organization's plan and status.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <SubscriptionPlanCard
                title="Basic"
                active={subscription.plan_name === "basic"}
                description="For small coworking spaces starting with reservations."
              />

              <SubscriptionPlanCard
                title="Pro"
                active={subscription.plan_name === "pro"}
                description="For growing teams that need more management features."
              />

              <SubscriptionPlanCard
                title="Enterprise"
                active={subscription.plan_name === "enterprise"}
                description="For larger organizations with advanced needs."
              />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Organization
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <SummaryItem label="Name" value={organization?.name || "-"} />
                <SummaryItem label="Slug" value={organization?.slug || "-"} />
                <SummaryItem label="Email" value={organization?.email || "-"} />
              </div>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
              <h2 className="font-bold text-orange-700">Project Scope</h2>

              <p className="mt-2 text-sm leading-6 text-orange-600">
                This screen is intentionally visual. Real payment processing is
                outside the current scope, but the model is ready for future
                integration.
              </p>
            </div>
          </aside>
        </div>
      )}
    </AppLayout>
  );
}

type NoSubscriptionProps = {
  organization: OrganizationSummary;
};

function NoSubscription({ organization }: NoSubscriptionProps) {
  return (
    <div className="flex min-h-[600px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-cyan-50 text-5xl text-cyan-400">
          $
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          No subscription found
        </h2>

        <p className="mt-4 text-lg leading-8 text-slate-500">
          {organization?.name || "This organization"} does not have a
          subscription registered yet. You can add one later through seeds or an
          admin module.
        </p>

        <Link
          href="/organization"
          className="mt-8 inline-block rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
        >
          Back to Organization
        </Link>
      </div>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string | number;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value || "-"}</p>
    </div>
  );
}

type StatusBadgeProps = {
  status?: string | null;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status || "inactive";

  const classes: Record<string, string> = {
    active: "bg-green-50 text-green-600",
    inactive: "bg-slate-100 text-slate-500",
    cancelled: "bg-red-50 text-red-600",
    expired: "bg-orange-50 text-orange-600",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-bold ${
        classes[normalizedStatus] || "bg-slate-100 text-slate-500"
      }`}
    >
      {capitalize(normalizedStatus)}
    </span>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "-";

  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function capitalize(value?: string | null): string {
  if (!value) return "-";

  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}