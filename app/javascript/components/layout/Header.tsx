export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option>Design Studio</option>
        </select>

        <input
          type="text"
          placeholder="Search reservations, users..."
          className="w-96 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg">⌁</span>
        <div className="h-9 w-9 rounded-full bg-slate-200" />
      </div>
    </header>
  );
}