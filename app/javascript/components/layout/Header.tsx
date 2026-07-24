import { usePage } from "@inertiajs/react";

type SharedCurrentUser = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
};

type SharedPageProps = {
  current_user?: SharedCurrentUser | null;
};

export default function Header() {
  const { current_user } = usePage<SharedPageProps>().props;

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Slotify
        </p>

        <p className="text-sm text-slate-500">
          Coworking reservation management
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
          Active Session
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-500">
          {initials(current_user?.name)}
        </div>
      </div>
    </header>
  );
}

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}