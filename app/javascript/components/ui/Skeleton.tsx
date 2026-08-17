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
    <div className="space-y-8">
      <PageTitleSkeleton />

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
          <Skeleton className="h-5 w-44" />

          <div className="mt-8 flex h-64 items-end gap-4">
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
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
          <Skeleton className="h-5 w-44" />

          <div className="mt-8 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>

      <TableSkeleton rows={4} columns={4} />
    </div>
  );
}

export function WorkspacesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <PageTitleSkeleton />
        <Skeleton className="h-11 w-40" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 transition-colors dark:border-slate-800">
          <Skeleton className="h-10 w-96" />

          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <TableSkeleton rows={5} columns={7} embedded />
      </div>
    </div>
  );
}

export function ReservationsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <PageTitleSkeleton />
        <Skeleton className="h-11 w-44" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>

      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}

export function NewReservationSkeleton() {
  return (
    <div className="space-y-8">
      <PageTitleSkeleton />

      <div className="grid grid-cols-3 gap-6">
        <section className="col-span-2 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="mt-3 h-4 w-80" />

          <div className="mt-8 grid grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="mt-8 flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-44" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-950/40"
              >
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-3 h-4 w-28" />

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-3 h-4 w-56" />

          <div className="mt-8 space-y-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5 transition-colors dark:bg-slate-800/60">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-slate-200 py-3 last:border-0 transition-colors dark:border-slate-700"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>

          <Skeleton className="mt-8 h-12 w-full" />
        </aside>
      </div>
    </div>
  );
}

export function OrganizationSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <PageTitleSkeleton />

        <div className="flex gap-3">
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-40" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="mt-3 h-4 w-72" />

            <div className="mt-8 grid grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-5 transition-colors dark:bg-slate-800/60"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-4 h-5 w-44" />
                </div>
              ))}
            </div>
          </div>

          <MembersTableSkeleton />
        </div>

        <aside className="space-y-8">
          <SideCardSkeleton />
          <SideCardSkeleton />
        </aside>
      </div>
    </div>
  );
}

export function MemberProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <PageTitleSkeleton />
        <Skeleton className="h-11 w-44" />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
            <div className="flex items-start gap-5">
              <Skeleton className="h-16 w-16 rounded-full" />

              <div>
                <Skeleton className="h-7 w-56" />
                <Skeleton className="mt-3 h-4 w-72" />

                <div className="mt-4 flex gap-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-5 transition-colors dark:bg-slate-800/60"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-4 h-5 w-44" />
                </div>
              ))}
            </div>
          </div>

          <TableSkeleton rows={4} columns={4} />
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
    <div className="space-y-8">
      <PageTitleSkeleton />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="mt-3 h-4 w-72" />

        <div className="mt-6 flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
        <Skeleton className="h-6 w-44" />

        <div className="mt-6 grid grid-cols-3 gap-4">
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
    <div className="space-y-8">
      <PageTitleSkeleton />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-5 h-9 w-28" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
          >
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
    <div className="space-y-8">
      <PageTitleSkeleton />
      <div className="grid grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <TableSkeleton rows={5} columns={4} />
    </div>
  );
}

function PageTitleSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-96" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-5 h-8 w-20" />
      <Skeleton className="mt-4 h-3 w-32" />
    </div>
  );
}

function SideCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <Skeleton className="h-6 w-40" />

      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 transition-colors dark:border-slate-700"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />

      <div className="flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-24" />
      </div>
    </div>
  );
}

function MembersTableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 transition-colors dark:border-slate-800">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-3 h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-72" />
      </div>

      <TableSkeleton rows={6} columns={4} embedded />
    </div>
  );
}

function TableSkeleton({
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
      <div
        className="grid border-b border-slate-100 bg-slate-50 px-6 py-4 transition-colors dark:border-slate-800 dark:bg-slate-800/70"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-24" />
        ))}
      </div>

      <div className="divide-y divide-slate-100 transition-colors dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid items-center gap-6 px-6 py-5"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={
                  columnIndex === 0
                    ? "h-5 w-40"
                    : "mx-auto h-6 w-24 rounded-full"
                }
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) return <>{content}</>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      {content}
    </div>
  );
}