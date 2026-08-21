import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 transition-colors dark:bg-slate-700/70 ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <SkeletonPage>
      <PageTitleSkeleton />
      <StatsGridSkeleton count={4} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <SkeletonCard className="lg:col-span-2">
          <Skeleton className="h-5 w-44 max-w-full" />

          <div className="mt-8 flex h-48 items-end gap-3 sm:h-64 sm:gap-4">
            {["42%", "68%", "50%", "84%", "72%", "58%", "78%"].map(
              (height, index) => (
                <div
                  key={index}
                  className="w-full animate-pulse rounded-lg bg-slate-200/80 transition-colors dark:bg-slate-700/70"
                  style={{ height }}
                />
              ),
            )}
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <Skeleton className="h-5 w-44 max-w-full" />

          <div className="mt-8 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </div>
        </SkeletonCard>
      </div>

      <ResponsiveTableSkeleton rows={4} columns={4} />
    </SkeletonPage>
  );
}

export function WorkspacesSkeleton() {
  return (
    <SkeletonPage>
      <PageHeaderSkeleton actionWidth="w-full sm:w-44" />
      <StatsGridSkeleton count={4} />
      <ToolbarSkeleton filters={3} />
      <MobileCardListSkeleton items={3} />
      <DesktopTableSkeleton rows={5} columns={7} />
    </SkeletonPage>
  );
}

export function ReservationsSkeleton() {
  return (
    <SkeletonPage>
      <PageHeaderSkeleton actionWidth="w-full sm:w-44" />
      <StatsGridSkeleton count={4} />
      <ToolbarSkeleton filters={1} />
      <MobileCardListSkeleton items={4} />
      <DesktopTableSkeleton rows={6} columns={7} />
    </SkeletonPage>
  );
}

export function MyBookingsSkeleton() {
  return (
    <SkeletonPage>
      <PageTitleSkeleton />

      <SkeletonCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 gap-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />

            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-6 w-44 max-w-full" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
          </div>

          <Skeleton className="h-11 w-full rounded-xl sm:w-52" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Skeleton className="h-52 w-full rounded-2xl sm:h-64 lg:h-full" />

          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            <InfoGridSkeleton items={4} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      <SkeletonCard>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(18rem,1fr)_24rem]">
          <Skeleton className="h-12 w-full rounded-xl" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <BookingCardSkeleton key={index} />
          ))}
        </div>
      </SkeletonCard>
    </SkeletonPage>
  );
}

export function NewReservationSkeleton() {
  return (
    <SkeletonPage>
      <PageTitleSkeleton />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <SkeletonCard className="xl:col-span-2">
          <HeaderBlockSkeleton />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <InputSkeleton />
            <InputSkeleton />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <WorkspaceChoiceSkeleton key={index} />
            ))}
          </div>
        </SkeletonCard>

        <SideSummarySkeleton />
      </div>
    </SkeletonPage>
  );
}

export function TimeSlotsSkeleton() {
  return (
    <SkeletonPage>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.22fr] xl:gap-8">
        <SkeletonCard>
          <HeaderBlockSkeleton icon />

          <div className="mt-8 space-y-6">
            <InputSkeleton />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputSkeleton />
              <InputSkeleton />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton key={index} className="h-11 w-full rounded-xl" />
                ))}
              </div>
            </div>

            <Skeleton className="h-28 w-full rounded-2xl" />

            <div className="flex justify-center sm:justify-end">
              <ButtonSkeleton className="w-full sm:w-44" />
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <HeaderBlockSkeleton icon compact />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>

          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <TimeSlotItemSkeleton key={index} />
            ))}
          </div>
        </SkeletonCard>
      </div>
    </SkeletonPage>
  );
}

export function BookingRulesSkeleton() {
  return (
    <SkeletonPage>
      <PageTitleSkeleton />
      <StatsGridSkeleton count={3} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <SkeletonCard className="xl:col-span-2">
          <HeaderBlockSkeleton icon />

          <div className="mt-8 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 border-b border-slate-100 pb-5 last:border-0 dark:border-slate-800 md:grid-cols-[minmax(0,1.4fr)_minmax(12rem,0.7fr)_minmax(0,1fr)]"
              >
                <div className="space-y-3">
                  <Skeleton className="h-4 w-48 max-w-full" />
                  <Skeleton className="h-3 w-72 max-w-full" />
                </div>
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SideSummarySkeleton />
      </div>
    </SkeletonPage>
  );
}

export function OrganizationSkeleton() {
  return (
    <SkeletonPage>
      <PageHeaderSkeleton actionWidth="w-full sm:w-76" />
      <StatsGridSkeleton count={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="space-y-6 xl:col-span-2">
          <SkeletonCard>
            <HeaderBlockSkeleton />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </SkeletonCard>

          <MembersTableSkeleton />
        </div>

        <aside className="space-y-6">
          <SideCardSkeleton />
          <SideCardSkeleton />
        </aside>
      </div>
    </SkeletonPage>
  );
}

export function MemberProfileSkeleton() {
  return (
    <SkeletonPage>
      <PageHeaderSkeleton actionWidth="w-full sm:w-44" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <section className="space-y-6 xl:col-span-2">
          <SkeletonCard>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-7 w-56 max-w-full" />
                <Skeleton className="h-4 w-72 max-w-full" />

                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </SkeletonCard>

          <ResponsiveTableSkeleton rows={4} columns={4} />
        </section>

        <aside className="space-y-6">
          <SideCardSkeleton />
          <SideCardSkeleton />
          <SideCardSkeleton />
        </aside>
      </div>
    </SkeletonPage>
  );
}

export function AmenitiesSkeleton() {
  return (
    <SkeletonPage>
      <SkeletonCard>
        <Skeleton className="h-6 w-44" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <InputSkeleton />
          <ButtonSkeleton className="w-full" />
        </div>
      </SkeletonCard>

      <SkeletonCard>
        <Skeleton className="h-6 w-44" />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </SkeletonCard>
    </SkeletonPage>
  );
}

export function SubscriptionSkeleton() {
  return (
    <SkeletonPage>
      <PageTitleSkeleton />

      <SkeletonCard className="rounded-2xl">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-5 h-9 w-28" />
        <Skeleton className="mt-3 h-4 w-40 max-w-full" />
      </SkeletonCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index}>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-5 h-9 w-24" />

            <div className="mt-8 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>

            <Skeleton className="mt-8 h-11 w-full rounded-xl" />
          </SkeletonCard>
        ))}
      </div>
    </SkeletonPage>
  );
}

export function DefaultPageSkeleton() {
  return (
    <SkeletonPage>
      <PageTitleSkeleton />
      <StatsGridSkeleton count={3} />
      <ResponsiveTableSkeleton rows={5} columns={4} />
    </SkeletonPage>
  );
}

function SkeletonPage({ children }: { children: ReactNode }) {
  return <div className="space-y-6 md:space-y-8">{children}</div>;
}

function SkeletonCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function PageHeaderSkeleton({ actionWidth }: { actionWidth: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <PageTitleSkeleton />
      <div className="flex justify-center sm:justify-end">
        <ButtonSkeleton className={actionWidth} />
      </div>
    </div>
  );
}

function PageTitleSkeleton() {
  return (
    <div className="min-w-0 space-y-3">
      <Skeleton className="h-7 w-44 max-w-full md:h-8 md:w-64" />
      <Skeleton className="h-4 w-64 max-w-full md:w-96" />
    </div>
  );
}

function ButtonSkeleton({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-11 rounded-xl ${className}`} />;
}

function InputSkeleton({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-12 w-full rounded-xl ${className}`} />;
}

function HeaderBlockSkeleton({
  icon = false,
  compact = false,
}: {
  icon?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-4">
      {icon && <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />}

      <div className="min-w-0 flex-1 space-y-3">
        <Skeleton className={`h-7 max-w-full ${compact ? "w-48" : "w-56"}`} />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
    </div>
  );
}

function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-4 w-28 max-w-full" />
              <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32 max-w-full" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

function ToolbarSkeleton({ filters = 2 }: { filters?: number }) {
  return (
    <SkeletonCard className="p-4 sm:p-5 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <InputSkeleton />
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-none lg:flex">
          {Array.from({ length: filters }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl lg:w-40" />
          ))}
        </div>
      </div>
    </SkeletonCard>
  );
}

function ResponsiveTableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      <MobileCardListSkeleton items={Math.min(rows, 4)} />
      <DesktopTableSkeleton rows={rows} columns={columns} />
    </>
  );
}

function DesktopTableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 md:block">
      <div
        className="grid gap-6 border-b border-slate-100 bg-slate-50 px-6 py-4 transition-colors dark:border-slate-800 dark:bg-slate-800/70"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-20 max-w-full" />
        ))}
      </div>

      <div className="divide-y divide-slate-100 transition-colors dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid items-center gap-6 px-6 py-5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={
                  columnIndex === 0
                    ? "h-5 w-36 max-w-full"
                    : "h-5 w-20 max-w-full"
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileCardListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4 md:hidden">
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 gap-3">
                <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-28 max-w-full" />
                  <Skeleton className="h-4 w-36 max-w-full" />
                </div>
              </div>

              <Skeleton className="h-7 w-20 shrink-0 rounded-full" />
            </div>

            <InfoGridSkeleton items={4} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950/40">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <Skeleton className="h-48 w-full rounded-none sm:h-60 lg:col-span-2 lg:h-full" />

        <div className="space-y-5 p-4 sm:p-5 lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          <InfoGridSkeleton items={4} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceChoiceSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-950/40">
      <Skeleton className="h-5 w-44 max-w-full" />
      <Skeleton className="mt-3 h-4 w-28" />

      <InfoGridSkeleton items={4} className="mt-6" />
    </div>
  );
}

function TimeSlotItemSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 transition-colors dark:border-slate-800 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function InfoGridSkeleton({
  items = 4,
  className = "",
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 ${className}`}
    >
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="min-w-0 space-y-2">
          <Skeleton className="h-3 w-16 max-w-full" />
          <Skeleton className="h-5 w-24 max-w-full" />
        </div>
      ))}
    </div>
  );
}

function SideSummarySkeleton() {
  return (
    <SkeletonCard>
      <Skeleton className="h-6 w-48 max-w-full" />
      <Skeleton className="mt-3 h-4 w-56 max-w-full" />

      <div className="mt-8 rounded-xl bg-slate-50 p-5 transition-colors dark:bg-slate-800/60">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0 transition-colors dark:border-slate-700"
          >
            <Skeleton className="h-4 w-24 max-w-full" />
            <Skeleton className="h-4 w-28 max-w-full" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
    </SkeletonCard>
  );
}

function SideCardSkeleton() {
  return (
    <SkeletonCard>
      <Skeleton className="h-6 w-40 max-w-full" />

      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 transition-colors dark:border-slate-700"
          >
            <Skeleton className="h-4 w-28 max-w-full" />
            <Skeleton className="h-4 w-20 max-w-full" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32 max-w-full" />
        <Skeleton className="h-3 w-24 max-w-full" />
      </div>
    </div>
  );
}

function MembersTableSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden p-0 sm:p-0 lg:p-0">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 transition-colors dark:border-slate-800 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        <Skeleton className="h-10 w-full rounded-xl lg:w-72" />
      </div>

      <MobileCardListSkeleton items={4} />
      <DesktopTableSkeleton rows={6} columns={4} />
    </SkeletonCard>
  );
}