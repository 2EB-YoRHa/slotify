export default function AuthFooter() {
  return (
    <footer className="mt-12 flex flex-col gap-4 text-center text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
      <p>© 2026 Slotify Inc. All rights reserved.</p>

      <div className="flex flex-wrap items-center justify-center gap-5 md:justify-end">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Support</span>
      </div>
    </footer>
  );
}