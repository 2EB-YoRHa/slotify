import { Link } from "@inertiajs/react";

export default function SidebarBrand({
  href,
  billingRequired,
  onClick,
}: {
  href: string;
  billingRequired: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex h-16 items-center px-7">
      <Link href={href} onClick={onClick} className="group inline-block">
        <span className="block text-2xl font-black tracking-[-0.055em] text-slate-950 transition group-hover:text-slate-800 dark:text-white dark:group-hover:text-slate-200">
          Slotify
        </span>

        <span className="mt-1.5 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full transition group-hover:scale-125 ${
              billingRequired ? "bg-amber-400" : "bg-cyan-400"
            }`}
          />

          <span
            className={`h-px w-14 bg-linear-to-r to-transparent ${
              billingRequired ? "from-amber-400" : "from-cyan-400"
            }`}
          />
        </span>
      </Link>
    </div>
  );
}