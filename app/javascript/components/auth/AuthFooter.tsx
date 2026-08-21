export default function AuthFooter() {
  return (
    <footer className="mt-8 flex flex-col gap-4 text-center text-xs leading-5 text-slate-400 transition-colors dark:text-slate-500 sm:mt-12 md:flex-row md:items-center md:justify-between">
      <p className="wrap-break-word">© 2026 Slotify Inc. All rights reserved.</p>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-end">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Support</span>
      </div>
    </footer>
  );
}