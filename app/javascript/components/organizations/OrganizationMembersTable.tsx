import { Link } from "@inertiajs/react";
import { useState } from "react";
import {
  CheckCircle2,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import type { OrganizationUser } from "../../types/organization";

type OrganizationMembersTableProps = {
  users: OrganizationUser[];
  canManage?: boolean;
};

export default function OrganizationMembersTable({
  users,
  canManage = false,
}: OrganizationMembersTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();

    return (
      query.length === 0 ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      formatRole(user.role?.name).toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 transition-colors dark:border-slate-800 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
            Team Members
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Users assigned to this organization.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="px-5 py-10 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
            <UserRound size={24} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            No members found
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try changing the search text.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {filteredUsers.map((user) => (
              <MemberCard key={user.id} user={user} canManage={canManage} />
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-190 w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[46%]" />
                <col className="w-[18%]" />
                <col className="w-[18%]" />
                <col className="w-[18%]" />
              </colgroup>

              <thead className="bg-slate-50 text-slate-500 transition-colors dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left align-middle font-medium">
                    Members
                  </th>

                  <th className="px-6 py-4 text-center align-middle font-medium">
                    Role
                  </th>

                  <th className="px-6 py-4 text-center align-middle font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="h-18 border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 text-left align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={user.name} avatarUrl={user.avatar_url} />

                        <div className="min-w-0 text-left">
                          <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </div>

                          <div className="truncate text-xs text-slate-400 dark:text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center align-middle">
                      <div className="flex justify-center">
                        <RoleBadge role={user.role?.name} />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center align-middle">
                      <div className="flex justify-center">
                        <StatusBadge active={user.active} />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center align-middle">
                      {canManage ? (
                        <Link
                          href={`/organization/members/${user.id}`}
                          className="text-sm font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                          Manage
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-slate-300 dark:text-slate-600">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function MemberCard({
  user,
  canManage,
}: {
  user: OrganizationUser;
  canManage: boolean;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mb-4 flex min-w-0 items-start gap-3">
        <Avatar name={user.name} avatarUrl={user.avatar_url} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-950 dark:text-slate-100">
            {user.name}
          </p>

          <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
            {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60">
        <InfoLine
          icon={<ShieldCheck size={15} />}
          label="Role"
          value={formatRole(user.role?.name)}
        />

        <InfoLine
          icon={
            user.active ? <CheckCircle2 size={15} /> : <XCircle size={15} />
          }
          label="Status"
          value={user.active ? "Active" : "Inactive"}
        />
      </div>

      {canManage && (
        <Link
          href={`/organization/members/${user.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950"
        >
          Manage Member
        </Link>
      )}
    </article>
  );
}

function Avatar({
  name,
  avatarUrl,
}: {
  name?: string | null;
  avatarUrl?: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User"}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-4 ring-cyan-50 dark:ring-cyan-500/10"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 font-bold text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
      {initials(name)}
    </div>
  );
}

function RoleBadge({ role }: { role?: string | null }) {
  return (
    <span className="inline-flex min-w-24 justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {formatRole(role)}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300"
          : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {icon}
        {label}
      </div>

      <p className="truncate text-sm font-bold text-slate-950 dark:text-slate-100">
        {value}
      </p>
    </div>
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

function formatRole(role?: string | null): string {
  if (!role) return "No role";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}