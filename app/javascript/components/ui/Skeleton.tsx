type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageTitleSkeleton />

      <StatsGridSkeleton count={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <Skeleton className="h-5 w-44 max-w-full" />

          <div className="mt-6 flex h-48 items-end gap-3 sm:mt-8 sm:h-64 sm:gap-4">
            {["42%", "68%", "50%", "84%", "72%", "58%", "78%"].map(
              (height, index) => (
                <div
                  key={index}
                  className="w-full animate-pulse rounded-lg bg-slate-200/80"
                  style={{ height }}
                />
              ),
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <Skeleton className="h-5 w-44 max-w-full" />

          <div className="mt-6 space-y-5 sm:mt-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>

      <ResponsiveTableSkeleton rows={4} columns={4} />
    </div>
  );
}

export function WorkspacesSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ActionTitleSkeleton buttonWidth="w-40" />

      <StatsGridSkeleton count={4} />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-10 w-full lg:w-96" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>
        </div>

        <ResponsiveTableSkeleton rows={5} columns={7} embedded />
      </div>
    </div>
  );
}

export function ReservationsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ActionTitleSkeleton buttonWidth="w-44" />

      <StatsGridSkeleton count={4} />

      <ResponsiveTableSkeleton rows={6} columns={5} />
    </div>
  );
}

export function NewReservationSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageTitleSkeleton />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8 xl:col-span-2">
          <Skeleton className="h-7 w-52 max-w-full" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-12 w-full sm:flex-1" />
            <Skeleton className="h-12 w-full sm:w-44" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <Skeleton className="h-5 w-44 max-w-full" />
                <Skeleton className="mt-3 h-4 w-28" />

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8 xl:sticky xl:top-24 xl:self-start">
          <Skeleton className="h-6 w-48 max-w-full" />
          <Skeleton className="mt-3 h-4 w-56 max-w-full" />

          <div className="mt-8 space-y-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          <SummarySkeleton rows={4} />

          <Skeleton className="mt-8 h-12 w-full" />
        </aside>
      </div>
    </div>
  );
}

export function OrganizationSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ActionTitleSkeleton buttonWidth="w-40" secondButtonWidth="w-40" />

      <StatsGridSkeleton count={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="space-y-6 xl:col-span-2 xl:space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <Skeleton className="h-6 w-52 max-w-full" />
            <Skeleton className="mt-3 h-4 w-72 max-w-full" />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-slate-50 p-4 sm:p-5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-4 h-5 w-44 max-w-full" />
                </div>
              ))}
            </div>
          </div>

          <MembersTableSkeleton />
        </div>

        <aside className="space-y-6 xl:space-y-8">
          <SideCardSkeleton />
          <SideCardSkeleton />
        </aside>
      </div>
    </div>
  );
}

export function MemberProfileSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ActionTitleSkeleton buttonWidth="w-44" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <section className="space-y-6 xl:col-span-2 xl:space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-7 w-56 max-w-full" />
                <Skeleton className="mt-3 h-4 w-72 max-w-full" />

                <div className="mt-4 flex flex-wrap gap-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-slate-50 p-4 sm:p-5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-4 h-5 w-44 max-w-full" />
                </div>
              ))}
            </div>
          </div>

          <ResponsiveTableSkeleton rows={4} columns={4} />
        </section>

        <aside className="space-y-6">
          <SideCardSkeleton />
          <SideCardSkeleton />
        </aside>
      </div>
    </div>
  );
}

export function AmenitiesSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageTitleSkeleton />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <Skeleton className="h-6 w-44 max-w-full" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-12 w-full sm:flex-1" />
          <Skeleton className="h-12 w-full sm:w-40" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <Skeleton className="h-6 w-44 max-w-full" />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubscriptionSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageTitleSkeleton />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-5 h-9 w-28" />
        <Skeleton className="mt-3 h-4 w-40 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-5 h-9 w-24" />

            <div className="mt-8 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>

            <Skeleton className="mt-8 h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DefaultPageSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageTitleSkeleton />
      <StatsGridSkeleton count={3} />
      <ResponsiveTableSkeleton rows={5} columns={4} />
    </div>
  );
}

function PageTitleSkeleton() {
  return (
    <div className="min-w-0">
      <Skeleton className="h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
    </div>
  );
}

function ActionTitleSkeleton({
  buttonWidth,
  secondButtonWidth,
}: {
  buttonWidth: string;
  secondButtonWidth?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <PageTitleSkeleton />

      <div className="grid grid-cols-1 gap-3 sm:flex sm:shrink-0">
        <Skeleton className={`h-11 w-full ${skeletonButtonWidthClass(buttonWidth)}`} />
        {secondButtonWidth && (
          <Skeleton
            className={`h-11 w-full ${skeletonButtonWidthClass(secondButtonWidth)}`}
          />
        )}
      </div>
    </div>
  );
}

function skeletonButtonWidthClass(width: string): string {
  if (width === "w-44") return "sm:w-44";
  if (width === "w-40") return "sm:w-40";

  return "sm:w-40";
}

function StatsGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:p-6">
      <Skeleton className="h-4 w-28 max-w-full" />
      <Skeleton className="mt-5 h-8 w-20" />
      <Skeleton className="mt-4 h-3 w-32 max-w-full" />
    </div>
  );
}

function SideCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <Skeleton className="h-6 w-40 max-w-full" />

      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
            <Skeleton className="h-4 w-28 max-w-[60%]" />
            <Skeleton className="h-4 w-20 max-w-[35%]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-32 max-w-full" />
        <Skeleton className="mt-2 h-3 w-24 max-w-full" />
      </div>
    </div>
  );
}

function MembersTableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Skeleton className="h-6 w-40 max-w-full" />
          <Skeleton className="mt-3 h-4 w-64 max-w-full" />
        </div>

        <Skeleton className="h-10 w-full lg:w-72" />
      </div>

      <ResponsiveTableSkeleton rows={6} columns={4} embedded />
    </div>
  );
}

function SummarySkeleton({ rows }: { rows: number }) {
  return (
    <div className="mt-8 rounded-xl bg-slate-50 p-4 sm:p-5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
          <Skeleton className="h-4 w-24 max-w-[45%]" />
          <Skeleton className="h-4 w-28 max-w-[45%]" />
        </div>
      ))}
    </div>
  );
}

function ResponsiveTableSkeleton({
  rows = 5,
  columns = 4,
  embedded = false,
}: {
  rows?: number;
  columns?: number;
  embedded?: boolean;
}) {
  const content = (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, rowIndex) => (
          <div key={rowIndex} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <ListItemSkeleton />
            <SummarySkeleton rows={Math.min(columns, 3)} />
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div
          className="grid min-w-190 border-b border-slate-100 bg-slate-50 px-6 py-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-24 max-w-full" />
          ))}
        </div>

        <div className="min-w-190 divide-y divide-slate-100">
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
                      ? "h-5 w-40 max-w-full"
                      : "mx-auto h-6 w-24 max-w-full rounded-full"
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (embedded) return <>{content}</>;

  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{content}</div>;
}