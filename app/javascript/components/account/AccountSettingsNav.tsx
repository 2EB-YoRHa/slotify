import { Link } from "@inertiajs/react";

type AccountSettingsNavProps = {
  active: "profile" | "security";
};

export default function AccountSettingsNav({ active }: AccountSettingsNavProps) {
  return (
    <nav className="flex">
      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        <SettingsTab
          href="/profile"
          active={active === "profile"}
          title="Profile"
        />

        <SettingsTab
          href="/security"
          active={active === "security"}
          title="Security"
        />
      </div>
    </nav>
  );
}

function SettingsTab({
  href,
  active,
  title,
}: {
  href: string;
  active: boolean;
  title: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-5 py-2.5 text-sm font-black transition ${
        active
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {title}
    </Link>
  );
}