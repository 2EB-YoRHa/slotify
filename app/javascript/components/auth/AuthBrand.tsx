import { Link } from "@inertiajs/react";

type AuthBrandProps = {
  href?: string;
};

export default function AuthBrand({ href = "/users/sign_in" }: AuthBrandProps) {
  return (
    <Link href={href} className="group inline-block text-center">
      <span className="block text-4xl font-black tracking-[-0.055em] text-slate-950 transition group-hover:text-slate-800">
        Slotify
      </span>

      <span className="mx-auto mt-2 flex w-fit items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 transition group-hover:scale-125" />
        <span className="h-px w-20 bg-gradient-to-r from-cyan-400 to-transparent" />
      </span>
    </Link>
  );
}