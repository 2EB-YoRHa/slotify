import { Link } from "@inertiajs/react";

type AuthBrandProps = {
  href?: string;
};

export default function AuthBrand({ href = "/users/sign_in" }: AuthBrandProps) {
  return (
    <Link href={href} className="group inline-block max-w-full text-center">
      <span className="block truncate text-3xl font-black tracking-[-0.055em] text-slate-950 transition group-hover:text-slate-800 dark:text-white dark:group-hover:text-slate-200 sm:text-4xl">
        Slotify
      </span>

      <span className="mx-auto mt-2 flex w-fit max-w-full items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400 transition group-hover:scale-125 dark:bg-cyan-300" />
        <span className="h-px w-16 bg-linear-to-r from-cyan-400 to-transparent dark:from-cyan-300 sm:w-20" />
      </span>
    </Link>
  );
}