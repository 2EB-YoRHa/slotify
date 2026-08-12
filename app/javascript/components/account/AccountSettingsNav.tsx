import { Link } from "@inertiajs/react";
import { LockKeyhole, UserRound } from "lucide-react";

type AccountSettingsNavProps = {
  active: "profile" | "security";
};

export default function AccountSettingsNav({ active }: AccountSettingsNavProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <SettingsTab
          href="/profile"
          active={active === "profile"}
          icon={UserRound}
          title="Profile"
          description="Photo, name, email and organization"
        />

        <SettingsTab
          href="/security"
          active={active === "security"}
          icon={LockKeyhole}
          title="Security"
          description="Password and two-factor authentication"
        />
      </div>
    </section>
  );
}

function SettingsTab({
  href,
  active,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  active: boolean;
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-2xl p-4 transition ${
        active
          ? "bg-cyan-50 text-cyan-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition ${
          active
            ? "bg-cyan-400 text-white shadow-cyan-100"
            : "bg-white text-slate-400 ring-1 ring-slate-200 group-hover:text-cyan-500"
        }`}
      >
        <Icon size={22} strokeWidth={2.4} />
      </div>

      <div className="min-w-0">
        <p
          className={`text-sm font-black ${
            active ? "text-slate-950" : "text-slate-800"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1 text-xs font-semibold leading-5 ${
            active ? "text-cyan-700" : "text-slate-400"
          }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}